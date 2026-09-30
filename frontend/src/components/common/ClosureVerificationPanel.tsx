/**
 * ClosureVerificationPanel.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Citizen-Verified Resolution Loop — Anti-Fake Closure UI
 *
 * Full-screen modal shown to a citizen when their grievance transitions to
 * RESOLVED_PENDING_VERIFICATION. Displays:
 *   1. Original complaint context ("Before")
 *   2. Staff resolution evidence ("After")
 *   3. Two action buttons: Confirm Resolution / Reject & Reopen
 *   4. AI confidence score badge (shown after confirm attempt)
 *   5. SUSPICIOUS_CLOSURE warning state with feedback prompt
 */

import React, { useState, useCallback } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Clock,
  User,
  FileText,
  Camera,
  ChevronRight,
  Loader2,
  X,
  RotateCcw,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { GrievanceRecord, GrievanceStatus, ClosureVerificationResult } from '../../types';
import { api } from '../../services/api';

// ── Status metadata helpers ───────────────────────────────────────────────────

const STATUS_META: Record<
  GrievanceStatus,
  { label: string; color: string; icon: React.ReactNode; description: string }
> = {
  OPEN: {
    label: 'Open',
    color: 'text-blue-400',
    icon: <Clock className="w-4 h-4" />,
    description: 'Complaint submitted, awaiting staff action.',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'text-amber-400',
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    description: 'Municipal staff are working on this complaint.',
  },
  RESOLVED_PENDING_VERIFICATION: {
    label: 'Pending Your Verification',
    color: 'text-indigo-400',
    icon: <ShieldCheck className="w-4 h-4" />,
    description: 'Staff marked as resolved. Your confirmation is required.',
  },
  VERIFIED_CLOSED: {
    label: 'Verified & Closed',
    color: 'text-emerald-400',
    icon: <CheckCircle2 className="w-4 h-4" />,
    description: 'You confirmed this resolution. The grievance is permanently closed.',
  },
  REJECTED_REOPENED: {
    label: 'Rejected — Reopened',
    color: 'text-rose-400',
    icon: <RotateCcw className="w-4 h-4" />,
    description: 'You rejected the resolution. The complaint is back with staff.',
  },
  SUSPICIOUS_CLOSURE: {
    label: 'Suspicious Closure',
    color: 'text-amber-400',
    icon: <ShieldAlert className="w-4 h-4" />,
    description: 'AI detected this closure may be fake. Please review carefully.',
  },
};

