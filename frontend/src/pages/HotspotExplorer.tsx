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
    <div className="space-y-8 animate-in fade-in duration-150 text-slate-950 font-bold">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-600 font-extrabold" />
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight font-sans">
              Problem <span className="hero-gradient-text">Hotspots</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-xs sm:text-sm font-extrabold">
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
              Normalized by Population Size
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
              High Urgency Locations
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-bold font-mono text-xs sm:text-sm">
          <Filter className="w-4 h-4 text-indigo-600 font-extrabold" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-100 border border-slate-200 text-slate-950 text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none cursor-pointer font-bold"
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
          <div className="text-xs sm:text-sm font-extrabold text-slate-950 uppercase tracking-wider font-mono">
            Demand Intensity Heat Matrix
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotspotItems.map((item) => {
              const isSelected = item.region.id === selectedRegionId;
              return (
                <div
                  key={item.region.id}
                  onClick={() => setSelectedRegionId(item.region.id)}
                  className={`p-5 rounded-xl border transition-colors cursor-pointer relative shadow-md text-slate-100 font-bold ${
                    isSelected
                      ? 'bg-[#0A0A0C] border-amber-500 shadow-amber-500/10'
                      : 'bg-[#0A0A0C] border-white/[0.12] hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-mono text-amber-400 font-extrabold uppercase">
                        RANK #{item.rank}
                      </span>
                      <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5 tracking-tight">{item.region.district_city}</h3>
                      <div className="text-xs text-slate-400 font-bold">{item.region.state_province}, {item.region.country}</div>
                    </div>
                    <div className="text-right font-mono font-extrabold">
                      <div className="text-2xl font-extrabold text-amber-400">{item.hotspotScore}</div>
                      <div className="text-xs text-slate-400 uppercase">SCORE</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/[0.08] grid grid-cols-2 gap-2 text-xs sm:text-sm font-mono font-bold">
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-bold">DEMAND / 100K</div>
                      <div className="text-sm sm:text-base font-extrabold text-white">{item.perCapitaPer100k}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-bold">AVG GAP SCORE</div>
                      <div className="text-sm sm:text-base font-extrabold text-rose-400">{item.avgGap.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Region Intelligence Side Panel */}
        <div className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.12] space-y-5 shadow-md text-slate-100 font-bold">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="text-xs sm:text-sm font-mono text-indigo-400 font-extrabold uppercase">Region Profile</span>
              <span className="text-xs font-mono text-slate-400 font-bold">{selectedRegion.country_code}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white mt-3">{selectedRegion.district_city}</h2>
            <p className="text-xs sm:text-sm text-slate-400 font-bold">{selectedRegion.state_province}, {selectedRegion.country}</p>
          </div>

          <div className="space-y-2 text-xs sm:text-sm font-mono font-bold">
            <div className="p-3 rounded-xl bg-[#121215] border border-white/[0.08] flex justify-between items-center shadow-2xs">
              <span className="text-slate-400">Population:</span>
              <span className="font-extrabold text-white">{selectedRegion.population.toLocaleString()}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#121215] border border-white/[0.08] flex justify-between items-center shadow-2xs">
              <span className="text-slate-400">Vulnerability Index:</span>
              <span className="font-extrabold text-amber-400">{selectedRegion.vulnerability_index.toFixed(2)}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#121215] border border-white/[0.08] flex justify-between items-center shadow-2xs">
              <span className="text-slate-400">Youth Demographic %:</span>
              <span className="font-extrabold text-indigo-400">{selectedRegion.youth_percentage || 32.0}%</span>
            </div>

            <div className="p-3 rounded-xl bg-[#121215] border border-white/[0.08] flex justify-between items-center shadow-2xs">
              <span className="text-slate-400">Elderly Demographic %:</span>
              <span className="font-extrabold text-indigo-400">{selectedRegion.elderly_percentage || 14.0}%</span>
            </div>

            <div className="p-3 rounded-xl bg-[#121215] border border-white/[0.08] flex justify-between items-center shadow-2xs">
              <span className="text-slate-400">Primary Language:</span>
              <span className="font-extrabold text-emerald-400">{selectedRegion.primary_language.toUpperCase()}</span>
            </div>
          </div>

          <div className="space-y-2 font-extrabold">
            <button
              onClick={() => setActiveDetailRegion(selectedRegion)}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <MapPin className="w-4 h-4" />
              <span>Region Details</span>
            </button>

            <button
              onClick={() => onNavigate && onNavigate('recommendations')}
              className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-950 border border-slate-200 text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer font-extrabold"
            >
              <span>Evidence Priorities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Municipal Hotspot Ranking Table */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4 shadow-sm text-slate-950 font-bold">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-950">Municipal Hotspot Ranking Table</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse">
            <thead className="bg-slate-100 text-slate-800 border-b border-slate-200 uppercase text-xs font-extrabold">
              <tr>
                <th className="p-3">RANK</th>
                <th className="p-3">REGION</th>
                <th className="p-3">COUNTRY</th>
                <th className="p-3">TOP CATEGORY</th>
                <th className="p-3">DEMAND / 100K</th>
                <th className="p-3">GAP SCORE</th>
                <th className="p-3">VULNERABILITY</th>
                <th className="p-3">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-bold">
              {hotspotItems.map((item) => (
                <tr key={item.region.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-extrabold text-amber-800">#{item.rank}</td>
                  <td className="p-3 font-extrabold text-slate-950">{item.region.district_city}</td>
                  <td className="p-3 text-slate-700 font-bold">{item.region.country}</td>
                  <td className="p-3 text-indigo-700 font-extrabold">{item.topCategory}</td>
                  <td className="p-3 font-extrabold text-slate-950">{item.perCapitaPer100k}</td>
                  <td className="p-3 font-extrabold text-rose-800">{item.avgGap.toFixed(2)}</td>
                  <td className="p-3 text-slate-800 font-bold">{item.region.vulnerability_index.toFixed(2)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setActiveDetailRegion(item.region)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-950 text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                    >
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
      />
    </div>
  );
};
