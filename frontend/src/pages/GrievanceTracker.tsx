/**
 * GrievanceTracker.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Full grievance lifecycle dashboard page.
 * Lists all grievance records, shows their status, and allows the citizen to
 * open the ClosureVerificationPanel for any RESOLVED_PENDING_VERIFICATION or
 * SUSPICIOUS_CLOSURE grievance.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Loader2,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Filter,
  User,
} from 'lucide-react';
import { GrievanceRecord, GrievanceStatus, ClosureVerificationResult } from '../types';
import { api } from '../services/api';
import { ClosureVerificationPanel } from '../components/common/ClosureVerificationPanel';

// ── Status configuration ──────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  GrievanceStatus,
  { label: string; icon: React.ReactNode; bgClass: string; textClass: string; borderStyle: string }
> = {
  OPEN: {
    label: 'Open',
    icon: <Clock className="w-3.5 h-3.5" />,
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-400',
    borderStyle: 'rgba(96, 165, 250, 0.25)',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-400',
    borderStyle: 'rgba(251, 191, 36, 0.25)',
  },
  RESOLVED_PENDING_VERIFICATION: {
    label: 'Awaiting Your Verification',
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
    bgClass: 'bg-indigo-500/10',
    textClass: 'text-indigo-400',
    borderStyle: 'rgba(129, 140, 248, 0.4)',
  },
  VERIFIED_CLOSED: {
    label: 'Verified & Closed',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-400',
    borderStyle: 'rgba(74, 222, 128, 0.25)',
  },
  REJECTED_REOPENED: {
    label: 'Rejected — Reopened',
    icon: <RotateCcw className="w-3.5 h-3.5" />,
    bgClass: 'bg-rose-500/10',
    textClass: 'text-rose-400',
    borderStyle: 'rgba(248, 113, 113, 0.25)',
  },
  SUSPICIOUS_CLOSURE: {
    label: 'Suspicious Closure ⚠️',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-400',
    borderStyle: 'rgba(251, 146, 60, 0.4)',
  },
};

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: '', label: 'All Grievances' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED_PENDING_VERIFICATION', label: 'Awaiting Verification' },
  { value: 'SUSPICIOUS_CLOSURE', label: 'Suspicious Closure' },
  { value: 'VERIFIED_CLOSED', label: 'Verified & Closed' },
  { value: 'REJECTED_REOPENED', label: 'Rejected' },
];

function formatRelativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

// ── GrievanceCard ─────────────────────────────────────────────────────────────

function GrievanceCard({
  record,
  onOpenVerification,
}: {
  record: GrievanceRecord;
  onOpenVerification: (r: GrievanceRecord) => void;
}) {
  const cfg = STATUS_CONFIG[record.status];
  const evidence = record.resolution_evidence;
  const isActionable =
    record.status === 'RESOLVED_PENDING_VERIFICATION' ||
    record.status === 'SUSPICIOUS_CLOSURE';

  return (
    <div
      className="rounded-xl p-4 border transition-all duration-150"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: isActionable ? cfg.borderStyle : 'var(--border)',
        boxShadow: isActionable ? `0 0 0 1px ${cfg.borderStyle}` : 'none',
      }}
      id={`grievance-card-${record.id}`}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.bgClass} ${cfg.textClass}`}
            >
              {cfg.icon}
              {cfg.label}
            </span>
            <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
              {record.id}
            </span>
            {record.is_demo && (
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded border"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              >
                DEMO
              </span>
            )}
          </div>

          <p
            className="text-sm font-semibold mt-2 line-clamp-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {evidence?.original_description ??
              `Complaint filed against Request #${record.citizen_request_id}`}
          </p>

          <div className="flex items-center gap-3 mt-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {record.citizen_name}
            </span>
            {evidence && (
              <span className="capitalize px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}>
                {evidence.original_category}
              </span>
            )}
            <span>{formatRelativeDate(record.updated_at)}</span>
          </div>
        </div>

        {/* AI score badge */}
        {record.ai_confidence_score != null && (
          <div className="text-right shrink-0">
            <div
              className="text-lg font-extrabold font-mono leading-none"
              style={{
                color:
                  record.ai_confidence_score >= 60
                    ? '#4ade80'
                    : record.ai_confidence_score >= 40
                    ? '#fb923c'
                    : '#f87171',
              }}
            >
              {record.ai_confidence_score.toFixed(0)}
            </div>
            <div className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>
              AI score
            </div>
          </div>
        )}
      </div>

      {/* Staff resolution snippet */}
      {evidence?.resolution_notes && (
        <div
          className="mt-3 px-3 py-2 rounded-lg text-xs border-l-2"
          style={{
            backgroundColor: 'var(--surface-hover)',
            borderLeftColor: 'var(--accent)',
            color: 'var(--text-muted)',
          }}
        >
          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Staff notes: </span>
          {evidence.resolution_notes.length > 120
            ? evidence.resolution_notes.slice(0, 120) + '…'
            : evidence.resolution_notes}
        </div>
      )}

      {/* CTA */}
      {isActionable && (
        <button
          id={`verify-btn-${record.id}`}
          onClick={() => onOpenVerification(record)}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer"
          style={{
            background: `linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, transparent))`,
            color: '#fff',
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {record.status === 'SUSPICIOUS_CLOSURE'
            ? 'Review Suspicious Closure'
            : 'Verify This Resolution'}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Citizen feedback snippet (rejected state) */}
      {record.citizen_feedback && record.status === 'REJECTED_REOPENED' && (
        <div
          className="mt-2 text-xs px-3 py-2 rounded-lg"
          style={{ backgroundColor: 'rgba(248, 113, 113, 0.08)', color: '#f87171' }}
        >
          <span className="font-bold">Your feedback: </span>
          {record.citizen_feedback}
        </div>
      )}
    </div>
  );
}

// ── Page Component ─────────────────────────────────────────────────────────────

export const GrievanceTracker: React.FC = () => {
  const [grievances, setGrievances] = useState<GrievanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceRecord | null>(null);

  const loadGrievances = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getGrievances(statusFilter || undefined);
      setGrievances(data);
    } catch (err: unknown) {
      // Fallback to demo data if API is not running
      console.warn('Backend offline — using seeded demo data stub.');
      setGrievances([]);
      setError('Backend API is not reachable. Showing empty state.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadGrievances();
  }, [loadGrievances]);

  const handleActionComplete = useCallback(
    (_result: ClosureVerificationResult, updated: GrievanceRecord) => {
      setGrievances((prev) =>
        prev.map((g) => (g.id === updated.id ? updated : g))
      );
      // Keep modal open to show result; user closes manually
    },
    []
  );

  // Summary counts
  const pending = grievances.filter(
    (g) =>
      g.status === 'RESOLVED_PENDING_VERIFICATION' || g.status === 'SUSPICIOUS_CLOSURE'
  ).length;
  const verified = grievances.filter((g) => g.status === 'VERIFIED_CLOSED').length;
  const rejected = grievances.filter((g) => g.status === 'REJECTED_REOPENED').length;

  return (
    <div className="space-y-6" id="grievance-tracker-page">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h1 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
              Grievance Resolution Tracker
            </h1>
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Anti-Fake Closure system — verify municipal resolutions before permanent closure
          </p>
        </div>
        <button
          id="refresh-grievances-btn"
          onClick={loadGrievances}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Summary Stat Chips ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: grievances.length, color: 'var(--accent)' },
          { label: 'Awaiting Verification', value: pending, color: '#818cf8' },
          { label: 'Verified Closed', value: verified, color: '#4ade80' },
          { label: 'Rejected / Reopened', value: rejected, color: '#f87171' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-3 border text-center"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="text-2xl font-extrabold" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-[10px] mt-0.5 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            id={`filter-${f.value || 'all'}`}
            onClick={() => setStatusFilter(f.value)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer"
            style={{
              backgroundColor: statusFilter === f.value ? 'var(--accent-subtle)' : 'var(--surface)',
              color: statusFilter === f.value ? 'var(--accent)' : 'var(--text-muted)',
              border: `1px solid ${statusFilter === f.value ? 'var(--accent)' : 'var(--border)'}`,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
            Loading grievance records…
          </span>
        </div>
      ) : error ? (
        <div
          className="flex items-center gap-3 p-4 rounded-xl border text-sm"
          style={{
            backgroundColor: 'rgba(248, 113, 113, 0.08)',
            borderColor: 'rgba(248, 113, 113, 0.3)',
            color: '#f87171',
          }}
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      ) : grievances.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 gap-3 rounded-xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <ShieldCheck className="w-10 h-10" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
            No grievances found for the selected filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {grievances.map((g) => (
            <GrievanceCard
              key={g.id}
              record={g}
              onOpenVerification={setSelectedGrievance}
            />
          ))}
        </div>
      )}

      {/* ── Closure Verification Panel Modal ────────────────────────────────── */}
      <ClosureVerificationPanel
        grievance={selectedGrievance}
        onClose={() => setSelectedGrievance(null)}
        onActionComplete={handleActionComplete}
      />
    </div>
  );
};