const URGENCY_COLOR: Record<string, string> = {
  CRITICAL: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  HIGH: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  MEDIUM: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  LOW: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ConfidenceMeter({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score));
  const color =
    pct >= 75 ? '#4ade80' : pct >= 60 ? '#818cf8' : pct >= 40 ? '#fb923c' : '#f87171';
  const label = pct >= 75 ? 'High Confidence' : pct >= 60 ? 'Plausible' : pct >= 40 ? 'Suspicious' : 'Likely Fake';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-mono">
        <span style={{ color: 'var(--text-muted)' }}>AI Closure Authenticity</span>
        <span style={{ color }} className="font-extrabold">
          {pct.toFixed(0)}/100 — {label}
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--surface-hover)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
        Threshold: 60/100 — Below threshold triggers Suspicious Closure flag
      </div>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ClosureVerificationPanelProps {
  /** The grievance to display. Pass null to close the modal. */
  grievance: GrievanceRecord | null;
  onClose: () => void;
  /** Callback after a successful action — parent should refresh grievance list. */
  onActionComplete: (result: ClosureVerificationResult, updatedGrievance: GrievanceRecord) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const ClosureVerificationPanel: React.FC<ClosureVerificationPanelProps> = ({
  grievance,
  onClose,
  onActionComplete,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [lastResult, setLastResult] = useState<ClosureVerificationResult | null>(null);
  const [currentStatus, setCurrentStatus] = useState<GrievanceStatus | null>(null);

  const status = currentStatus ?? grievance?.status ?? null;
  const evidence = grievance?.resolution_evidence ?? null;
  const meta = status ? STATUS_META[status] : null;

  const handleConfirm = useCallback(async () => {
    if (!grievance) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.verifyClosure(grievance.id, { action: 'confirm' });
      setLastResult(result);
      setCurrentStatus(result.new_status);
      if (result.new_status !== 'SUSPICIOUS_CLOSURE') {
        const updated: GrievanceRecord = { ...grievance, status: result.new_status };
        onActionComplete(result, updated);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to confirm resolution. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [grievance, onActionComplete]);

  const handleReject = useCallback(async () => {
    if (!grievance) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.verifyClosure(grievance.id, {
        action: 'reject',
        citizen_feedback: rejectFeedback || undefined,
      });
      setLastResult(result);
      setCurrentStatus(result.new_status);
      const updated: GrievanceRecord = { ...grievance, status: result.new_status };
      onActionComplete(result, updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reject resolution. Please try again.');
    } finally {
      setLoading(false);
      setShowRejectForm(false);
    }
  }, [grievance, rejectFeedback, onActionComplete]);

  if (!grievance) return null;

  const isActionable =
    status === 'RESOLVED_PENDING_VERIFICATION' || status === 'SUSPICIOUS_CLOSURE';

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      id="closure-verification-backdrop"
    >
      {/* Modal Shell */}
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
        id="closure-verification-modal"
      >
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2
                className="text-base font-extrabold leading-none"
                style={{ color: 'var(--text-primary)' }}
              >
                Resolution Verification
              </h2>
              <p className="text-[11px] mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>
                {grievance.id} · {grievance.citizen_name}
              </p>
            </div>
          </div>

          {/* Status pill */}
          {meta && (
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${meta.color}`}
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--accent-subtle)' }}
              >
                {meta.icon}
                {meta.label}
              </span>
              <button
                onClick={onClose}
                id="closure-modal-close-btn"
                className="p-1.5 rounded-lg transition cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* ── Body ───────────────────────────────────────────────────────────── */}
        <div className="flex-1 p-6 space-y-6">

          {/* ── AI Warning Banner (Suspicious Closure) ────────────────────── */}
          {(status === 'SUSPICIOUS_CLOSURE' || lastResult?.is_suspicious) && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl border"
              style={{
                backgroundColor: 'rgba(251, 146, 60, 0.08)',
                borderColor: 'rgba(251, 146, 60, 0.3)',
              }}
              id="suspicious-closure-banner"
            >
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-extrabold text-amber-400">
                  ⚠️ AI Detected Suspicious Closure
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {lastResult?.ai_validation_notes ||
                    grievance.ai_validation_notes ||
                    'The AI guardrail has flagged this closure as potentially inauthentic. Please review the evidence carefully before confirming.'}
                </p>
                {(lastResult?.ai_confidence_score ?? grievance.ai_confidence_score) != null && (
                  <div className="mt-3">
                    <ConfidenceMeter
                      score={lastResult?.ai_confidence_score ?? grievance.ai_confidence_score ?? 0}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Success / Final State Banner ──────────────────────────────── */}
          {status === 'VERIFIED_CLOSED' && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl border"
              style={{
                backgroundColor: 'rgba(74, 222, 128, 0.08)',
                borderColor: 'rgba(74, 222, 128, 0.3)',
              }}
              id="verified-closed-banner"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-extrabold text-emerald-400">✅ Resolution Verified & Closed</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {lastResult?.message ?? 'This grievance has been permanently closed.'}
                </p>
                {(lastResult?.ai_confidence_score ?? grievance.ai_confidence_score) != null && (
                  <div className="mt-3">
                    <ConfidenceMeter
                      score={lastResult?.ai_confidence_score ?? grievance.ai_confidence_score ?? 0}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {status === 'REJECTED_REOPENED' && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl border"
              style={{
                backgroundColor: 'rgba(248, 113, 113, 0.08)',
                borderColor: 'rgba(248, 113, 113, 0.3)',
              }}
              id="rejected-reopened-banner"
            >
              <RotateCcw className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-extrabold text-rose-400">🔄 Resolution Rejected — Complaint Reopened</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {lastResult?.message ?? 'The complaint has been sent back to municipal staff for further action.'}
                </p>
              </div>
            </div>
          )}

          {/* ── Error Banner ──────────────────────────────────────────────── */}
          {error && (
            <div
              className="flex items-center gap-3 p-3 rounded-xl border text-sm"
              style={{
                backgroundColor: 'rgba(248, 113, 113, 0.08)',
                borderColor: 'rgba(248, 113, 113, 0.3)',
                color: '#f87171',
              }}
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* ── Before / After Evidence Grid ─────────────────────────────── */}
          {evidence && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* BEFORE — Original Complaint */}
              <div
                className="rounded-xl p-4 space-y-3 border"
                style={{ backgroundColor: 'var(--surface-hover)', borderColor: 'var(--border)' }}
                id="before-evidence-panel"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-rose-500/20 flex items-center justify-center">
                    <span className="text-rose-400 text-[10px] font-extrabold">●</span>
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Before — Original Complaint
                  </h3>
                </div>

                {/* Before image or placeholder */}
                {evidence.before_image_url ? (
                  <img
                    src={evidence.before_image_url}
                    alt="Before — original issue photo"
                    className="w-full h-36 object-cover rounded-lg border"
                    style={{ borderColor: 'var(--border)' }}
                  />
                ) : (
                  <div
                    className="w-full h-36 rounded-lg border flex flex-col items-center justify-center gap-2"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
                  >
                    <Camera className="w-6 h-6" style={{ color: 'var(--text-muted)' }} />
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      No before-photo attached
                    </span>
                  </div>
                )}

                <p
                  className="text-xs leading-relaxed line-clamp-4"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {evidence.original_description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      URGENCY_COLOR[evidence.original_urgency] ?? URGENCY_COLOR.MEDIUM
                    }`}
                  >
                    {evidence.original_urgency}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                    style={{
                      backgroundColor: 'var(--accent-subtle)',
                      borderColor: 'var(--border)',
                      color: 'var(--accent)',
                    }}
                  >
                    {evidence.original_category}
                  </span>
                  <span
                    className="text-[10px] font-mono"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Filed: {formatDate(evidence.original_submitted_at)}
                  </span>
                </div>
              </div>

              {/* AFTER — Staff Resolution Evidence */}
              <div
                className="rounded-xl p-4 space-y-3 border"
                style={{ backgroundColor: 'var(--surface-hover)', borderColor: 'var(--border)' }}
                id="after-evidence-panel"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-400 text-[10px] font-extrabold">●</span>
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    After — Staff Resolution
                  </h3>
                </div>

                {/* After image or placeholder */}
                {evidence.after_image_url ? (
                  <img
                    src={evidence.after_image_url}
                    alt="After — resolution photo submitted by staff"
                    className="w-full h-36 object-cover rounded-lg border"
                    style={{ borderColor: 'var(--border)' }}
                  />
                ) : (
                  <div
                    className="w-full h-36 rounded-lg border flex flex-col items-center justify-center gap-2"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
                  >
                    <Camera className="w-6 h-6" style={{ color: 'var(--text-muted)' }} />
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      No after-photo submitted
                    </span>
                  </div>
                )}

                <p
                  className="text-xs leading-relaxed line-clamp-4"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {evidence.resolution_notes}
                </p>

                <div className="flex flex-wrap items-center gap-1.5">
                  <User className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                    {evidence.resolved_by_staff_name}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                    · {formatDate(evidence.resolution_submitted_at)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── AI Confidence (pre-loaded from backend) ───────────────────── */}
          {grievance.ai_confidence_score != null &&
            status !== 'SUSPICIOUS_CLOSURE' &&
            !lastResult && (
              <div
                className="p-4 rounded-xl border space-y-2"
                style={{ backgroundColor: 'var(--surface-hover)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  <span className="text-xs font-extrabold" style={{ color: 'var(--text-primary)' }}>
                    AI Pre-Analysis
                  </span>
                </div>
                <ConfidenceMeter score={grievance.ai_confidence_score} />
                {grievance.ai_validation_notes && (
                  <p className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>
                    {grievance.ai_validation_notes}
                  </p>
                )}
              </div>
            )}

          {/* ── Reject Feedback Form ──────────────────────────────────────── */}
          {showRejectForm && (
            <div
              className="p-4 rounded-xl border space-y-3"
              style={{ backgroundColor: 'var(--surface-hover)', borderColor: 'var(--border)' }}
              id="rejection-feedback-form"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <span className="text-xs font-extrabold" style={{ color: 'var(--text-primary)' }}>
                  Tell us why you're rejecting this closure
                </span>
              </div>
              <textarea
                id="rejection-feedback-textarea"
                value={rejectFeedback}
                onChange={(e) => setRejectFeedback(e.target.value)}
                rows={3}
                placeholder="E.g. The pothole is still there. Nothing was actually fixed..."
                className="w-full rounded-xl px-3 py-2.5 text-xs resize-none focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent)',
                } as React.CSSProperties}
              />
              <div className="flex gap-2">
                <button
                  id="confirm-reject-btn"
                  onClick={handleReject}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: '#f87171', color: '#fff' }}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ThumbsDown className="w-4 h-4" />
                  )}
                  Confirm Rejection
                </button>
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer"
                  style={{ backgroundColor: 'var(--surface-hover)', color: 'var(--text-muted)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer Action Bar ───────────────────────────────────────────────── */}
        {isActionable && !showRejectForm && (
          <div
            className="sticky bottom-0 flex items-center gap-3 px-6 py-4 border-t"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
            }}
          >
            {/* Confirm Button */}
            <button
              id="confirm-resolution-btn"
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer disabled:opacity-50 shadow-md"
              style={{
                background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                color: '#052e16',
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running AI Validation…
                </>
              ) : (
                <>
                  <ThumbsUp className="w-4 h-4" />
                  Confirm Resolution
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Reject Button */}
            <button
              id="reject-resolution-btn"
              onClick={() => setShowRejectForm(true)}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer disabled:opacity-50"
              style={{
                backgroundColor: 'var(--surface-hover)',
                border: '1px solid rgba(248, 113, 113, 0.4)',
                color: '#f87171',
              }}
            >
              <ThumbsDown className="w-4 h-4" />
              Reject &amp; Reopen
            </button>
          </div>
        )}

        {/* Final-state close button */}
        {(status === 'VERIFIED_CLOSED' || status === 'REJECTED_REOPENED') && (
          <div
            className="px-6 py-4 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            <button
              id="close-final-state-btn"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-sm font-extrabold transition cursor-pointer"
              style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
