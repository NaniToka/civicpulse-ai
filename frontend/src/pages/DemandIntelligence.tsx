import React, { useState } from 'react';
import { Search, Filter, Globe2, TrendingUp, Layers, MapPin, ArrowRight } from 'lucide-react';
import { CitizenRequest, DemandMomentumSignal, Region } from '../types';
import { TrendBadge } from '../components/common/TrendBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { CitizenVoiceComposer } from '../components/common/CitizenVoiceComposer';
import { RegionDetailModal } from '../components/common/RegionDetailModal';

interface DemandIntelligenceProps {
  requests: CitizenRequest[];
  regions: Region[];
  trends?: DemandMomentumSignal[];
  onSignalAdded?: (req: CitizenRequest) => void;
  onNavigateToScenarios?: (regionId: string) => void;
}

export const DemandIntelligence: React.FC<DemandIntelligenceProps> = ({
  requests,
  regions,
  onSignalAdded,
  onNavigateToScenarios,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('ALL');
  const [activeDetailRegion, setActiveDetailRegion] = useState<Region | null>(null);

  const filteredRequests = requests.filter((r) => {
    if (selectedRegion !== 'ALL' && r.region_id !== selectedRegion) return false;
    if (selectedCategory !== 'ALL' && r.request_category.toLowerCase() !== selectedCategory.toLowerCase() && r.category !== selectedCategory) return false;
    if (selectedLanguage !== 'ALL' && r.language.toLowerCase() !== selectedLanguage.toLowerCase()) return false;
    if (selectedUrgency !== 'ALL' && (r.urgency || r.extracted_entities.severity) !== selectedUrgency) return false;
    if (
      searchQuery &&
      !r.original_text.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !r.translated_text.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const categoryCounts: Record<string, number> = {};
  requests.forEach((r) => {
    const cat = r.request_category || r.category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const languageCounts: Record<string, number> = {};
  requests.forEach((r) => {
    const lang = r.language.toUpperCase();
    languageCounts[lang] = (languageCounts[lang] || 0) + 1;
  });

  const languageLabels: Record<string, string> = {
    HI: 'Hindi (हिंदी)',
    MR: 'Marathi (मराठी)',
    PT: 'Portuguese (Português)',
    ZU: 'Zulu (isiZulu)',
    BN: 'Bengali (বাংলা)',
    TE: 'Telugu (తెలుగు)',
    EN: 'English',
  };

  const handleOpenRegionDetails = (regionId: string) => {
    const reg = regions.find((r) => r.id === regionId);
    if (reg) {
      setActiveDetailRegion(reg);
    } else {
      setActiveDetailRegion(regions[0] || null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-xl bg-[#0A0A0C] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Multilingual NLP Pipeline
            </span>
          </div>
          <h1 className="text-2xl md:text-[28px] font-semibold text-slate-100 tracking-tight">
            Citizen Demand <span className="hero-gradient-text">Intelligence Studio</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-md bg-[#121215] border border-white/[0.08] text-slate-300 font-medium">
              7 Native Languages
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#121215] border border-white/[0.08] text-slate-300 font-medium">
              30-Day Velocity Trends
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-4 rounded-lg bg-[#121215] border border-white/[0.08] text-center font-mono space-y-0.5">
            <div className="text-[11px] text-slate-400 uppercase font-medium">Signals Logged</div>
            <div className="text-2xl font-semibold text-indigo-400">{requests.length}</div>
          </div>
        </div>
      </div>

      {/* Interactive Multilingual Citizen Voice Composer */}
      <CitizenVoiceComposer
        regions={regions}
        onSignalAdded={onSignalAdded}
        onOpenRegionDetails={handleOpenRegionDetails}
      />

      {/* Filter Bar Console */}
      <div className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
            <Filter className="w-4 h-4 text-indigo-400" />
            <span>Multilingual Signal Filters</span>
          </div>
          <span className="text-xs font-mono text-indigo-400 font-medium">
            Showing {filteredRequests.length} of {requests.length} Signals
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search citizen feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#121215] border border-white/[0.08] rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-white/[0.16] font-mono"
            />
          </div>

          <div className="flex items-center gap-2 col-span-1 sm:col-span-2 lg:col-span-1">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-[#121215] border border-white/[0.08] text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option className="bg-[#121215] text-slate-100 text-sm py-1" value="ALL">All Regions ({regions.length})</option>
              {regions.map((r) => (
                <option className="bg-[#121215] text-slate-100 text-sm py-1" key={r.id} value={r.id}>
                  {r.district_city}, {r.country_code}
                </option>
              ))}
            </select>

            {selectedRegion !== 'ALL' && (
              <button
                onClick={() => handleOpenRegionDetails(selectedRegion)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition flex items-center gap-1 shrink-0 cursor-pointer"
                title="View selected region profile details"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#121215] border border-white/[0.08] text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="ALL">All Categories</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="healthcare">Healthcare</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="water">Clean Water</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="electricity">Electricity</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="transportation">Transportation</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="digital_connectivity">Digital Connectivity</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="sanitation">Sanitation</option>
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-[#121215] border border-white/[0.08] text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="ALL">All Languages</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="te">Telugu (te)</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="hi">Hindi (hi)</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="mr">Marathi (mr)</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="pt">Portuguese (pt)</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="zu">Zulu (zu)</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="bn">Bengali (bn)</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="en">English (en)</option>
          </select>

          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="bg-[#121215] border border-white/[0.08] text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="ALL">All Urgency Levels</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="CRITICAL">CRITICAL</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="HIGH">HIGH</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="MEDIUM">MEDIUM</option>
            <option className="bg-[#121215] text-slate-100 text-sm py-1" value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Category Demand Distribution</span>
            </h3>
            <span className="text-xs font-mono font-medium text-indigo-400">{requests.length} Signals</span>
          </div>

          <div className="space-y-3.5">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / (requests.length || 1)) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-200 font-medium capitalize">{cat}</span>
                    <span className="text-indigo-400 font-medium">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#121215] overflow-hidden border border-white/[0.08]">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-slate-100">Multilingual Voice Representation</h3>
            </div>
            <span className="text-xs font-mono text-indigo-400 font-medium bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
              NLP Engine Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(languageCounts).map(([code, count]) => {
              const pct = Math.round((count / (requests.length || 1)) * 100);
              return (
                <div key={code} className="p-3.5 rounded-lg bg-[#121215] border border-white/[0.08]">
                  <div className="text-xs font-medium text-slate-200">
                    {languageLabels[code] || code}
                  </div>
                  <div className="flex items-baseline justify-between mt-2 font-mono">
                    <span className="text-lg font-semibold text-indigo-400">{count}</span>
                    <span className="text-xs text-slate-400">{pct}% share</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Demand Velocity Momentum Signals */}
      <div className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <h3 className="text-[15px] font-semibold text-slate-100">Demand Momentum Velocity Signals</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">30-Day Window Comparison</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-[#121215] border border-white/[0.08] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-100 font-mono">Healthcare Demand</span>
              <TrendBadge trend="INCREASING" pctChange={34.5} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Accelerating demand velocity in Kanpur South and Ekurhuleni North clinics.
            </p>
            <div className="text-xs font-mono font-medium text-green-400">+34.5% vs previous 30 days</div>
          </div>

          <div className="p-4 rounded-lg bg-[#121215] border border-white/[0.08] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-100 font-mono">Clean Water Supply</span>
              <TrendBadge trend="EMERGING" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Sudden surge in pipeline fracture complaints in Pune Peri-Urban Ward 12.
            </p>
            <div className="text-xs font-mono font-medium text-amber-400">Emerging urgent signal</div>
          </div>

          <div className="p-4 rounded-lg bg-[#121215] border border-white/[0.08] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-100 font-mono">Digital Broadband</span>
              <TrendBadge trend="STABLE" pctChange={2.1} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Consistent steady request rate across student populations.
            </p>
            <div className="text-xs font-mono font-medium text-slate-400">Stable volume (+2.1%)</div>
          </div>
        </div>
      </div>

      {/* Citizen Feedback Feed Cards */}
      <div className="p-6 md:p-8 rounded-xl bg-[#0A0A0C] border border-white/[0.08] space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <h3 className="text-[15px] font-semibold text-slate-100">Filtered Citizen Requests ({filteredRequests.length})</h3>
          <span className="text-xs font-mono text-indigo-400">Showing verified demand signals</span>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 font-medium">
            No citizen requests match the selected filters.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-lg bg-[#121215] border border-white/[0.08] hover:border-white/[0.16] transition-colors space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-semibold text-indigo-400">{req.id}</span>
                    <span className="text-slate-300">• {req.request_category || req.category}</span>
                    <button
                      onClick={() => handleOpenRegionDetails(req.region_id)}
                      className="text-slate-400 hover:text-indigo-400 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{req.region_id}</span>
                    </button>
                    <span className="text-slate-400">• {req.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A0A0C] border border-white/[0.08] text-slate-400 uppercase">
                      LANG: {req.language}
                    </span>
                    <PriorityBadge level={req.urgency || req.extracted_entities.severity} size="sm" />
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0A0A0C] border border-white/[0.08]">
                  <p className="text-xs font-medium text-slate-100 leading-relaxed font-sans">
                    "{req.original_text}"
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#0A0A0C] border border-white/[0.08] text-xs font-mono text-slate-300 flex items-start gap-2">
                  <span className="text-indigo-400 shrink-0">Translation:</span>
                  <span className="text-slate-300 font-sans italic">"{req.translated_text}"</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Region Profile Modal */}
      <RegionDetailModal
        region={activeDetailRegion}
        onClose={() => setActiveDetailRegion(null)}
        onNavigateToScenarios={onNavigateToScenarios}
      />
    </div>
  );
};
