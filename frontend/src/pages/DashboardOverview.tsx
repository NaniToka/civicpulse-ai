import React from 'react';
import {
  Users,
  AlertOctagon,
  FileCheck,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { PriorityRecommendation, CitizenRequest, Region } from '../types';

interface DashboardOverviewProps {
  recommendations: PriorityRecommendation[];
  requests: CitizenRequest[];
  regions: Region[];
  onNavigate: (tab: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  recommendations,
  requests,
  regions,
  onNavigate,
}) => {
  const topRec = recommendations[0];
  const totalImpact = regions.reduce((acc, r) => acc + r.population, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-civic-100 tracking-tight">Executive Demand Cockpit</h2>
        <p className="text-xs text-civic-400 mt-1">
          Real-time consolidation of citizen requests, infrastructure capacity gaps, and national capital priorities across BRICS.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Citizen Feedback Signals"
          value={requests.length}
          change="+18.4%"
          changeType="positive"
          icon={Users}
          description="Multilingual inputs analyzed"
        />
        <MetricCard
          title="Top Priority Hotspot"
          value={topRec ? `${topRec.priority_score.toFixed(1)} / 100` : 'N/A'}
          change="CRITICAL"
          changeType="negative"
          icon={AlertOctagon}
          description={topRec ? topRec.region_name : 'No recommendations'}
        />
        <MetricCard
          title="Active Projects Tracked"
          value={recommendations.length}
          change="100% Deterministic"
          changeType="neutral"
          icon={FileCheck}
          description="Scored with explainable rules"
        />
        <MetricCard
          title="Target Resident Impact"
          value={`${(totalImpact / 1000000).toFixed(1)}M`}
          change="BRICS Population"
          changeType="positive"
          icon={TrendingUp}
          description="Census demographic coverage"
        />
      </div>

      {/* Top Priority Action Section */}
      {topRec && (
        <Card
          title="🔥 Highest Urgency Priority Project Recommendation"
          subtitle="Generated via deterministic scoring + Gemini NLP evidence synthesis"
          action={
            <button
              onClick={() => onNavigate('recommendations')}
              className="text-xs flex items-center gap-1 text-accent-blue hover:underline font-semibold"
            >
              <span>View All Recommendations</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          }
        >
          <div className="bg-civic-950/60 border border-civic-800 rounded-lg p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-accent-blue">{topRec.category}</span>
                <h4 className="text-lg font-bold text-civic-100">{topRec.region_name}</h4>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="danger" size="md">
                  Priority Score: {topRec.priority_score.toFixed(1)} / 100
                </Badge>
              </div>
            </div>

            <p className="text-sm text-civic-200 leading-relaxed bg-civic-900/80 p-3 rounded border border-civic-800">
              {topRec.reasoning}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-civic-900/50 rounded border border-civic-800/80">
                <span className="font-semibold text-civic-400 block mb-1">Recommended Policy Action:</span>
                <span className="text-civic-200">{topRec.recommended_action}</span>
              </div>
              <div className="p-3 bg-civic-900/50 rounded border border-civic-800/80">
                <span className="font-semibold text-civic-400 block mb-1">Evidence Summary:</span>
                <span className="text-civic-200">{topRec.evidence_card.demand_signal_summary}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Grid of Regions & Recent Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="BRICS Target Regions & Demographics" subtitle="Sub-national target territories">
          <div className="space-y-3">
            {regions.map((reg) => (
              <div key={reg.id} className="p-3 bg-civic-950/40 rounded border border-civic-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-civic-100">{reg.district_city}, {reg.country}</div>
                  <div className="text-civic-400 mt-0.5">Pop: {reg.population.toLocaleString()} • Language: {reg.primary_language.toUpperCase()}</div>
                </div>
                <Badge variant="purple">Vulnerability: {reg.vulnerability_index.toFixed(2)}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Latest Multilingual Citizen Feedback" subtitle="Real-time voice & text ingest">
          <div className="space-y-3">
            {requests.slice(0, 3).map((req) => (
              <div key={req.id} className="p-3 bg-civic-950/40 rounded border border-civic-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-accent-blue">{req.request_category}</span>
                  <Badge variant={req.extracted_entities.severity === 'CRITICAL' ? 'danger' : 'warning'}>
                    {req.extracted_entities.severity}
                  </Badge>
                </div>
                <p className="text-civic-200 italic">"{req.translated_text}"</p>
                <div className="flex items-center justify-between text-[11px] text-civic-400">
                  <span>Source: {req.source} ({req.language.toUpperCase()})</span>
                  <span>Impacted: ~{req.extracted_entities.impacted_count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
