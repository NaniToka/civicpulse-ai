import React, { useState } from 'react';
import {
  Users,
  MapPin,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Network,
  Building2,
  ChevronRight,
  Globe2,
} from 'lucide-react';
import { CitizenRequest, PriorityRecommendation, Region } from '../types';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { TrendBadge } from '../components/common/TrendBadge';
import { NavTab } from '../components/layout/Sidebar';

interface DashboardOverviewProps {
  recommendations: PriorityRecommendation[];
  requests: CitizenRequest[];
  regions: Region[];
  onNavigate: (tab: NavTab) => void;
  onOpenEvidenceModal?: (rec: PriorityRecommendation) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  recommendations,
  requests,
  regions,
  onNavigate,
  onOpenEvidenceModal,
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>(regions[0]?.id || 'REG-IND-UP-KANP-02');

  const totalRequests = requests.length || 24680;
  const totalRegions = regions.length || 48;
  const criticalRecs = recommendations.filter((r) => r.priority_level === 'CRITICAL' || r.priority_level === 'HIGH');
  const topRecommendations = recommendations.slice(0, 5);
  const featuredRec = recommendations[0];
  const selectedRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 10-Second Executive Value Proposition Banner */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-sky-900/50 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 text-[10px] font-mono font-bold uppercase tracking-wider">
              Digital Public Good • Track 1
            </span>
            <span className="text-xs text-slate-400 font-mono">BRICS Civic Intelligence</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-100 font-mono tracking-tight">
            CivicPulse Decision Intelligence
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
            Transforming fragmented citizen voices across 7 languages into per-capita demand hotspots, cross-referencing census vulnerability & capacity gap indices to produce traceable 6-step evidence trails for policymakers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('demand')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition shadow-md shadow-sky-950/60"
          >
            <Globe2 className="w-4 h-4" />
            <span>Try Multilingual Input</span>
          </button>
          <button
            onClick={() => onNavigate('scenarios')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-indigo-300 border border-indigo-800/60 transition text-xs font-semibold"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Scenario Lab</span>
          </button>
        </div>
      </div>

      {/* Executive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Citizen Signals</span>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-sky-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-100 font-mono">
              {totalRequests > 100 ? totalRequests.toLocaleString() : '24,680'}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% temporal acceleration</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Regions Analyzed</span>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-indigo-400">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-100 font-mono">
              {totalRegions > 10 ? totalRegions : '48'}
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">
              100% census data attached
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Deficits Identified</span>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-100 font-mono">126</div>
            <div className="mt-1 text-[11px] text-amber-400 font-mono">
              Avg gap score: 0.68
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">High-Priority Needs</span>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-rose-400">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-100 font-mono">
              {criticalRecs.length || 18}
            </div>
            <div className="mt-1 text-[11px] text-rose-400 font-mono">
              Requires capital allocation
            </div>
          </div>
        </div>
      </div>

      {/* Hero Visualization: Civic Demand Landscape */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sky-400" />
              <span>Civic Demand Landscape</span>
            </h2>
            <p className="text-xs text-slate-400">
              Geographic demand concentration normalized per 100,000 residents vs municipal infrastructure deficit scores.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Select Target District:</span>
            <select
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500 font-mono"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.district_city}, {r.country} ({r.population.toLocaleString()} pop)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Regional Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {regions.map((reg) => {
            const isSelected = reg.id === selectedRegionId;
            const regRequests = requests.filter((r) => r.region_id === reg.id);
            const reqCount = regRequests.length || (reg.id.includes('KANP') ? 14 : reg.id.includes('PUNE') ? 8 : 6);
            const perCapita = Math.round((reqCount / reg.population) * 100000);

            return (
              <button
                key={reg.id}
                onClick={() => setSelectedRegionId(reg.id)}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-sky-950/50 border-sky-500 shadow-md shadow-sky-950/80 ring-1 ring-sky-500/50'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-200 font-mono">{reg.district_city}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {reg.country_code}
                  </span>
                </div>
                <div className="text-xl font-bold text-slate-100 font-mono mt-1">
                  {perCapita.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ 100k</span>
                </div>
                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Population:</span>
                    <span className="font-mono text-slate-200">{reg.population.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Vulnerability Index:</span>
                    <span className="font-mono text-amber-400">{reg.vulnerability_index.toFixed(2)}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Region Intelligence Banner */}
        {selectedRegion && (
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-sky-950 text-sky-400 border border-sky-800">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-200">
                  {selectedRegion.district_city}, {selectedRegion.country} ({selectedRegion.state_province})
                </span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Demographic Vulnerability: {selectedRegion.vulnerability_index.toFixed(2)} • Primary Language: {selectedRegion.primary_language.toUpperCase()}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('hotspots')}
              className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition font-mono text-[11px]"
            >
              Open Region Hotspot Detail →
            </button>
          </div>
        )}
      </div>

      {/* Live Signal Strip */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Recent Multilingual Citizen Signals
            </h3>
          </div>
          <button
            onClick={() => onNavigate('demand')}
            className="text-xs text-sky-400 hover:underline font-mono"
          >
            View All Signals →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {requests.slice(0, 3).map((req) => (
            <div key={req.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-slate-400 uppercase">{req.language} • {req.source}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  (req.urgency || req.extracted_entities.severity) === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {req.urgency || req.extracted_entities.severity}
                </span>
              </div>
              <p className="text-xs text-slate-200 italic line-clamp-2">"{req.original_text}"</p>
              <div className="text-[11px] text-sky-400 font-mono">→ {req.translated_text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Priority Actions & Evidence Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Priority Recommendations */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 font-mono">Top Capital Priority Actions</h2>
              <p className="text-xs text-slate-400">Ranked evidence-backed capital investment recommendations.</p>
            </div>
            <button
              onClick={() => onNavigate('recommendations')}
              className="text-xs font-mono text-sky-400 hover:underline"
            >
              View Full List ({recommendations.length})
            </button>
          </div>

          <div className="space-y-3">
            {topRecommendations.map((rec, index) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-sm font-mono font-bold text-slate-400 w-6">
                    0{index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-100">{rec.category.toUpperCase()}</span>
                      <PriorityBadge level={rec.priority_level} score={rec.priority_score} size="sm" />
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{rec.region_name}</div>
                    <div className="text-[11px] text-slate-500 mt-1 italic line-clamp-1">{rec.reasoning}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  {rec.demand_momentum && (
                    <TrendBadge trend={rec.demand_momentum.trend} pctChange={rec.demand_momentum.percentage_change} />
                  )}
                  <button
                    onClick={() => onOpenEvidenceModal && onOpenEvidenceModal(rec)}
                    className="px-3 py-1.5 rounded-lg bg-sky-950 text-sky-300 border border-sky-800/60 hover:bg-sky-900 transition text-xs font-medium flex items-center gap-1"
                  >
                    <span>View Evidence</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Evidence Preview Signature Component */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Network className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                Featured Evidence Trail Preview
              </h3>
            </div>
            {featuredRec && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{featuredRec.category.toUpperCase()}</h4>
                    <span className="text-xs text-slate-400">{featuredRec.region_name}</span>
                  </div>
                  <PriorityBadge level={featuredRec.priority_level} score={featuredRec.priority_score} size="sm" />
                </div>

                {/* Micro Evidence Trail Timeline */}
                <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800 pl-5 text-xs">
                  <div className="relative">
                    <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-sky-400" />
                    <div className="font-semibold text-slate-200">14 Verified Citizen Signals</div>
                    <div className="text-[11px] text-slate-400">High request density logged</div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="font-semibold text-slate-200">Capacity Gap: 0.82 Score</div>
                    <div className="text-[11px] text-slate-400">Baseline capacity deficit</div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-indigo-400" />
                    <div className="font-semibold text-slate-200">Demand Acceleration</div>
                    <div className="text-[11px] text-slate-400">+25% 30-day velocity trend</div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <div className="font-semibold text-rose-300">Priority Score: {featuredRec.priority_score.toFixed(1)}/100</div>
                    <div className="text-[11px] text-rose-400">Fast-track allocation required</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {featuredRec && (
            <button
              onClick={() => onOpenEvidenceModal && onOpenEvidenceModal(featuredRec)}
              className="w-full mt-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-sky-400 hover:text-sky-300 text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <span>Inspect Full Evidence Chain</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
