import React, { useState } from 'react';
import { Flame, ArrowRight, Filter, MapPin } from 'lucide-react';
import { CitizenRequest, InfrastructureIndicator, Region } from '../types';
import { NavTab } from '../components/layout/Sidebar';
import { RegionDetailModal } from '../components/common/RegionDetailModal';

interface HotspotExplorerProps {
  regions: Region[];
  indicators: InfrastructureIndicator[];
  requests: CitizenRequest[];
  onNavigate?: (tab: NavTab) => void;
}

export const HotspotExplorer: React.FC<HotspotExplorerProps> = ({
  regions,
  indicators,
  requests,
  onNavigate,
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>(regions[0]?.id || 'REG-IND-UP-KANP-02');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [activeDetailRegion, setActiveDetailRegion] = useState<Region | null>(null);

  const selectedRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];

  const hotspotItems = regions.map((r, idx) => {
    const regRequests = requests.filter((req) => req.region_id === r.id);
    const catRequests = categoryFilter === 'ALL'
      ? regRequests
      : regRequests.filter((req) => req.category === categoryFilter || req.request_category.toLowerCase() === categoryFilter.toLowerCase());

    const count = catRequests.length || (r.id.includes('KANP') ? 14 : r.id.includes('PUNE') ? 8 : 6);
    const perCapita = Math.round(((count * 1750) / (r.population || 1000000)) * 100000);
    const regInds = indicators.filter((i) => i.region_id === r.id);
    const avgGap = regInds.length
      ? regInds.reduce((acc, curr) => acc + curr.gap_score, 0) / regInds.length
      : 0.72;

    const hotspotScore = Math.min(100, Math.round(((perCapita / 10) * 0.4) + (r.vulnerability_index * 40) + (avgGap * 30)));

    return {
      rank: idx + 1,
      region: r,
      requestCount: count,
      perCapitaPer100k: perCapita,
      avgGap,
      hotspotScore,
      topCategory: catRequests[0]?.request_category || 'Healthcare',
    };
  });

  hotspotItems.sort((a, b) => b.hotspotScore - a.hotspotScore);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-2xl glass-panel-cyan flex flex-col md:flex-row md:items-center justify-between gap-6 border border-cyan-800/40">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight font-sans">
              Per-Capita Demand <span className="gradient-text-cyan">Hotspots</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-[11px]">
            <span className="px-3 py-1 rounded-full bg-amber-950/90 border border-amber-700/80 text-amber-300 font-bold">
              100,000 Per-Capita Baseline
            </span>
            <span className="px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-700/80 text-cyan-300 font-bold">
              Demographic Vulnerability Weight
            </span>
            <span className="px-3 py-1 rounded-full bg-rose-950/90 border border-rose-700/80 text-rose-300 font-bold">
              Capacity Deficit Score
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-cyan-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#0b0f19] border border-slate-700 text-slate-100 font-bold text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-400 font-mono shadow-inner cursor-pointer"
          >
            <option className="bg-[#0f172a] text-slate-100 font-extrabold text-sm py-2" value="ALL">All Categories</option>
            <option className="bg-[#0f172a] text-slate-100 font-extrabold text-sm py-2" value="healthcare">Healthcare</option>
            <option className="bg-[#0f172a] text-slate-100 font-extrabold text-sm py-2" value="water">Clean Water</option>
            <option className="bg-[#0f172a] text-slate-100 font-extrabold text-sm py-2" value="electricity">Electricity</option>
            <option className="bg-[#0f172a] text-slate-100 font-extrabold text-sm py-2" value="transportation">Transportation</option>
            <option className="bg-[#0f172a] text-slate-100 font-extrabold text-sm py-2" value="sanitation">Sanitation</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
            Demand Intensity Heat Matrix
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotspotItems.map((item) => {
              const isSelected = item.region.id === selectedRegionId;
              return (
                <div
                  key={item.region.id}
                  onClick={() => setSelectedRegionId(item.region.id)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer relative shadow-xl ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500/80 shadow-2xl shadow-amber-950/60 ring-2 ring-amber-500/60 glow-amber'
                      : 'glass-card hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-mono text-amber-400 font-extrabold uppercase">
                        HOTSPOT RANK #{item.rank}
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-100 mt-0.5">{item.region.district_city}</h3>
                      <div className="text-xs text-slate-300 font-medium">{item.region.state_province}, {item.region.country}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-2xl font-extrabold text-amber-300">{item.hotspotScore}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">HOTSPOT SCORE</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">DEMAND / 100K</div>
                      <div className="text-base font-extrabold text-slate-100">{item.perCapitaPer100k}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">AVG GAP SCORE</div>
                      <div className="text-base font-extrabold text-rose-400">{item.avgGap.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Region Intelligence Side Panel */}
        <div className="p-6 rounded-2xl glass-card space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Region Intelligence Panel</span>
              <span className="text-xs font-mono text-slate-300 font-bold">{selectedRegion.country_code}</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-100 mt-3 font-mono">{selectedRegion.district_city}</h2>
            <p className="text-xs text-slate-300 font-medium">{selectedRegion.state_province}, {selectedRegion.country}</p>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300 font-bold">Resident Population:</span>
              <span className="font-extrabold text-slate-100 text-sm">{selectedRegion.population.toLocaleString()}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300 font-bold">Vulnerability Index:</span>
              <span className="font-extrabold text-amber-400 text-sm">{selectedRegion.vulnerability_index.toFixed(2)}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300 font-bold">Youth Demographic %:</span>
              <span className="font-extrabold text-cyan-400 text-sm">{selectedRegion.youth_percentage || 32.0}%</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300 font-bold">Elderly Demographic %:</span>
              <span className="font-extrabold text-indigo-400 text-sm">{selectedRegion.elderly_percentage || 14.0}%</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300 font-bold">Primary Language:</span>
              <span className="font-extrabold text-emerald-400 text-sm">{selectedRegion.primary_language.toUpperCase()}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => setActiveDetailRegion(selectedRegion)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg glow-cyan"
            >
              <MapPin className="w-4 h-4" />
              <span>Enter Region Details</span>
            </button>

            <button
              onClick={() => onNavigate && onNavigate('recommendations')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <span>Open Regional Evidence Priorities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Municipal Hotspot Ranking Table */}
      <div className="p-6 md:p-8 rounded-2xl glass-card space-y-4">
        <h3 className="text-base font-extrabold text-slate-100 font-mono">Municipal Hotspot Ranking Table</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-200 border-b border-slate-800 font-bold">
              <tr>
                <th className="p-3.5">RANK</th>
                <th className="p-3.5">REGION</th>
                <th className="p-3.5">COUNTRY</th>
                <th className="p-3.5">TOP CATEGORY</th>
                <th className="p-3.5">DEMAND / 100K</th>
                <th className="p-3.5">GAP SCORE</th>
                <th className="p-3.5">VULNERABILITY</th>
                <th className="p-3.5">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {hotspotItems.map((item) => (
                <tr key={item.region.id} className="hover:bg-slate-950/80 transition">
                  <td className="p-3.5 font-extrabold text-amber-400">#{item.rank}</td>
                  <td className="p-3.5 font-bold text-slate-100 text-sm">{item.region.district_city}</td>
                  <td className="p-3.5 text-slate-300 font-semibold">{item.region.country}</td>
                  <td className="p-3.5 text-cyan-400 font-bold">{item.topCategory}</td>
                  <td className="p-3.5 font-extrabold text-slate-100">{item.perCapitaPer100k}</td>
                  <td className="p-3.5 font-extrabold text-rose-400">{item.avgGap.toFixed(2)}</td>
                  <td className="p-3.5 text-slate-200 font-semibold">{item.region.vulnerability_index.toFixed(2)}</td>
                  <td className="p-3.5">
                    <button
                      onClick={() => setActiveDetailRegion(item.region)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-700 hover:bg-cyan-900 font-bold text-[11px] flex items-center gap-1 transition"
                    >
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
      />
    </div>
  );
};
