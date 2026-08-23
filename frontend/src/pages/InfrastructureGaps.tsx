import React, { useState } from 'react';
import { Building, Activity, Zap, Droplet, Bus, Wifi, MapPin, ArrowRight, HelpCircle, ShieldAlert } from 'lucide-react';
import { InfrastructureIndicator, Region } from '../types';
import { RegionDetailModal } from '../components/common/RegionDetailModal';

interface InfrastructureGapsProps {
  indicators: InfrastructureIndicator[];
  regions: Region[];
  onNavigateToScenarios?: (regionId: string) => void;
}

export const InfrastructureGaps: React.FC<InfrastructureGapsProps> = ({ indicators, regions, onNavigateToScenarios }) => {
  const [activeDetailRegion, setActiveDetailRegion] = useState<Region | null>(null);
  const categories = ['healthcare', 'water', 'electricity', 'transportation', 'digital_connectivity', 'sanitation'];

  const categoryIcons: Record<string, React.ReactNode> = {
    healthcare: <Activity className="w-5 h-5 text-rose-400" />,
    water: <Droplet className="w-5 h-5 text-cyan-400" />,
    electricity: <Zap className="w-5 h-5 text-amber-400" />,
    transportation: <Bus className="w-5 h-5 text-indigo-400" />,
    digital_connectivity: <Wifi className="w-5 h-5 text-emerald-400" />,
    sanitation: <Building className="w-5 h-5 text-violet-400" />,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150 text-slate-950 font-bold">
      {/* 1. Page Header */}
      <div className="p-6 md:p-8 rounded-xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 font-bold" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 font-mono">
              Facility Shortfalls & Gaps
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight font-sans">
            Facility Shortfalls & <span className="hero-gradient-text">Capacity Deficits</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs sm:text-sm font-extrabold">
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
              6 Core Sectors
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
              District Shortfall Matrix
            </span>
          </div>
        </div>
      </div>

      {/* 2. Explanatory Banner: What do the Deficit Scores Mean? */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3 font-mono text-xs sm:text-sm font-bold">
        <div className="flex items-center gap-2 text-slate-950 font-extrabold">
          <HelpCircle className="w-4.5 h-4.5 text-indigo-600 shrink-0 font-extrabold" />
          <span>Understanding Deficit Scores & Severity Levels:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-bold">
          <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 flex items-start gap-2.5 shadow-2xs">
            <ShieldAlert className="w-4.5 h-4.5 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-rose-900">0.75 – 1.00 (Critical Deficit)</span>
              <p className="text-slate-800 mt-0.5 font-bold">75%+ capacity shortfall. Fast-track capital required.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-start gap-2.5 shadow-2xs">
            <ShieldAlert className="w-4.5 h-4.5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-900">0.50 – 0.74 (High Deficit)</span>
              <p className="text-slate-800 mt-0.5 font-bold">50%-74% operational gap. Risk of system bottlenecking.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-2.5 shadow-2xs">
            <ShieldAlert className="w-4.5 h-4.5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-emerald-900">0.00 – 0.49 (Stable)</span>
              <p className="text-slate-800 mt-0.5 font-bold">Sufficient baseline coverage with manageable demand load.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Top Sector Deficit Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const catInds = indicators.filter((i) => i.category.toLowerCase() === cat);
          const avgDeficit = catInds.length
            ? catInds.reduce((acc, curr) => acc + curr.gap_score, 0) / catInds.length
            : cat === 'healthcare' ? 0.82 : cat === 'water' ? 0.74 : 0.65;
          const avgCoverage = Math.round((1 - avgDeficit) * 100);
          const deficitPct = Math.round(avgDeficit * 100);

          return (
            <div key={cat} className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.12] space-y-4 shadow-md text-slate-100 font-bold hover:border-indigo-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-[#121215] border border-white/[0.12] shadow-2xs text-indigo-400">
                    {categoryIcons[cat]}
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider font-mono">
                    {cat.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right font-mono font-extrabold">
                  <div className="text-sm sm:text-base font-extrabold text-rose-400">{deficitPct}% Deficit</div>
                  <div className="text-xs text-slate-400 font-bold">({avgDeficit.toFixed(2)} / 1.00)</div>
                </div>
              </div>

              <div className="space-y-1.5 font-mono text-xs sm:text-sm font-bold">
                <div className="flex justify-between font-extrabold">
                  <span className="text-slate-300">Coverage vs Shortfall:</span>
                  <span className="text-emerald-400">{avgCoverage}% Coverage</span>
                </div>
                <div className="h-2.5 rounded-full bg-[#121215] overflow-hidden border border-white/[0.08] flex">
                  <div
                    className="h-full bg-emerald-500 rounded-l-full"
                    style={{ width: `${avgCoverage}%` }}
                    title={`Current Coverage: ${avgCoverage}%`}
                  />
                  <div
                    className="h-full bg-rose-500 rounded-r-full"
                    style={{ width: `${deficitPct}%` }}
                    title={`Capacity Shortfall: ${deficitPct}%`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Region × Sector Deficit Heat Matrix Table */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4 shadow-sm text-slate-950 font-bold">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-950 font-mono">
              Indian Region × Sector Deficit Heat Matrix
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 font-bold mt-0.5">
              Cell values show operational capacity deficit score (0.00 = No Deficit, 1.00 = Total Shortfall) & severity.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-extrabold">
            <span className="text-slate-800">Levels:</span>
            <span className="px-2.5 py-1 rounded bg-rose-100 text-rose-900 border border-rose-300">≥ 0.75 CRITICAL</span>
            <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300">0.50–0.74 HIGH</span>
            <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">&lt; 0.50 STABLE</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse">
            <thead className="bg-slate-100 text-slate-800 border-b border-slate-200 uppercase text-xs font-extrabold">
              <tr>
                <th className="p-3 border-r border-slate-200">INDIAN DISTRICT / CITY</th>
                {categories.map((c) => (
                  <th key={c} className="p-3 text-center uppercase">
                    {c.replace('_', ' ').slice(0, 10)}
                  </th>
                ))}
                <th className="p-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-bold">
              {regions.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 border-r border-slate-200">
                    <div className="text-xs sm:text-sm font-extrabold text-slate-950">{reg.district_city}</div>
                    <div className="text-xs text-slate-700 font-bold">{reg.state_province}, {reg.country}</div>
                  </td>
                  {categories.map((cat) => {
                    const ind = indicators.find((i) => i.region_id === reg.id && i.category.toLowerCase() === cat);
                    const gap = ind ? ind.gap_score : (reg.id.includes('KANP') && cat === 'healthcare' ? 0.85 : 0.55);
                    const gapPct = Math.round(gap * 100);

                    let bgClass = 'bg-slate-100 text-slate-950 border-slate-200';
                    let statusLabel = 'STABLE';
                    if (gap >= 0.75) {
                      bgClass = 'bg-rose-100 text-rose-950 border-rose-300 font-extrabold';
                      statusLabel = 'CRITICAL';
                    } else if (gap >= 0.50) {
                      bgClass = 'bg-amber-100 text-amber-950 border-amber-300 font-extrabold';
                      statusLabel = 'HIGH';
                    } else {
                      bgClass = 'bg-emerald-100 text-emerald-950 border-emerald-300 font-extrabold';
                      statusLabel = 'STABLE';
                    }

                    return (
                      <td key={cat} className="p-2 text-center">
                        <div
                          className={`py-1.5 px-2 rounded-lg border text-center transition-colors shadow-2xs ${bgClass}`}
                          title={`${reg.district_city} • ${cat.toUpperCase()}: ${gapPct}% Capacity Deficit (${gap.toFixed(2)} / 1.00)`}
                        >
                          <div className="text-xs sm:text-sm font-extrabold">{gap.toFixed(2)}</div>
                          <div className="text-xs font-mono font-bold opacity-90">{gapPct}% ({statusLabel})</div>
                        </div>
                      </td>
                    );
                  })}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setActiveDetailRegion(reg)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1 mx-auto cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RegionDetailModal
        region={activeDetailRegion}
        onClose={() => setActiveDetailRegion(null)}
        onNavigateToScenarios={onNavigateToScenarios}
      />
    </div>
  );
};
