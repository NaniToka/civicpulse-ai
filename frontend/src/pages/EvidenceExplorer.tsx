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
      <div className="p-6 md:p-8 rounded-xl bg-[#0A0A0C] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-400" />
            <h1 className="text-2xl md:text-[28px] font-semibold text-slate-100 tracking-tight">
              Civic Evidence <span className="hero-gradient-text">Explorer</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-md bg-[#121215] border border-white/[0.08] text-slate-300 font-medium">
              6-Step Evidence Nodes
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#121215] border border-white/[0.08] text-slate-300 font-medium">
              Traceable Audit Trail
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-[#121215] border border-white/[0.08] text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="ALL">All Regions</option>
            {regions.map((r) => (
              <option className="bg-[#121215] text-slate-100 text-sm py-1" key={r.id} value={r.id}>
                {r.district_city}, {r.country_code}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#121215] border border-white/[0.08] text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="ALL">All Evidence Types</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="citizen_demand">Citizen Demand</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="demand_momentum">Demand Momentum</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="infrastructure_gap">Infrastructure Gap</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="demographic_need">Demographic Need</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="investment_context">Investment Context</option>
          </select>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] space-y-4 shadow-sm">
        <h2 className="text-[15px] font-semibold text-slate-100 font-mono">6-Step Recommendation Evidence Chains</h2>
        <p className="text-xs text-slate-400">Select a recommendation to inspect its complete machine-readable evidence trail.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.slice(0, 4).map((rec) => (
            <div
              key={rec.id}
              onClick={() => onOpenEvidenceModal && onOpenEvidenceModal(rec)}
              className="p-5 rounded-lg bg-[#121215] border border-white/[0.08] hover:border-white/[0.16] transition-colors cursor-pointer space-y-3 shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold font-mono text-indigo-400 uppercase">{rec.category}</span>
                <span className="text-xs font-mono text-slate-400">{rec.id}</span>
              </div>
              <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">{rec.region_name}</h3>
              <p className="text-xs text-slate-300 italic leading-relaxed">"{rec.reasoning}"</p>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-white/[0.08] font-mono">
                <span className="text-green-400 font-medium">+{(rec.confidence * 100).toFixed(0)}% Confidence</span>
                <span className="text-indigo-400 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Open Evidence Chain →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] space-y-4 shadow-sm">
        <h2 className="text-[15px] font-semibold text-slate-100 font-mono">
          Granular Evidence Nodes ({filteredItems.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-4 rounded-lg bg-[#121215] border border-white/[0.08] space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-indigo-400 uppercase font-medium text-[10px] bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {item.type}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">{item.id}</span>
              </div>

              <div className="text-sm font-semibold text-slate-100 tracking-tight">{item.metric}</div>
              <div className="text-xs text-slate-300 italic leading-relaxed">"{item.explanation}"</div>

              <div className="pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Source: <span className="text-slate-200">{item.source}</span></span>
                <span className="text-green-400 font-medium">+{(item.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
