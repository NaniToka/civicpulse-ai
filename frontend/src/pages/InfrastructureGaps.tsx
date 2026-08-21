import React, { useState } from 'react';
import { Building, Activity, Zap, Droplet, Bus, Wifi, MapPin, ArrowRight } from 'lucide-react';
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
      {/* Header */}
      <div className="p-6 md:p-8 rounded-2xl glass-panel-cyan flex flex-col md:flex-row md:items-center justify-between gap-6 border border-cyan-800/40">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight font-sans">
            Infrastructure Gap <span className="gradient-text-cyan">Intelligence</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 font-sans font-medium max-w-2xl">
            Evaluating municipal operational capacity deficits against census population demand across 6 core sectors.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const catInds = indicators.filter((i) => i.category.toLowerCase() === cat);
          const avgDeficit = catInds.length
            ? catInds.reduce((acc, curr) => acc + curr.gap_score, 0) / catInds.length
            : cat === 'healthcare' ? 0.82 : cat === 'water' ? 0.74 : 0.65;
          const avgCoverage = Math.round((1 - avgDeficit) * 100);

          return (
            <div key={cat} className="p-6 rounded-2xl glass-card space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-sm">
                    {categoryIcons[cat]}
                  </div>
                  <span className="text-sm font-bold text-slate-100 uppercase tracking-wide font-mono">{cat}</span>
                </div>
                <span className="text-sm font-mono font-extrabold text-rose-400">
                  Gap: {(avgDeficit * 100).toFixed(0)}%
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-slate-300">Current Coverage:</span>
                  <span className="text-slate-100">{avgCoverage}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-full"
                    style={{ width: `${avgCoverage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Heat Matrix */}
      <div className="p-6 md:p-8 rounded-2xl glass-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-100 font-mono">Region × Sector Deficit Heat Matrix</h3>
            <p className="text-xs text-slate-300 font-medium mt-0.5">Cell intensity indicates operational capacity gap severity (0.00 to 1.00). Click any district to enter region details.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold">
            <span className="text-slate-300">Deficit Level:</span>
            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-200 border border-emerald-600">&lt; 0.40</span>
            <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-200 border border-amber-600">0.40–0.70</span>
            <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-200 border border-rose-600">&gt; 0.70</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-slate-950 text-slate-200 border-b border-slate-800 font-bold">
              <tr>
                <th className="p-4 border-r border-slate-800">DISTRICT / CITY</th>
                {categories.map((c) => (
                  <th key={c} className="p-4 text-center uppercase">{c.slice(0, 10)}</th>
                ))}
                <th className="p-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-bold">
              {regions.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-950/80 transition">
                  <td className="p-4 font-bold text-slate-100 border-r border-slate-800">
                    <div className="text-sm font-extrabold text-slate-100">{reg.district_city}</div>
                    <div className="text-xs text-slate-400 font-semibold">{reg.country}</div>
                  </td>
                  {categories.map((cat) => {
                    const ind = indicators.find((i) => i.region_id === reg.id && i.category.toLowerCase() === cat);
                    const gap = ind ? ind.gap_score : (reg.id.includes('KANP') && cat === 'healthcare' ? 0.85 : 0.55);

                    let bgClass = 'bg-slate-950 text-slate-300 border-slate-800';
                    if (gap >= 0.75) {
                      bgClass = 'bg-rose-950 text-rose-100 border-rose-600 font-extrabold shadow-sm';
                    } else if (gap >= 0.50) {
                      bgClass = 'bg-amber-950 text-amber-100 border-amber-600 font-bold';
                    } else {
                      bgClass = 'bg-emerald-950 text-emerald-100 border-emerald-600 font-bold';
                    }

                    return (
                      <td key={cat} className="p-3 text-center">
                        <div className={`py-2.5 px-2 rounded-lg border text-sm ${bgClass}`}>
                          {gap.toFixed(2)}
                        </div>
                      </td>
                    );
                  })}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setActiveDetailRegion(reg)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-md glow-cyan shrink-0"
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
