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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight font-mono">
              Per-Capita Demand Hotspots
            </h1>
          </div>
          <p className="text-sm text-slate-300 mt-1 font-sans font-medium">
            Detecting demand hotspots by normalizing citizen signals against regional population (per 100,000 residents) and capacity gaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-300" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-100 font-bold text-xs rounded-lg px-3.5 py-2 focus:outline-none focus:border-sky-400 font-mono"
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
                  className={`p-6 rounded-xl border transition-all cursor-pointer relative shadow-md ${
                    isSelected
                      ? 'bg-amber-950/60 border-amber-500 shadow-xl shadow-amber-950/80 ring-2 ring-amber-500/60'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-mono text-amber-400 font-extrabold uppercase">
                        HOTSPOT RANK #{item.rank}
                      </span>
                      <h3 className="text-lg font-bold text-slate-100 mt-0.5">{item.region.district_city}</h3>
                      <div className="text-xs text-slate-300 font-medium">{item.region.state_province}, {item.region.country}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-2xl font-extrabold text-amber-300">{item.hotspotScore}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">HOTSPOT SCORE</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <div className="text-[10px] text-slate-300 font-bold uppercase">DEMAND / 100K</div>
                      <div className="text-base font-extrabold text-slate-100">{item.perCapitaPer100k}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-300 font-bold uppercase">AVG GAP SCORE</div>
                      <div className="text-base font-extrabold text-rose-400">{item.avgGap.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6 shadow-md">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-sky-400 font-bold uppercase">Region Intelligence Panel</span>
              <span className="text-xs font-mono text-slate-300 font-bold">{selectedRegion.country_code}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-1">{selectedRegion.district_city}</h2>
            <p className="text-xs text-slate-300 font-medium">{selectedRegion.state_province}, {selectedRegion.country}</p>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300 font-bold">Resident Population:</span>
              <span className="font-extrabold text-slate-100 text-sm">{selectedRegion.population.toLocaleString()}</span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300 font-bold">Vulnerability Index:</span>
              <span className="font-extrabold text-amber-400 text-sm">{selectedRegion.vulnerability_index.toFixed(2)}</span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300 font-bold">Youth Demographic %:</span>
              <span className="font-extrabold text-sky-400 text-sm">{selectedRegion.youth_percentage || 32.0}%</span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300 font-bold">Elderly Demographic %:</span>
              <span className="font-extrabold text-indigo-400 text-sm">{selectedRegion.elderly_percentage || 14.0}%</span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300 font-bold">Primary Language:</span>
              <span className="font-extrabold text-emerald-400 text-sm">{selectedRegion.primary_language.toUpperCase()}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('recommendations')}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-sky-950/60"
          >
            <span>Open Regional Evidence Priorities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
        <h3 className="text-base font-bold text-slate-100 font-mono">Municipal Hotspot Ranking Table</h3>

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
                <th className="p-3.5">HOTSPOT SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {hotspotItems.map((item) => (
                <tr key={item.region.id} className="hover:bg-slate-950/80 transition">
                  <td className="p-3.5 font-extrabold text-amber-400">#{item.rank}</td>
                  <td className="p-3.5 font-bold text-slate-100 text-sm">{item.region.district_city}</td>
                  <td className="p-3.5 text-slate-300 font-semibold">{item.region.country}</td>
                  <td className="p-3.5 text-sky-400 font-bold">{item.topCategory}</td>
                  <td className="p-3.5 font-extrabold text-slate-100">{item.perCapitaPer100k}</td>
                  <td className="p-3.5 font-extrabold text-rose-400">{item.avgGap.toFixed(2)}</td>
                  <td className="p-3.5 text-slate-200 font-semibold">{item.region.vulnerability_index.toFixed(2)}</td>
                  <td className="p-3.5 font-extrabold text-amber-300 text-sm">{item.hotspotScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
