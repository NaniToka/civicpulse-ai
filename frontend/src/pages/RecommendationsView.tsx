import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { PriorityRecommendation } from '../types';

interface RecommendationsViewProps {
  recommendations: PriorityRecommendation[];
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({ recommendations }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-civic-100 tracking-tight">Explainable Priority Recommendations</h2>
        <p className="text-xs text-civic-400 mt-1">
          Objective project prioritization ranking backed by reproducible multi-factor scoring and synthesized evidence cards.
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, idx) => (
          <Card key={rec.id} className="hover:border-civic-700 transition-colors">
            <div className="space-y-4">
              {/* Header Row */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-civic-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-civic-800 flex items-center justify-center font-bold text-accent-blue text-sm border border-civic-700">
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-civic-100">{rec.category}</h3>
                    <p className="text-xs text-civic-400">{rec.region_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={rec.priority_score > 75 ? 'danger' : rec.priority_score > 50 ? 'warning' : 'neutral'} size="md">
                    Priority Score: {rec.priority_score.toFixed(1)} / 100
                  </Badge>
                </div>
              </div>

              {/* Reasoning */}
              <p className="text-xs sm:text-sm text-civic-200 leading-relaxed bg-civic-950/60 p-3 rounded border border-civic-800">
                <b>Policy Justification:</b> {rec.reasoning}
              </p>

              {/* Evidence Card */}
              <div className="bg-civic-950/80 rounded-lg p-4 border border-civic-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-accent-violet">
                  <FileText className="w-4 h-4" />
                  <span>Synthesized Policymaker Evidence Card</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-civic-900/60 rounded border border-civic-800/80">
                    <span className="text-civic-400 block font-medium">Citizen Demand Signal:</span>
                    <span className="text-civic-200 mt-0.5 block">{rec.evidence_card.demand_signal_summary}</span>
                  </div>
                  <div className="p-2.5 bg-civic-900/60 rounded border border-civic-800/80">
                    <span className="text-civic-400 block font-medium">Infrastructure Deficit:</span>
                    <span className="text-civic-200 mt-0.5 block">{rec.evidence_card.infrastructure_deficit_summary}</span>
                  </div>
                  <div className="p-2.5 bg-civic-900/60 rounded border border-civic-800/80">
                    <span className="text-civic-400 block font-medium">Demographic Context:</span>
                    <span className="text-civic-200 mt-0.5 block">{rec.evidence_card.demographic_impact_summary}</span>
                  </div>
                  <div className="p-2.5 bg-civic-900/60 rounded border border-civic-800/80">
                    <span className="text-civic-400 block font-medium">Public Investment Status:</span>
                    <span className="text-civic-200 mt-0.5 block">{rec.evidence_card.investment_status_summary}</span>
                  </div>
                </div>
              </div>

              {/* Policy Action */}
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 p-3 rounded">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span><b>Action Item:</b> {rec.recommended_action}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
