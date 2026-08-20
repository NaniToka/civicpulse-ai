import React, { useState } from 'react';
import { Network } from 'lucide-react';
import { PriorityRecommendation, Region } from '../types';

interface EvidenceExplorerProps {
  recommendations: PriorityRecommendation[];
  regions: Region[];
  onOpenEvidenceModal?: (rec: PriorityRecommendation) => void;
}

export const EvidenceExplorer: React.FC<EvidenceExplorerProps> = ({
  recommendations,
  regions,
  onOpenEvidenceModal,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const allEvidenceItems = recommendations.flatMap((r) => r.evidence_items || []);

  const filteredItems = allEvidenceItems.filter((item) => {
    if (selectedRegion !== 'ALL' && item.region_id !== selectedRegion) return false;
    if (selectedType !== 'ALL' && item.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight font-mono">
              Civic Evidence Explorer
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Explore granular evidence nodes, data sources, statistical confidence scores, and 6-step recommendation chains.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500 font-mono"
          >
            <option value="ALL">All Regions</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.district_city}, {r.country_code}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500 font-mono"
          >
            <option value="ALL">All Evidence Types</option>
            <option value="citizen_demand">Citizen Demand</option>
            <option value="demand_momentum">Demand Momentum</option>
            <option value="infrastructure_gap">Infrastructure Gap</option>
            <option value="demographic_need">Demographic Need</option>
            <option value="investment_context">Investment Context</option>
          </select>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-slate-100 font-mono">6-Step Recommendation Evidence Chains</h2>
        <p className="text-xs text-slate-400">Select a recommendation to inspect its complete machine-readable evidence trail.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.slice(0, 4).map((rec) => (
            <div
              key={rec.id}
              onClick={() => onOpenEvidenceModal && onOpenEvidenceModal(rec)}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-sky-400 uppercase">{rec.category}</span>
                <span className="text-[10px] font-mono text-slate-500">{rec.id}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-sky-300 transition">{rec.region_name}</h3>
              <p className="text-xs text-slate-400 italic line-clamp-2">"{rec.reasoning}"</p>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80 font-mono">
                <span className="text-emerald-400 font-semibold">+{(rec.confidence * 100).toFixed(0)}% Confidence</span>
                <span className="text-sky-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Open Evidence Chain →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-slate-100 font-mono">
          Granular Evidence Nodes ({filteredItems.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-indigo-400 uppercase font-semibold text-[10px] bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                  {item.type}
                </span>
                <span className="text-slate-500 font-mono text-[10px]">{item.id}</span>
              </div>

              <div className="text-sm font-bold text-slate-100">{item.metric}</div>
              <div className="text-xs text-slate-300 italic">"{item.explanation}"</div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Source: <span className="text-slate-200">{item.source}</span></span>
                <span className="text-emerald-400 font-semibold">+{(item.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
