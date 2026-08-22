import React, { useState } from 'react';
import { FileCheck, ChevronRight, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { PriorityRecommendation, Region } from '../types';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { TrendBadge } from '../components/common/TrendBadge';
import { RegionDetailModal } from '../components/common/RegionDetailModal';

interface RecommendationsViewProps {
  recommendations: PriorityRecommendation[];
  regions?: Region[];
  onOpenEvidenceModal?: (rec: PriorityRecommendation) => void;
  onNavigateToScenarios?: (regionId: string) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  recommendations,
  regions = [],
  onOpenEvidenceModal,
  onNavigateToScenarios,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('ALL');
  const [activeDetailRegion, setActiveDetailRegion] = useState<Region | null>(null);

  const filteredRecs = recommendations.filter((r) => {
    if (selectedCategory !== 'ALL' && r.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (selectedPriority !== 'ALL' && r.priority_level !== selectedPriority) return false;
    if (selectedRegionId !== 'ALL' && r.region_id !== selectedRegionId) return false;
    return true;
  });

  const handleOpenRegionDetails = (regionId: string) => {
    const reg = regions.find((r) => r.id === regionId);
    if (reg) {
      setActiveDetailRegion(reg);
    } else {
      // Fallback region representation if regions array is empty
      setActiveDetailRegion({
        id: regionId,
        country: 'India',
        country_code: 'IND',
        state_province: 'Uttar Pradesh',
        district_city: 'Kanpur South Belt',
        latitude: 26.4499,
        longitude: 80.3319,
        population: 2920000,
        population_density: 6250,
        youth_percentage: 38.5,
        elderly_percentage: 22.0,
        household_count: 580000,
        urbanization_rate: 72.0,
        digital_access_rate: 48.0,
        vulnerability_index: 0.81,
        primary_language: 'hi',
        is_synthetic: true,
        is_demo: true,
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header & Controls Bar */}
      <div className="p-6 md:p-8 rounded-xl bg-[#0A0A0C] border border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <FileCheck className="w-5 h-5 text-indigo-400" />
            <h1 className="text-2xl md:text-[28px] font-semibold text-slate-100 tracking-tight font-sans">
              Priority <span className="hero-gradient-text">Recommendations</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-md bg-[#121215] border border-white/[0.08] text-slate-300 font-medium">
              8-Factor Formula
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#121215] border border-white/[0.08] text-slate-300 font-medium">
              Ranked Priority Score
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          {/* Region Dropdown Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="bg-[#121215] border border-white/[0.08] text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Regions ({regions.length})</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.district_city}, {r.country_code}
                </option>
              ))}
            </select>

            {selectedRegionId !== 'ALL' && (
              <button
                onClick={() => handleOpenRegionDetails(selectedRegionId)}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Region Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#121215] border border-white/[0.08] text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
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
            className="bg-[#121215] border border-white/[0.08] text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-4">
        {filteredRecs.length === 0 ? (
          <div className="p-12 text-center text-xs font-medium text-slate-400 rounded-xl bg-[#0A0A0C] border border-white/[0.08]">
            No priority recommendations match the selected filters.
          </div>
        ) : (
          filteredRecs.map((rec) => (
            <div
              key={rec.id}
              className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] hover:border-white/[0.16] transition-colors shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <PriorityBadge level={rec.priority_level} score={rec.priority_score} size="lg" />
                  <div>
                    <h3 className="text-base font-semibold text-slate-100 tracking-tight">
                      {rec.category.toUpperCase()} Expansion
                    </h3>
                    <div className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                      <button
                        onClick={() => handleOpenRegionDetails(rec.region_id)}
                        className="text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                        title="Click to view detailed region profile"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{rec.region_name}</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </button>
                      <span>• {rec.id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {rec.demand_momentum && (
                    <TrendBadge trend={rec.demand_momentum.trend} pctChange={rec.demand_momentum.percentage_change} />
                  )}
                  <button
                    onClick={() => onOpenEvidenceModal && onOpenEvidenceModal(rec)}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>View Evidence Trail</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#121215] border border-white/[0.08] text-xs font-sans text-slate-200 italic leading-relaxed">
                "{rec.reasoning}"
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-lg bg-[#121215] border border-white/[0.08]">
                  <div className="text-[10px] uppercase text-slate-400 font-medium">Demand Signal</div>
                  <div className="text-slate-100 font-semibold text-xs mt-1">
                    {rec.evidence_card?.demand_signal_summary || '14 Verified Citizen Signals'}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#121215] border border-white/[0.08]">
                  <div className="text-[10px] uppercase text-slate-400 font-medium">Infrastructure Deficit</div>
                  <div className="text-red-400 font-semibold text-xs mt-1">
                    {rec.evidence_card?.infrastructure_deficit_summary || 'Deficit Score: 0.82'}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#121215] border border-white/[0.08]">
                  <div className="text-[10px] uppercase text-slate-400 font-medium">Capital Project Overlap</div>
                  <div className="text-green-400 font-semibold text-xs mt-1">
                    {rec.investment_overlap?.explanation || 'No active duplicate investment detected'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Region Profile Detail Modal */}
      <RegionDetailModal
        region={activeDetailRegion}
        onClose={() => setActiveDetailRegion(null)}
        onNavigateToScenarios={onNavigateToScenarios}
      />
    </div>
  );
};
