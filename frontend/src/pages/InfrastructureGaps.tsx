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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Page Header */}
      <div className="p-6 md:p-8 rounded-2xl glass-panel-cyan flex flex-col md:flex-row md:items-center justify-between gap-6 border border-cyan-800/40">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-extrabold text-cyan-300 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-700">
              INFRASTRUCTURE DEFICIT ANALYTICS
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight font-sans">
            Infrastructure Deficit & Gap <span className="gradient-text-cyan">Intelligence</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-300 font-sans font-medium max-w-2xl">
            Evaluating municipal operational capacity deficits against census population demand across 6 core sectors.
          </p>
        </div>
      </div>

      {/* 2. Explanatory Banner: What do the Deficit Scores Mean? */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-[#070e1c] to-slate-950 border border-cyan-500/50 shadow-xl space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-cyan-300 font-extrabold">
          <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Understanding the Deficit Scores & Heat Matrix Boxes:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700/80 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-rose-200">0.75 – 1.00 (Critical Deficit)</span>
              <p className="text-rose-300/80 mt-0.5">75%+ capacity shortfall. Urgent fast-track capital allocation required.</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-700/80 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-200">0.50 – 0.74 (High Deficit)</span>
              <p className="text-amber-300/80 mt-0.5">50%-74% operational gap. Moderate risk of system bottlenecking.</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/80 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-emerald-200">0.00 – 0.49 (Stable / Moderate)</span>
              <p className="text-emerald-300/80 mt-0.5">Sufficient baseline coverage with manageable demand load.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Top Sector Deficit Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const catInds = indicators.filter((i) => i.category.toLowerCase() === cat);
          const avgDeficit = catInds.length
            ? catInds.reduce((acc, curr) => acc + curr.gap_score, 0) / catInds.length
            : cat === 'healthcare' ? 0.82 : cat === 'water' ? 0.74 : 0.65;
          const avgCoverage = Math.round((1 - avgDeficit) * 100);
          const deficitPct = Math.round(avgDeficit * 100);

          return (
            <div key={cat} className="p-6 rounded-2xl glass-card space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-sm">
                    {categoryIcons[cat]}
                  </div>
                  <span className="text-sm font-extrabold text-slate-100 uppercase tracking-wide font-mono">
                    {cat.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-base font-mono font-black text-rose-400">{deficitPct}% Deficit</div>
                  <div className="text-[10px] text-slate-400 font-mono font-bold">({avgDeficit.toFixed(2)} / 1.00)</div>
                </div>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-400">Current Coverage:</span>
                  <span className="text-emerald-300 font-extrabold">{avgCoverage}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800 flex">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-l-full"
                    style={{ width: `${avgCoverage}%` }}
                    title={`Current Coverage: ${avgCoverage}%`}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-r-full opacity-80"
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
      <div className="p-6 md:p-8 rounded-2xl glass-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-100 font-mono">
              Indian Region × Sector Deficit Heat Matrix
            </h3>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Cell values show operational capacity deficit score (0.00 = No Deficit, 1.00 = Total Shortfall) & severity level.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold">
            <span className="text-slate-300">Severity Levels:</span>
            <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-200 border border-rose-600">≥ 0.75 CRITICAL 🚨</span>
            <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-200 border border-amber-600">0.50–0.74 HIGH ⚠️</span>
            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-200 border border-emerald-600">&lt; 0.50 STABLE ✅</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-slate-950 text-slate-200 border-b border-slate-800 font-bold">
              <tr>
                <th className="p-4 border-r border-slate-800">INDIAN DISTRICT / CITY</th>
                {categories.map((c) => (
                  <th key={c} className="p-4 text-center uppercase">
                    {c.replace('_', ' ').slice(0, 10)}
                  </th>
                ))}
                <th className="p-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-bold">
              {regions.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-950/80 transition">
                  <td className="p-4 font-bold text-slate-100 border-r border-slate-800">
                    <div className="text-sm font-extrabold text-slate-100">{reg.district_city}</div>
                    <div className="text-xs text-cyan-300 font-semibold">{reg.state_province}, {reg.country}</div>
                  </td>
                  {categories.map((cat) => {
                    const ind = indicators.find((i) => i.region_id === reg.id && i.category.toLowerCase() === cat);
                    const gap = ind ? ind.gap_score : (reg.id.includes('KANP') && cat === 'healthcare' ? 0.85 : 0.55);
                    const gapPct = Math.round(gap * 100);

                    let bgClass = 'bg-slate-950 text-slate-300 border-slate-800';
                    let statusLabel = 'STABLE';
                    if (gap >= 0.75) {
                      bgClass = 'bg-rose-950/90 text-rose-100 border-rose-600 font-extrabold shadow-sm glow-rose';
                      statusLabel = 'CRITICAL';
                    } else if (gap >= 0.50) {
                      bgClass = 'bg-amber-950/90 text-amber-100 border-amber-600 font-bold';
                      statusLabel = 'HIGH';
                    } else {
                      bgClass = 'bg-emerald-950/90 text-emerald-100 border-emerald-600 font-bold';
                      statusLabel = 'STABLE';
                    }

                    return (
                      <td key={cat} className="p-2.5 text-center">
                        <div
                          className={`py-2 px-1.5 rounded-xl border text-center transition-all cursor-pointer hover:scale-105 ${bgClass}`}
                          title={`${reg.district_city} • ${cat.toUpperCase()}: ${gapPct}% Capacity Deficit (${gap.toFixed(2)} / 1.00)`}
                        >
                          <div className="text-xs font-black">{gap.toFixed(2)}</div>
                          <div className="text-[9px] opacity-90 font-mono tracking-tight">{gapPct}% ({statusLabel})</div>
                        </div>
                      </td>
                    );
                  })}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setActiveDetailRegion(reg)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-md glow-cyan shrink-0 cursor-pointer"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Enter Details</span>
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
