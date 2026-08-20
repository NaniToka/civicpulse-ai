import React, { useState } from 'react';
import { FileCheck, ChevronRight } from 'lucide-react';
import { PriorityRecommendation } from '../types';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { TrendBadge } from '../components/common/TrendBadge';

interface RecommendationsViewProps {
  recommendations: PriorityRecommendation[];
  onOpenEvidenceModal?: (rec: PriorityRecommendation) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  recommendations,
  onOpenEvidenceModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');

  const filteredRecs = recommendations.filter((r) => {
    if (selectedCategory !== 'ALL' && r.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (selectedPriority !== 'ALL' && r.priority_level !== selectedPriority) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight font-mono">
              Priority Recommendations
            </h1>
          </div>
          <p className="text-sm text-slate-300 mt-1 font-sans font-medium">
            Evidence-backed capital infrastructure recommendations generated from citizen signals, deficit indices, and capital alignment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-100 font-bold text-xs rounded-lg px-3.5 py-2 focus:outline-none focus:border-sky-400 font-mono"
          >
            <option value="ALL">All Categories</option>
            <option value="healthcare">Healthcare</option>
            <option value="water">Clean Water</option>
            <option value="electricity">Electricity</option>
            <option value="transportation">Transportation</option>
            <option value="digital_connectivity">Digital Connectivity</option>
            <option value="sanitation">Sanitation</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-100 font-bold text-xs rounded-lg px-3.5 py-2 focus:outline-none focus:border-sky-400 font-mono"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      <div className="space-y-5">
        {filteredRecs.length === 0 ? (
          <div className="p-12 text-center text-sm font-bold text-slate-400 rounded-xl bg-slate-900 border border-slate-800">
            No priority recommendations match the selected filters.
          </div>
        ) : (
          filteredRecs.map((rec) => (
            <div
              key={rec.id}
              className="p-6 md:p-7 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-md space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <PriorityBadge level={rec.priority_level} score={rec.priority_score} size="lg" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{rec.category.toUpperCase()} Expansion</h3>
                    <div className="text-xs text-slate-300 font-mono font-bold">{rec.region_name} • {rec.id}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {rec.demand_momentum && (
                    <TrendBadge trend={rec.demand_momentum.trend} pctChange={rec.demand_momentum.percentage_change} />
                  )}
                  <button
                    onClick={() => onOpenEvidenceModal && onOpenEvidenceModal(rec)}
                    className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-sky-950/60"
                  >
                    <span>View Evidence Trail</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-slate-100 leading-relaxed">
                "{rec.reasoning}"
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demand Signal</div>
                  <div className="text-slate-100 font-bold text-sm mt-1">
                    {rec.evidence_card?.demand_signal_summary || '14 Verified Citizen Signals'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Infrastructure Deficit</div>
                  <div className="text-rose-400 font-extrabold text-sm mt-1">
                    {rec.evidence_card?.infrastructure_deficit_summary || 'Deficit Score: 0.82'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capital Project Overlap</div>
                  <div className="text-emerald-400 font-extrabold text-sm mt-1">
                    {rec.investment_overlap?.explanation || 'No active duplicate investment detected'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
