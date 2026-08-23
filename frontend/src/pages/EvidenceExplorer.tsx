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
    <div className="space-y-8 animate-in fade-in duration-150">
      <div className="p-6 md:p-8 rounded-xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-indigo-600 font-extrabold" />
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight">
              Proof & <span className="hero-gradient-text">Evidence Explorer</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-xs sm:text-sm font-extrabold">
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
              Why This Project Was Picked
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
              Transparent Proof Trail
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs sm:text-sm font-bold">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-slate-100 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none cursor-pointer font-bold"
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
            className="bg-slate-100 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none cursor-pointer font-bold"
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

      <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4 shadow-sm">
        <h2 className="text-base sm:text-lg font-extrabold text-slate-950 font-mono">6-Step Recommendation Evidence Chains</h2>
        <p className="text-xs sm:text-sm text-slate-700 font-bold">Select a recommendation to inspect its complete machine-readable evidence trail.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.slice(0, 4).map((rec) => (
            <div
              key={rec.id}
              onClick={() => onOpenEvidenceModal && onOpenEvidenceModal(rec)}
              className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer space-y-3 shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold font-mono text-indigo-700 uppercase">{rec.category}</span>
                <span className="text-xs font-mono font-bold text-slate-600">{rec.id}</span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-950 group-hover:text-indigo-700 transition-colors">{rec.region_name}</h3>
              <p className="text-xs sm:text-sm text-slate-800 font-bold italic leading-relaxed">"{rec.reasoning}"</p>

              <div className="flex items-center justify-between text-xs sm:text-sm pt-3 border-t border-slate-200 font-mono font-bold">
                <span className="text-emerald-700 font-extrabold">+{(rec.confidence * 100).toFixed(0)}% Confidence</span>
                <span className="text-indigo-700 font-extrabold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Open Evidence Chain →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4 shadow-sm">
        <h2 className="text-base sm:text-lg font-extrabold text-slate-950 font-mono">
          Granular Evidence Nodes ({filteredItems.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-indigo-700 uppercase font-extrabold text-xs bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {item.type}
                </span>
                <span className="text-slate-600 font-mono font-bold text-xs">{item.id}</span>
              </div>

              <div className="text-sm sm:text-base font-extrabold text-slate-950 tracking-tight">{item.metric}</div>
              <div className="text-xs sm:text-sm text-slate-800 font-bold">{item.explanation}</div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 font-mono font-bold">
                <span className="text-slate-700">Weight Impact</span>
                <span className="text-indigo-700 font-extrabold">+{item.confidence.toFixed(1)} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
