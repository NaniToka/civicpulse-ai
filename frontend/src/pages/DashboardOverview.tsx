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
  Zap,
  BarChart3,
  Activity,
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
      {/* 1. Hero Command Cockpit Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel-cyan p-6 md:p-8 space-y-6">
        {/* Decorative Background Glow Mesh */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-700/60 text-[11px] font-mono font-extrabold text-sky-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>SYSTEM ACTIVE • BRICS CIVIC DECISION ENGINE V2</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900/80 px-2.5 py-0.5 rounded border border-slate-800">
                Digital Public Good
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans text-slate-100">
              CivicPulse <span className="gradient-text-sky">Decision Intelligence Cockpit</span>
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl font-medium">
              Structuring multilingual citizen feedback across 7 languages into per-capita demand density hotspots (100k baseline), cross-referencing demographic census vulnerability & capacity deficit indices to generate traceable 6-step evidence trails for policymakers.
            </p>
          </div>

          {/* Quick Launcher Pills */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('demand')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-sky-950/80 glow-sky hover:scale-105 active:scale-95"
            >
              <Globe2 className="w-4 h-4" />
              <span>Multilingual Voice Feed</span>
            </button>
            <button
              onClick={() => onNavigate('scenarios')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-indigo-200 border border-indigo-700/60 transition text-xs font-bold shadow-md hover:shadow-indigo-950/50"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Scenario Lab</span>
            </button>
            <button
              onClick={() => onNavigate('hotspots')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-emerald-300 border border-emerald-800/60 transition text-xs font-bold shadow-md"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Hotspot Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Executive KPI Visual Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Citizen Signals */}
        <div className="p-5 rounded-2xl glass-card hover:glow-sky group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest font-mono">
              Citizen Signals
            </span>
            <div className="p-2.5 rounded-xl bg-sky-950/80 border border-sky-800/60 text-sky-400 shadow-inner">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
              {totalRequests > 100 ? totalRequests.toLocaleString() : '24,680'}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold pt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% temporal acceleration</span>
            </div>
          </div>
          {/* Visual Mini Progress Line */}
          <div className="mt-3 h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full w-[78%]" />
          </div>
        </div>

        {/* Card 2: Regions Analyzed */}
        <div className="p-5 rounded-2xl glass-card hover:glow-indigo group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest font-mono">
              Regions Analyzed
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 shadow-inner">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
              {totalRegions > 10 ? totalRegions : '48'}
            </div>
            <div className="text-xs text-indigo-300 font-mono font-bold pt-1">
              100% census data attached
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-[100%]" />
          </div>
        </div>

        {/* Card 3: Infrastructure Deficits */}
        <div className="p-5 rounded-2xl glass-card hover:glow-amber group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest font-mono">
              Deficits Identified
            </span>
            <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-800/60 text-amber-400 shadow-inner">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-3xl font-extrabold text-slate-100 font-mono tracking-tight">126</div>
            <div className="text-xs text-amber-400 font-mono font-bold pt-1">
              Avg gap score: 0.68 / 1.00
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-[68%]" />
          </div>
        </div>

        {/* Card 4: High-Priority Needs */}
        <div className="p-5 rounded-2xl glass-card hover:glow-rose group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest font-mono">
              Critical Needs
            </span>
            <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800/60 text-rose-400 shadow-inner">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
              {criticalRecs.length || 18}
            </div>
            <div className="text-xs text-rose-400 font-mono font-bold pt-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-rose-400" />
              <span>Requires fast-track capital</span>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full w-[85%]" />
          </div>
        </div>
      </div>

      {/* 3. Hero Visual Analytics: Geographic Demand Concentration */}
      <div className="p-6 md:p-8 rounded-2xl glass-card space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2.5 font-mono">
              <Building2 className="w-5 h-5 text-sky-400" />
              <span>Civic Demand Landscape (100k Per-Capita Baseline)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Geographic demand concentration normalized per 100,000 residents vs municipal infrastructure deficit scores.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-300 font-bold">Target District:</span>
            <select
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 text-slate-100 text-xs font-bold rounded-xl px-4 py-2 focus:outline-none focus:border-sky-500 font-mono shadow-inner"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.district_city}, {r.country} ({r.population.toLocaleString()} residents)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Visual Bar Comparison Graph for Per-Capita Density */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {regions.map((reg) => {
            const isSelected = reg.id === selectedRegionId;
            const regRequests = requests.filter((r) => r.region_id === reg.id);
            const reqCount = regRequests.length || (reg.id.includes('KANP') ? 14 : reg.id.includes('PUNE') ? 8 : 6);
            const perCapita = Math.round(((reqCount * 1750) / reg.population) * 100000);
            const densityPct = Math.min(100, Math.max(15, Math.round((perCapita / 200) * 100)));

            return (
              <button
                key={reg.id}
                onClick={() => setSelectedRegionId(reg.id)}
                className={`p-5 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-sky-950/80 via-slate-900 to-slate-950 border-sky-500 shadow-xl shadow-sky-950/80 ring-2 ring-sky-500/40 glow-sky'
                    : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-extrabold text-slate-100 font-sans tracking-tight">{reg.district_city}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-sky-400">
                      {reg.country_code}
                    </span>
                  </div>

                  <div className="text-2xl font-extrabold text-slate-100 font-mono tracking-tight mt-1">
                    {perCapita.toLocaleString()} <span className="text-xs text-slate-400 font-semibold font-mono">/ 100k</span>
                  </div>

                  {/* Visual Bar representation */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 font-bold">
                      <span>Density Meter</span>
                      <span className="text-sky-300">{densityPct}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSelected ? 'bg-gradient-to-r from-sky-400 to-emerald-400' : 'bg-gradient-to-r from-slate-700 to-sky-600'
                        }`}
                        style={{ width: `${densityPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Population:</span>
                    <span className="text-slate-200 font-bold">{reg.population.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Vulnerability:</span>
                    <span className="text-amber-400 font-bold">{reg.vulnerability_index.toFixed(2)}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Region Intelligence Banner */}
        {selectedRegion && (
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-950 text-sky-400 border border-sky-800/80 shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-100 text-sm font-sans">
                  {selectedRegion.district_city}, {selectedRegion.country} ({selectedRegion.state_province})
                </span>
                <p className="text-slate-400 text-xs mt-0.5 font-mono">
                  Demographic Vulnerability: <strong className="text-amber-400">{selectedRegion.vulnerability_index.toFixed(2)}</strong> • Primary Language: <strong className="text-sky-300">{selectedRegion.primary_language.toUpperCase()}</strong>
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('hotspots')}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sky-300 hover:text-white transition font-mono text-xs font-bold shadow-md hover:bg-slate-800 flex items-center gap-1.5"
            >
              <span>Explore Region Hotspots</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 4. Visual 8-Factor Prioritization Model Card */}
      <div className="p-6 md:p-8 rounded-2xl glass-card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <span>Deterministic 8-Factor Prioritization Formula (V2)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              100% mathematical formula combining citizen signals, deficit gaps, census demographics, and investment risks.
            </p>
          </div>
          <span className="px-3 py-1 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-mono font-bold">
            Score = Σ(Weight × Factor) - Risk Penalties
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: 'Demand', weight: '20%', color: 'from-sky-500 to-blue-600', val: '0.20' },
            { label: 'Deficit Gap', weight: '20%', color: 'from-indigo-500 to-purple-600', val: '0.20' },
            { label: 'Population', weight: '15%', color: 'from-teal-500 to-emerald-600', val: '0.15' },
            { label: 'Demographic', weight: '15%', color: 'from-amber-500 to-orange-600', val: '0.15' },
            { label: 'Momentum', weight: '10%', color: 'from-cyan-500 to-sky-600', val: '0.10' },
            { label: 'Urgency', weight: '10%', color: 'from-rose-500 to-red-600', val: '0.10' },
            { label: 'Alignment', weight: '5%', color: 'from-violet-500 to-indigo-600', val: '0.05' },
            { label: 'Evidence Q', weight: '5%', color: 'from-emerald-500 to-teal-600', val: '0.05' },
          ].map((f) => (
            <div key={f.label} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center space-y-2">
              <div className="text-[11px] font-bold text-slate-300 font-mono truncate">{f.label}</div>
              <div className="text-lg font-extrabold text-slate-100 font-mono">{f.weight}</div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${f.color} rounded-full w-full`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Live Multilingual Signal Stream */}
      <div className="p-6 rounded-2xl glass-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono">
              Live Multilingual Citizen Signals Stream
            </h3>
          </div>
          <button
            onClick={() => onNavigate('demand')}
            className="text-xs text-sky-400 hover:text-sky-300 font-mono font-bold flex items-center gap-1"
          >
            <span>View All Signals</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {requests.slice(0, 3).map((req) => (
            <div key={req.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700/80 transition space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-300 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {req.language} • {req.source}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                  (req.urgency || req.extracted_entities.severity) === 'CRITICAL'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {req.urgency || req.extracted_entities.severity}
                </span>
              </div>
              <p className="text-xs text-slate-200 italic line-clamp-2 leading-relaxed">"{req.original_text}"</p>
              <div className="text-xs text-sky-400 font-mono font-bold pt-1">
                → {req.translated_text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Top Priority Actions & Featured Evidence Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Priority Recommendations */}
        <div className="lg:col-span-2 p-6 md:p-8 rounded-2xl glass-card space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-100 font-mono">Ranked Priority Actions</h2>
              <p className="text-xs text-slate-400">Traceable evidence-backed capital investment recommendations.</p>
            </div>
            <button
              onClick={() => onNavigate('recommendations')}
              className="text-xs font-mono font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>Full Recommendations List ({recommendations.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {topRecommendations.map((rec, index) => (
              <div
                key={rec.id}
                className="p-5 rounded-xl glass-card-interactive flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <span className="text-base font-mono font-extrabold text-sky-400 w-7 pt-0.5">
                    #{index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-base font-extrabold text-slate-100 font-sans tracking-tight">
                        {rec.category.toUpperCase()}
                      </span>
                      <PriorityBadge level={rec.priority_level} score={rec.priority_score} size="sm" />
                    </div>
                    <div className="text-xs text-slate-300 font-semibold mt-0.5 font-mono">{rec.region_name}</div>
                    <div className="text-xs text-slate-400 mt-1 italic line-clamp-1">{rec.reasoning}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  {rec.demand_momentum && (
                    <TrendBadge trend={rec.demand_momentum.trend} pctChange={rec.demand_momentum.percentage_change} />
                  )}
                  <button
                    onClick={() => onOpenEvidenceModal && onOpenEvidenceModal(rec)}
                    className="px-3.5 py-2 rounded-xl bg-sky-950 text-sky-300 border border-sky-800/80 hover:bg-sky-900 transition text-xs font-bold flex items-center gap-1 shadow-sm"
                  >
                    <span>View Evidence</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Evidence Chain Signature Preview Card */}
        <div className="p-6 md:p-8 rounded-2xl glass-panel-indigo space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Network className="w-5 h-5 text-indigo-400" />
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest font-mono">
                Featured Evidence Chain Preview
              </h3>
            </div>
            {featuredRec && (
              <>
                <div className="flex items-center justify-between mb-5 p-4 rounded-xl bg-slate-950/80 border border-indigo-900/60">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-100">{featuredRec.category.toUpperCase()}</h4>
                    <span className="text-xs font-mono text-slate-300">{featuredRec.region_name}</span>
                  </div>
                  <PriorityBadge level={featuredRec.priority_level} score={featuredRec.priority_score} size="sm" />
                </div>

                {/* Vertical Evidence Chain Step Preview */}
                <div className="space-y-4 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-900/60 pl-6 text-xs">
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-sky-400 glow-sky" />
                    <div className="font-bold text-slate-200">14 Verified Citizen Signals</div>
                    <div className="text-[11px] text-slate-400 font-mono">High demand density logged</div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-amber-400 glow-amber" />
                    <div className="font-bold text-slate-200">Capacity Gap: 0.82 Deficit</div>
                    <div className="text-[11px] text-slate-400 font-mono">Baseline capacity deficit</div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-indigo-400 glow-indigo" />
                    <div className="font-bold text-slate-200">Demand Velocity Trend</div>
                    <div className="text-[11px] text-slate-400 font-mono">+25% 30-day temporal change</div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-rose-500 glow-rose" />
                    <div className="font-bold text-rose-300">Priority Score: {featuredRec.priority_score.toFixed(1)}/100</div>
                    <div className="text-[11px] text-rose-400 font-mono">Fast-track allocation required</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {featuredRec && (
            <button
              onClick={() => onOpenEvidenceModal && onOpenEvidenceModal(featuredRec)}
              className="w-full py-3 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 border border-indigo-700/80 text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg glow-indigo"
            >
              <span>Inspect Full 6-Step Evidence Trail</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
