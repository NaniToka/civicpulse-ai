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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight font-mono">
              Civic Evidence Explorer
            </h1>
          </div>
          <p className="text-sm text-slate-300 mt-1 font-sans font-medium">
            Explore granular evidence nodes, data sources, statistical confidence scores, and 6-step recommendation chains.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-100 font-bold text-xs rounded-lg px-3.5 py-2 focus:outline-none focus:border-sky-400 font-mono"
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
            className="bg-slate-950 border border-slate-700 text-slate-100 font-bold text-xs rounded-lg px-3.5 py-2 focus:outline-none focus:border-sky-400 font-mono"
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

      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-5 shadow-lg">
        <h2 className="text-lg font-bold text-slate-100 font-mono">6-Step Recommendation Evidence Chains</h2>
        <p className="text-xs text-slate-300 font-medium">Select a recommendation to inspect its complete machine-readable evidence trail.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recommendations.slice(0, 4).map((rec) => (
            <div
              key={rec.id}
              onClick={() => onOpenEvidenceModal && onOpenEvidenceModal(rec)}
              className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition cursor-pointer space-y-3 shadow-md group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold font-mono text-sky-400 uppercase">{rec.category}</span>
                <span className="text-xs font-mono font-bold text-slate-400">{rec.id}</span>
              </div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-sky-300 transition">{rec.region_name}</h3>
              <p className="text-xs text-slate-200 font-semibold leading-relaxed">"{rec.reasoning}"</p>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800 font-mono font-bold">
                <span className="text-emerald-400">+{(rec.confidence * 100).toFixed(0)}% Confidence</span>
                <span className="text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Open Evidence Chain →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-5 shadow-lg">
        <h2 className="text-lg font-bold text-slate-100 font-mono">
          Granular Evidence Nodes ({filteredItems.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 shadow-md">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-indigo-200 uppercase font-extrabold text-xs bg-indigo-950 px-2.5 py-1 rounded border border-indigo-700">
                  {item.type}
                </span>
                <span className="text-slate-400 font-mono font-bold text-xs">{item.id}</span>
              </div>

              <div className="text-sm font-extrabold text-slate-100">{item.metric}</div>
              <div className="text-xs text-slate-200 font-semibold leading-relaxed">"{item.explanation}"</div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-slate-300">Source: <span className="text-slate-100">{item.source}</span></span>
                <span className="text-emerald-400">+{(item.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
