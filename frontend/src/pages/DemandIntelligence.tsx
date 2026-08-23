import React, { useState } from 'react';
import { Search, Filter, Globe2, TrendingUp, Layers, MapPin } from 'lucide-react';
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
    <div className="space-y-8 animate-in fade-in duration-150 text-slate-950 font-bold">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 font-bold" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 font-mono">
              Citizen Feedback & Growth
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight">
            Citizen Complaints & <span className="hero-gradient-text">Feedback Trends</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs sm:text-sm font-extrabold">
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
              7 Native Languages
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
              Growth & Surge Trends
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center font-mono space-y-0.5 shadow-2xs">
            <div className="text-xs font-extrabold text-slate-800 uppercase">Signals Logged</div>
            <div className="text-3xl font-extrabold text-indigo-700">{requests.length}</div>
          </div>
        </div>
      </div>

      {/* Interactive Multilingual Citizen Voice Studio */}
      <CitizenVoiceComposer
        regions={regions}
        onSignalAdded={onSignalAdded}
        onOpenRegionDetails={handleOpenRegionDetails}
      />

      {/* Filter Bar Console */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-950 uppercase tracking-wider font-mono">
            <Filter className="w-4.5 h-4.5 text-indigo-600" />
            <span>Multilingual Signal Filters</span>
          </div>
          <span className="text-xs sm:text-sm font-mono text-indigo-700 font-extrabold">
            Showing {filteredRequests.length} of {requests.length} Signals
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 font-bold">
          <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500 font-bold" />
            <input
              type="text"
              placeholder="Search text or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-950 placeholder:text-slate-500 focus:outline-none font-bold"
            />
          </div>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-slate-100 border border-slate-200 text-slate-950 text-xs sm:text-sm rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer font-bold"
          >
            <option value="ALL">All Regions</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.district_city}, {r.country_code}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-100 border border-slate-200 text-slate-950 text-xs sm:text-sm rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer font-bold"
          >
            <option value="ALL">All Sectors</option>
            <option value="healthcare">Healthcare</option>
            <option value="water">Water</option>
            <option value="sanitation">Sanitation</option>
            <option value="electricity">Electricity</option>
            <option value="transportation">Transportation</option>
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-100 border border-slate-200 text-slate-950 text-xs sm:text-sm rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer font-bold"
          >
            <option value="ALL">All Languages</option>
            <option value="te">Telugu (te)</option>
            <option value="hi">Hindi (hi)</option>
            <option value="mr">Marathi (mr)</option>
            <option value="bn">Bengali (bn)</option>
            <option value="pt">Portuguese (pt)</option>
            <option value="zu">Zulu (zu)</option>
            <option value="en">English (en)</option>
          </select>

          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="bg-slate-100 border border-slate-200 text-slate-950 text-xs sm:text-sm rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer font-bold"
          >
            <option value="ALL">All Urgency Levels</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-950 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>Category Demand Distribution</span>
            </h3>
            <span className="text-xs sm:text-sm font-mono font-extrabold text-indigo-700">{requests.length} Signals</span>
          </div>

          <div className="space-y-3.5">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / (requests.length || 1)) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs sm:text-sm font-mono font-extrabold">
                    <span className="text-slate-950 capitalize">{cat}</span>
                    <span className="text-indigo-700">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base sm:text-lg font-extrabold text-slate-950">Multilingual Voice Representation</h3>
            </div>
            <span className="text-xs font-mono font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
              NLP Engine Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(languageCounts).map(([code, count]) => {
              const pct = Math.round((count / (requests.length || 1)) * 100);
              return (
                <div key={code} className="p-4 rounded-xl bg-[#0A0A0C] border border-white/[0.12] shadow-md text-slate-100">
                  <div className="text-xs sm:text-sm font-extrabold text-white">
                    {languageLabels[code] || code}
                  </div>
                  <div className="flex items-baseline justify-between mt-2 font-mono">
                    <span className="text-xl font-extrabold text-indigo-400">{count}</span>
                    <span className="text-xs text-slate-400 font-bold">{pct}% share</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Demand Velocity Momentum Signals */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4 shadow-sm text-slate-950 font-bold">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 font-extrabold" />
            <h3 className="text-base sm:text-lg font-extrabold text-slate-950">Demand Momentum Velocity Signals</h3>
          </div>
          <span className="text-xs text-slate-700 font-mono font-bold">30-Day Window Comparison</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/[0.12] space-y-2 shadow-md text-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-extrabold text-white font-mono">Healthcare Demand</span>
              <TrendBadge trend="INCREASING" pctChange={34.5} />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-bold">
              Accelerating demand velocity in Kanpur South and Ekurhuleni North clinics.
            </p>
            <div className="text-xs sm:text-sm font-mono font-extrabold text-emerald-400">+34.5% vs previous 30 days</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/[0.12] space-y-2 shadow-md text-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-extrabold text-white font-mono">Clean Water Supply</span>
              <TrendBadge trend="EMERGING" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-bold">
              Sudden surge in pipeline fracture complaints in Pune Peri-Urban Ward 12.
            </p>
            <div className="text-xs sm:text-sm font-mono font-extrabold text-amber-400">Emerging urgent signal</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/[0.12] space-y-2 shadow-md text-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-extrabold text-white font-mono">Digital Broadband</span>
              <TrendBadge trend="STABLE" pctChange={2.1} />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-bold">
              Consistent steady request rate across student populations.
            </p>
            <div className="text-xs sm:text-sm font-mono font-extrabold text-slate-400">Stable volume (+2.1%)</div>
          </div>
        </div>
      </div>

      {/* Citizen Feedback Feed Cards */}
      <div className="p-6 md:p-7 rounded-xl bg-white border border-slate-200 space-y-6 shadow-sm text-slate-950 font-bold mb-10">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 font-sans">Filtered Citizen Requests ({filteredRequests.length})</h3>
          <span className="text-xs sm:text-sm font-mono font-extrabold text-indigo-700">Showing verified demand signals</span>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-700 font-extrabold">
            No citizen requests match the selected filters.
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-7">
            {filteredRequests.map((req) => (
              <div key={req.id} className="p-6 sm:p-7 rounded-xl bg-[#0A0A0C] border border-white/[0.12] hover:border-indigo-500/50 transition-colors space-y-5 shadow-md text-slate-100 font-bold">
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm font-bold border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-3 font-mono">
                    <span className="font-extrabold text-indigo-400 text-sm">{req.id}</span>
                    <span className="text-slate-300 font-extrabold">• {req.request_category || req.category}</span>
                    <button
                      onClick={() => handleOpenRegionDetails(req.region_id)}
                      className="text-slate-300 hover:text-indigo-400 flex items-center gap-1 font-extrabold cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-indigo-400" />
                      <span>{req.region_id}</span>
                    </button>
                    <span className="text-slate-400 font-bold">• {req.source}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#121215] border border-white/[0.12] text-slate-300 font-extrabold uppercase">
                      LANG: {req.language}
                    </span>
                    <PriorityBadge level={req.urgency || req.extracted_entities.severity} size="sm" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#121215] border border-white/[0.08] shadow-2xs">
                  <p className="text-sm sm:text-base font-extrabold text-white leading-relaxed font-sans">
                    "{req.original_text}"
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#121215] border border-white/[0.08] text-xs sm:text-sm font-mono text-slate-200 flex items-start gap-2.5 shadow-2xs font-bold">
                  <span className="text-indigo-400 shrink-0 font-extrabold">Translation:</span>
                  <span className="text-slate-300 font-sans italic font-bold">"{req.translated_text}"</span>
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
