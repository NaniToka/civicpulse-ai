import React, { useState } from 'react';
import { Search, Filter, Globe2, TrendingUp } from 'lucide-react';
import { CitizenRequest, DemandMomentumSignal, Region } from '../types';
import { TrendBadge } from '../components/common/TrendBadge';

interface DemandIntelligenceProps {
  requests: CitizenRequest[];
  regions: Region[];
  trends?: DemandMomentumSignal[];
}

export const DemandIntelligence: React.FC<DemandIntelligenceProps> = ({ requests, regions }) => {
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
    EN: 'English',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-slate-800/80 pb-5">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight font-mono">
          Citizen Demand Intelligence
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Understand community needs, track demand concentration across languages, and detect emerging demand velocity trends.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wide">
          <Filter className="w-4 h-4 text-sky-400" />
          <span>Multilingual Signal Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search citizen feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500 font-mono"
          >
            <option value="ALL">All Regions ({regions.length})</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.district_city}, {r.country_code}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500 font-mono"
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
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500 font-mono"
          >
            <option value="ALL">All Languages</option>
            <option value="hi">Hindi (hi)</option>
            <option value="mr">Marathi (mr)</option>
            <option value="pt">Portuguese (pt)</option>
            <option value="zu">Zulu (zu)</option>
            <option value="bn">Bengali (bn)</option>
            <option value="en">English (en)</option>
          </select>

          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500 font-mono"
          >
            <option value="ALL">All Urgency Levels</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 font-mono">Category Demand Distribution</h3>
            <span className="text-xs font-mono text-slate-400">{requests.length} Total Verified Signals</span>
          </div>

          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / (requests.length || 1)) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300 capitalize">{cat}</span>
                    <span className="text-sky-400 font-semibold">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-100 font-mono">Multilingual Citizen Voice Representation</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              NLP Engine Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(languageCounts).map(([code, count]) => {
              const pct = Math.round((count / (requests.length || 1)) * 100);
              return (
                <div key={code} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                  <div className="text-xs font-semibold text-slate-200">
                    {languageLabels[code] || code}
                  </div>
                  <div className="flex items-baseline justify-between mt-2 font-mono">
                    <span className="text-lg font-bold text-sky-400">{count}</span>
                    <span className="text-xs text-slate-400">{pct}% share</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-slate-100 font-mono">Demand Momentum Velocity Signals</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">30-Day Window Comparison</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-200 font-mono">Healthcare Demand</span>
              <TrendBadge trend="INCREASING" pctChange={34.5} />
            </div>
            <p className="text-xs text-slate-400">
              Accelerating demand velocity in Kanpur South and Ekurhuleni North clinics.
            </p>
            <div className="text-[11px] font-mono text-emerald-400">+34.5% vs previous 30 days</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-200 font-mono">Clean Water Supply</span>
              <TrendBadge trend="EMERGING" />
            </div>
            <p className="text-xs text-slate-400">
              Sudden surge in pipeline fracture complaints in Pune Peri-Urban Ward 12.
            </p>
            <div className="text-[11px] font-mono text-amber-400">Emerging urgent signal</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-200 font-mono">Digital Broadband</span>
              <TrendBadge trend="STABLE" pctChange={2.1} />
            </div>
            <p className="text-xs text-slate-400">
              Consistent steady request rate across student populations.
            </p>
            <div className="text-[11px] font-mono text-slate-400">Stable volume (+2.1%)</div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100 font-mono">Filtered Citizen Requests ({filteredRequests.length})</h3>
          <span className="text-xs font-mono text-slate-400">Showing verified records</span>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No citizen requests match the selected filters.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-slate-200">{req.id}</span>
                    <span className="text-slate-400">• {req.request_category || req.category}</span>
                    <span className="text-slate-500">• {req.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400 uppercase">
                      Lang: {req.language}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      (req.urgency || req.extracted_entities.severity) === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {req.urgency || req.extracted_entities.severity}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic">"{req.original_text}"</p>
                <div className="text-xs text-sky-400 font-mono">
                  English Translation: "{req.translated_text}"
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
