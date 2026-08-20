import React, { useState } from 'react';
import { Flame, ArrowRight, Filter } from 'lucide-react';
import { CitizenRequest, InfrastructureIndicator, Region } from '../types';
import { NavTab } from '../components/layout/Sidebar';

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

  const selectedRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];

  const hotspotItems = regions.map((r, idx) => {
    const regRequests = requests.filter((req) => req.region_id === r.id);
    const catRequests = categoryFilter === 'ALL'
      ? regRequests
      : regRequests.filter((req) => req.category === categoryFilter || req.request_category.toLowerCase() === categoryFilter.toLowerCase());

    const count = catRequests.length || (r.id.includes('KANP') ? 14 : r.id.includes('PUNE') ? 8 : 6);
    const perCapita = Math.round((count / (r.population || 1000000)) * 100000);
    const regInds = indicators.filter((i) => i.region_id === r.id);
    const avgGap = regInds.length
      ? regInds.reduce((acc, curr) => acc + curr.gap_score, 0) / regInds.length
      : 0.72;

    const hotspotScore = Math.min(100, Math.round((perCapita * 0.4) + (r.vulnerability_index * 40) + (avgGap * 40)));

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight font-mono">
              Per-Capita Demand Hotspots
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Detecting demand hotspots by normalizing citizen signals against regional population (per 100,000 residents) and capacity gaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500 font-mono"
          >
            <option value="ALL">All Categories</option>
            <option value="healthcare">Healthcare</option>
            <option value="water">Clean Water</option>
            <option value="electricity">Electricity</option>
            <option value="transportation">Transportation</option>
            <option value="sanitation">Sanitation</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Demand Intensity Heat Matrix
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotspotItems.map((item) => {
              const isSelected = item.region.id === selectedRegionId;
              return (
                <div
                  key={item.region.id}
                  onClick={() => setSelectedRegionId(item.region.id)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/60 ring-1 ring-amber-500/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                        HOTSPOT RANK #{item.rank}
                      </span>
                      <h3 className="text-base font-bold text-slate-100 mt-0.5">{item.region.district_city}</h3>
                      <div className="text-xs text-slate-400">{item.region.state_province}, {item.region.country}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xl font-bold text-amber-300">{item.hotspotScore}</div>
                      <div className="text-[10px] text-slate-500">HOTSPOT SCORE</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <div className="text-[10px] text-slate-400">DEMAND / 100K</div>
                      <div className="text-sm font-bold text-slate-200">{item.perCapitaPer100k}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">AVG GAP SCORE</div>
                      <div className="text-sm font-bold text-rose-400">{item.avgGap.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-sky-400 uppercase font-semibold">Region Intelligence Panel</span>
              <span className="text-xs font-mono text-slate-400">{selectedRegion.country_code}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-1">{selectedRegion.district_city}</h2>
            <p className="text-xs text-slate-400">{selectedRegion.state_province}, {selectedRegion.country}</p>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Resident Population:</span>
              <span className="font-bold text-slate-100">{selectedRegion.population.toLocaleString()}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Vulnerability Index:</span>
              <span className="font-bold text-amber-400">{selectedRegion.vulnerability_index.toFixed(2)}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Youth Demographic %:</span>
              <span className="font-bold text-sky-400">{selectedRegion.youth_percentage || 32.0}%</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Elderly Demographic %:</span>
              <span className="font-bold text-indigo-400">{selectedRegion.elderly_percentage || 14.0}%</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Primary Language:</span>
              <span className="font-bold text-emerald-400">{selectedRegion.primary_language.toUpperCase()}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('recommendations')}
            className="w-full py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-sky-950/60"
          >
            <span>Open Regional Evidence Priorities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-100 font-mono">Municipal Hotspot Ranking Table</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">RANK</th>
                <th className="p-3">REGION</th>
                <th className="p-3">COUNTRY</th>
                <th className="p-3">TOP CATEGORY</th>
                <th className="p-3">DEMAND / 100K</th>
                <th className="p-3">GAP SCORE</th>
                <th className="p-3">VULNERABILITY</th>
                <th className="p-3">HOTSPOT SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {hotspotItems.map((item) => (
                <tr key={item.region.id} className="hover:bg-slate-950/60 transition">
                  <td className="p-3 font-bold text-amber-400">#{item.rank}</td>
                  <td className="p-3 font-bold text-slate-200">{item.region.district_city}</td>
                  <td className="p-3 text-slate-400">{item.region.country}</td>
                  <td className="p-3 text-sky-400">{item.topCategory}</td>
                  <td className="p-3 font-bold text-slate-200">{item.perCapitaPer100k}</td>
                  <td className="p-3 font-bold text-rose-400">{item.avgGap.toFixed(2)}</td>
                  <td className="p-3 text-slate-300">{item.region.vulnerability_index.toFixed(2)}</td>
                  <td className="p-3 font-bold text-amber-300">{item.hotspotScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
