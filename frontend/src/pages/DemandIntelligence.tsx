import React, { useState } from 'react';
import { Search, Filter, Globe2, TrendingUp } from 'lucide-react';
import { CitizenRequest, DemandMomentumSignal, Region } from '../types';
import { TrendBadge } from '../components/common/TrendBadge';
import { CitizenVoiceComposer } from '../components/common/CitizenVoiceComposer';

interface DemandIntelligenceProps {
  requests: CitizenRequest[];
  regions: Region[];
  trends?: DemandMomentumSignal[];
  onSignalAdded?: (req: CitizenRequest) => void;
}

export const DemandIntelligence: React.FC<DemandIntelligenceProps> = ({
  requests,
  regions,
  onSignalAdded,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('ALL');

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

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 space-y-2">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight font-mono">
          Citizen Demand Intelligence
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed font-sans">
          Understand community needs, track demand concentration across languages, and detect emerging demand velocity trends.
        </p>
      </div>

      {/* Interactive Multilingual Citizen Voice Composer */}
      <CitizenVoiceComposer regions={regions} onSignalAdded={onSignalAdded} />

      {/* Filter Bar */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-100 uppercase tracking-wide">
          <Filter className="w-4 h-4 text-sky-400" />
          <span>Multilingual Signal Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search citizen feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border-2 border-slate-700 rounded-xl text-xs font-extrabold text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-400"
            />
          </div>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-slate-950 border-2 border-slate-700 text-slate-100 font-extrabold text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-400 font-mono cursor-pointer"
          >
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="ALL">All Regions ({regions.length})</option>
            {regions.map((r) => (
              <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" key={r.id} value={r.id}>
                {r.district_city}, {r.country_code}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border-2 border-slate-700 text-slate-100 font-extrabold text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-400 font-mono cursor-pointer"
          >
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="ALL">All Categories</option>
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="healthcare">Healthcare</option>
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="water">Clean Water</option>
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="electricity">Electricity</option>
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="transportation">Transportation</option>
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="digital_connectivity">Digital Connectivity</option>
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="sanitation">Sanitation</option>
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-950 border-2 border-slate-700 text-slate-100 font-extrabold text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-400 font-mono cursor-pointer"
          >
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="ALL">All Languages</option>
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="te">Telugu (te)</option>
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="hi">Hindi (hi)</option>
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="mr">Marathi (mr)</option>
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="pt">Portuguese (pt)</option>
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="zu">Zulu (zu)</option>
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="bn">Bengali (bn)</option>
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="en">English (en)</option>
          </select>

          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="bg-slate-950 border-2 border-slate-700 text-slate-100 font-extrabold text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-400 font-mono cursor-pointer"
          >
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="ALL">All Urgency Levels</option>
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="CRITICAL">CRITICAL</option>
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="HIGH">HIGH</option>
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="MEDIUM">MEDIUM</option>
            <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 font-mono">Category Demand Distribution</h3>
            <span className="text-xs font-mono font-bold text-sky-400">{requests.length} Total Verified Signals</span>
          </div>

          <div className="space-y-4">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / (requests.length || 1)) * 100);
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-100 font-bold capitalize">{cat}</span>
                    <span className="text-sky-300 font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-100 font-mono">Multilingual Citizen Voice Representation</h3>
            </div>
            <span className="text-xs font-mono text-emerald-300 font-bold bg-emerald-950 px-2.5 py-1 rounded border border-emerald-700">
              NLP Engine Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(languageCounts).map(([code, count]) => {
              const pct = Math.round((count / (requests.length || 1)) * 100);
              return (
                <div key={code} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-slate-100">
                    {languageLabels[code] || code}
                  </div>
                  <div className="flex items-baseline justify-between mt-2 font-mono">
                    <span className="text-xl font-extrabold text-sky-400">{count}</span>
                    <span className="text-xs font-bold text-slate-300">{pct}% share</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Demand Velocity Momentum Signals */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-slate-100 font-mono">Demand Momentum Velocity Signals</h3>
          </div>
          <span className="text-xs text-slate-300 font-mono font-bold">30-Day Window Comparison</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-100 font-mono">Healthcare Demand</span>
              <TrendBadge trend="INCREASING" pctChange={34.5} />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Accelerating demand velocity in Kanpur South and Ekurhuleni North clinics.
            </p>
            <div className="text-xs font-mono font-bold text-emerald-400">+34.5% vs previous 30 days</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-100 font-mono">Clean Water Supply</span>
              <TrendBadge trend="EMERGING" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Sudden surge in pipeline fracture complaints in Pune Peri-Urban Ward 12.
            </p>
            <div className="text-xs font-mono font-bold text-amber-400">Emerging urgent signal</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-100 font-mono">Digital Broadband</span>
              <TrendBadge trend="STABLE" pctChange={2.1} />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Consistent steady request rate across student populations.
            </p>
            <div className="text-xs font-mono font-bold text-slate-300">Stable volume (+2.1%)</div>
          </div>
        </div>
      </div>

      {/* Citizen Feedback Feed Table */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-slate-100 font-mono">Filtered Citizen Requests ({filteredRequests.length})</h3>
          <span className="text-xs font-mono text-slate-300 font-bold">Showing verified records</span>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 font-bold">
            No citizen requests match the selected filters.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div key={req.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 font-mono">
                    <span className="font-bold text-slate-100 text-sm">{req.id}</span>
                    <span className="text-sky-300 font-bold">• {req.request_category || req.category}</span>
                    <span className="text-slate-400 font-semibold">• {req.source}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-md text-slate-200 uppercase">
                      LANG: {req.language}
                    </span>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                      (req.urgency || req.extracted_entities.severity) === 'CRITICAL' ? 'bg-rose-950 text-rose-200 border border-rose-600' : 'bg-amber-950 text-amber-200 border border-amber-600'
                    }`}>
                      {req.urgency || req.extracted_entities.severity}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                    "{req.original_text}"
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-sky-950/60 border border-sky-800/60 text-xs font-mono font-bold text-sky-200 flex items-start gap-2">
                  <span className="text-sky-400 shrink-0">English Translation:</span>
                  <span className="text-slate-100 font-sans italic font-medium">"{req.translated_text}"</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
