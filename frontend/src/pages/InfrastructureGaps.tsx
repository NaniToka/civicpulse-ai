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
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* 1. Page Header */}
      <div className="p-6 md:p-8 rounded-xl bg-[#0A0A0C] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Facility Shortfalls & Gaps
            </span>
          </div>
          <h1 className="text-2xl md:text-[28px] font-semibold text-slate-100 tracking-tight font-sans">
            Facility Shortfalls & <span className="hero-gradient-text">Capacity Deficits</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-md bg-[#121215] border border-white/[0.08] text-slate-300 font-medium">
              6 Core Sectors
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#121215] border border-white/[0.08] text-slate-300 font-medium">
              District Shortfall Matrix
            </span>
          </div>
        </div>
      </div>

      {/* 2. Explanatory Banner: What do the Deficit Scores Mean? */}
      <div className="p-5 rounded-xl bg-[#0A0A0C] border border-white/[0.08] shadow-sm space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-200 font-semibold">
          <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Understanding Deficit Scores & Severity Levels:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-[#121215] border border-red-500/20 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-red-400">0.75 – 1.00 (Critical Deficit)</span>
              <p className="text-slate-400 mt-0.5">75%+ capacity shortfall. Fast-track capital required.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#121215] border border-amber-500/20 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-400">0.50 – 0.74 (High Deficit)</span>
              <p className="text-slate-400 mt-0.5">50%-74% operational gap. Risk of system bottlenecking.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#121215] border border-green-500/20 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-green-400">0.00 – 0.49 (Stable)</span>
              <p className="text-slate-400 mt-0.5">Sufficient baseline coverage with manageable demand load.</p>
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
            <div key={cat} className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#121215] border border-white/[0.08]">
                    {categoryIcons[cat]}
                  </div>
                  <span className="text-xs font-semibold text-slate-100 uppercase tracking-wider font-mono">
                    {cat.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right font-mono">
                  <div className="text-sm font-semibold text-red-400">{deficitPct}% Deficit</div>
                  <div className="text-[10px] text-slate-400">({avgDeficit.toFixed(2)} / 1.00)</div>
                </div>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">Coverage vs Shortfall:</span>
                  <span className="text-green-400">{avgCoverage}% Coverage</span>
                </div>
                <div className="h-2 rounded-full bg-[#121215] overflow-hidden border border-white/[0.08] flex">
                  <div
                    className="h-full bg-green-500 rounded-l-full"
                    style={{ width: `${avgCoverage}%` }}
                    title={`Current Coverage: ${avgCoverage}%`}
                  />
                  <div
                    className="h-full bg-red-500 rounded-r-full"
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
      <div className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <h3 className="text-[15px] font-semibold text-slate-100 font-mono">
              Indian Region × Sector Deficit Heat Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cell values show operational capacity deficit score (0.00 = No Deficit, 1.00 = Total Shortfall) & severity.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Levels:</span>
            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[11px]">≥ 0.75 CRITICAL</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px]">0.50–0.74 HIGH</span>
            <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[11px]">&lt; 0.50 STABLE</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-[#121215] text-slate-400 border-b border-white/[0.08] uppercase text-[11px]">
              <tr>
                <th className="p-3 border-r border-white/[0.08]">INDIAN DISTRICT / CITY</th>
                {categories.map((c) => (
                  <th key={c} className="p-3 text-center uppercase">
                    {c.replace('_', ' ').slice(0, 10)}
                  </th>
                ))}
                <th className="p-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.08]">
              {regions.map((reg) => (
                <tr key={reg.id} className="hover:bg-[#121215] transition-colors">
                  <td className="p-3.5 border-r border-white/[0.08]">
                    <div className="text-xs font-semibold text-slate-100">{reg.district_city}</div>
                    <div className="text-[11px] text-slate-400">{reg.state_province}, {reg.country}</div>
                  </td>
                  {categories.map((cat) => {
                    const ind = indicators.find((i) => i.region_id === reg.id && i.category.toLowerCase() === cat);
                    const gap = ind ? ind.gap_score : (reg.id.includes('KANP') && cat === 'healthcare' ? 0.85 : 0.55);
                    const gapPct = Math.round(gap * 100);

                    let bgClass = 'bg-[#121215] text-slate-300 border-white/[0.08]';
                    let statusLabel = 'STABLE';
                    if (gap >= 0.75) {
                      bgClass = 'bg-red-500/10 text-red-400 border-red-500/20 font-semibold';
                      statusLabel = 'CRITICAL';
                    } else if (gap >= 0.50) {
                      bgClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20 font-semibold';
                      statusLabel = 'HIGH';
                    } else {
                      bgClass = 'bg-green-500/10 text-green-400 border-green-500/20 font-semibold';
                      statusLabel = 'STABLE';
                    }

                    return (
                      <td key={cat} className="p-2 text-center">
                        <div
                          className={`py-1.5 px-1.5 rounded-lg border text-center transition-colors ${bgClass}`}
                          title={`${reg.district_city} • ${cat.toUpperCase()}: ${gapPct}% Capacity Deficit (${gap.toFixed(2)} / 1.00)`}
                        >
                          <div className="text-xs font-semibold">{gap.toFixed(2)}</div>
                          <div className="text-[9px] opacity-80 font-mono">{gapPct}% ({statusLabel})</div>
                        </div>
                      </td>
                    );
                  })}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setActiveDetailRegion(reg)}
                      className="px-2.5 py-1 rounded-lg bg-[#121215] hover:bg-[#101014] border border-white/[0.08] text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1 mx-auto cursor-pointer"
                    >
                      <MapPin className="w-3 h-3 text-indigo-400" />
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
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
