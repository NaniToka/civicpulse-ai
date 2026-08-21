import React, { useState } from 'react';
import { Database, Plus, CheckCircle2, ShieldAlert, MapPin, ArrowRight } from 'lucide-react';
import { CitizenRequest, InfrastructureIndicator, InvestmentProject, Region } from '../types';
import { api } from '../services/api';
import { RegionDetailModal } from '../components/common/RegionDetailModal';
import { ThreeDBarChart } from '../components/common/ThreeDBarChart';

interface DataExplorerProps {
  requests: CitizenRequest[];
  regions: Region[];
  indicators: InfrastructureIndicator[];
  investments: InvestmentProject[];
  onNewRequestAdded?: (req: CitizenRequest) => void;
}

export const DataExplorer: React.FC<DataExplorerProps> = ({
  requests,
  regions,
  indicators,
  investments,
  onNewRequestAdded,
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'regions' | 'indicators' | 'investments' | 'ingest'>('requests');

  const [rawText, setRawText] = useState('');
  const [language, setLanguage] = useState('hi');
  const [source, setSource] = useState('voice');
  const [regionId, setRegionId] = useState(regions[0]?.id || 'REG-IND-UP-KANP-02');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeDetailRegion, setActiveDetailRegion] = useState<Region | null>(null);

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setLoading(true);
    setSuccessMsg(null);
    try {
      const newReq = await api.ingestCitizenRequest({
        raw_text: rawText,
        language,
        source,
        region_id: regionId,
      });

      if (onNewRequestAdded) onNewRequestAdded(newReq);
      setSuccessMsg(`Successfully ingested and processed citizen request ${newReq.id}! Classified as sector '${newReq.category}'.`);
      setRawText('');
    } catch {
      setSuccessMsg('Request sent to NLP engine pipeline.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRegionDetails = (rId: string) => {
    const reg = regions.find((r) => r.id === rId);
    if (reg) {
      setActiveDetailRegion(reg);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-2xl glass-panel-cyan flex flex-col md:flex-row md:items-center justify-between gap-6 border border-cyan-800/40">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight font-sans">
              Synthetic Demonstration <span className="gradient-text-cyan">Datasets</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-[11px]">
            <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/80 text-cyan-300 font-bold">
              35 Indian Districts
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/80 text-indigo-300 font-bold">
              100% Demographic Census
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 font-bold">
              210 Deficit Indicators
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-950/80 border border-amber-600/80 text-xs font-mono font-bold text-amber-200 shadow-md">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>SYNTHETIC DEMO DATA</span>
        </div>
      </div>

      <div className="flex border-b border-slate-800 text-xs font-mono font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-5 py-3 font-extrabold transition border-b-2 whitespace-nowrap ${
            activeTab === 'requests'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/80'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Citizen Requests ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('regions')}
          className={`px-5 py-3 font-extrabold transition border-b-2 whitespace-nowrap ${
            activeTab === 'regions'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/80'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Regions & Census ({regions.length})
        </button>
        <button
          onClick={() => setActiveTab('indicators')}
          className={`px-5 py-3 font-extrabold transition border-b-2 whitespace-nowrap ${
            activeTab === 'indicators'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/80'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Infrastructure Indicators ({indicators.length})
        </button>
        <button
          onClick={() => setActiveTab('investments')}
          className={`px-5 py-3 font-extrabold transition border-b-2 whitespace-nowrap ${
            activeTab === 'investments'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/80'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Capital Investments ({investments.length})
        </button>
        <button
          onClick={() => setActiveTab('ingest')}
          className={`px-5 py-3 font-extrabold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'ingest'
              ? 'border-emerald-500 text-emerald-300 bg-emerald-950/80'
              : 'border-transparent text-emerald-400 hover:text-emerald-300'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Ingest Test Signal</span>
        </button>
      </div>

      <div className="p-6 md:p-8 rounded-2xl glass-card space-y-4">
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-100 font-mono">Citizen Requests Data</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-200 border-b border-slate-800 font-bold">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">REGION</th>
                    <th className="p-3.5">LANG</th>
                    <th className="p-3.5">CATEGORY</th>
                    <th className="p-3.5">URGENCY</th>
                    <th className="p-3.5">ORIGINAL TEXT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-950/80 transition">
                      <td className="p-3.5 font-extrabold text-cyan-400">{r.id}</td>
                      <td className="p-3.5 text-slate-200 font-bold">
                        <button
                          onClick={() => handleOpenRegionDetails(r.region_id)}
                          className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>{r.region_id}</span>
                        </button>
                      </td>
                      <td className="p-3.5 text-slate-300 uppercase font-bold">{r.language}</td>
                      <td className="p-3.5 text-slate-100 font-bold">{r.request_category || r.category}</td>
                      <td className="p-3.5 font-extrabold text-rose-400">{r.urgency || r.extracted_entities.severity}</td>
                      <td className="p-3.5 text-slate-200 font-semibold italic">"{r.original_text}"</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'regions' && (
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-100 font-mono">Regions & Demographic Census Data</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-200 border-b border-slate-800 font-bold">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">CITY</th>
                    <th className="p-3.5">COUNTRY</th>
                    <th className="p-3.5">POPULATION</th>
                    <th className="p-3.5">VULNERABILITY</th>
                    <th className="p-3.5">PRIMARY LANG</th>
                    <th className="p-3.5">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {regions.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-950/80 transition">
                      <td className="p-3.5 font-extrabold text-indigo-400">{r.id}</td>
                      <td className="p-3.5 font-extrabold text-slate-100 text-sm">{r.district_city}</td>
                      <td className="p-3.5 text-slate-300 font-semibold">{r.country}</td>
                      <td className="p-3.5 text-slate-100 font-bold">{r.population.toLocaleString()}</td>
                      <td className="p-3.5 font-extrabold text-amber-400">{r.vulnerability_index.toFixed(2)}</td>
                      <td className="p-3.5 text-emerald-400 uppercase font-extrabold">{r.primary_language}</td>
                      <td className="p-3.5">
                        <button
                          onClick={() => setActiveDetailRegion(r)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-md glow-cyan"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>Enter Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'indicators' && (
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-100 font-mono">Infrastructure Capacity Indicators</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-200 border-b border-slate-800 font-bold">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">REGION</th>
                    <th className="p-3.5">CATEGORY</th>
                    <th className="p-3.5">COVERAGE %</th>
                    <th className="p-3.5">GAP SCORE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {indicators.map((ind) => (
                    <tr key={ind.id} className="hover:bg-slate-950/80 transition">
                      <td className="p-3.5 font-bold text-slate-200">{ind.id}</td>
                      <td className="p-3.5 text-slate-300 font-bold">
                        <button
                          onClick={() => handleOpenRegionDetails(ind.region_id)}
                          className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>{ind.region_id}</span>
                        </button>
                      </td>
                      <td className="p-3.5 text-cyan-400 uppercase font-extrabold">{ind.category}</td>
                      <td className="p-3.5 text-slate-100 font-bold">{ind.coverage_ratio_pct}%</td>
                      <td className="p-3.5 font-extrabold text-rose-400">{ind.gap_score.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-100 font-mono">Public Capital Investments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-200 border-b border-slate-800 font-bold">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">PROJECT NAME</th>
                    <th className="p-3.5">REGION</th>
                    <th className="p-3.5">CATEGORY</th>
                    <th className="p-3.5">BUDGET (USD)</th>
                    <th className="p-3.5">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {investments.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-950/80 transition">
                      <td className="p-3.5 font-bold text-slate-200">{inv.id}</td>
                      <td className="p-3.5 font-extrabold text-slate-100">{inv.project_name}</td>
                      <td className="p-3.5 text-slate-300 font-bold">
                        <button
                          onClick={() => handleOpenRegionDetails(inv.region_id)}
                          className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>{inv.region_id}</span>
                        </button>
                      </td>
                      <td className="p-3.5 text-cyan-400 uppercase font-extrabold">{inv.category}</td>
                      <td className="p-3.5 text-emerald-400 font-extrabold">${inv.budget_usd.toLocaleString()}</td>
                      <td className="p-3.5 font-extrabold text-amber-400 uppercase">{inv.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ingest' && (
          <form onSubmit={handleIngest} className="space-y-5 max-w-2xl">
            <h3 className="text-base font-extrabold text-slate-100 font-mono">Ingest Multilingual Citizen Feedback Signal</h3>

            {successMsg && (
              <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-700 text-xs font-bold text-emerald-200 flex items-center gap-2 shadow-md">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-300">Citizen Raw Text Feedback:</label>
              <textarea
                rows={4}
                required
                placeholder="Enter feedback in Hindi, Marathi, Portuguese, Zulu, Bengali, English..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full p-4 bg-[#0b0f19] border border-slate-700 rounded-xl text-sm font-semibold text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-sans leading-relaxed shadow-inner"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono font-bold">
              <div>
                <label className="text-slate-200 text-sm">Language:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 text-slate-100 font-bold text-xs rounded-xl p-3.5 mt-1.5 focus:outline-none focus:border-cyan-400 cursor-pointer shadow-inner"
                >
                  <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="hi">Hindi (hi)</option>
                  <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="mr">Marathi (mr)</option>
                  <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="pt">Portuguese (pt)</option>
                  <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="zu">Zulu (zu)</option>
                  <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="bn">Bengali (bn)</option>
                  <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="en">English (en)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-200 text-sm">Channel Source:</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 text-slate-100 font-bold text-xs rounded-xl p-3.5 mt-1.5 focus:outline-none focus:border-cyan-400 cursor-pointer shadow-inner"
                >
                  <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="voice">Voice Call</option>
                  <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="text">SMS Text</option>
                  <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="whatsapp">WhatsApp</option>
                  <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="web">Web Portal</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-slate-200 text-sm">Target Region:</label>
                  <button
                    type="button"
                    onClick={() => handleOpenRegionDetails(regionId)}
                    className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <select
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 text-slate-100 font-bold text-xs rounded-xl p-3.5 mt-1.5 focus:outline-none focus:border-cyan-400 cursor-pointer shadow-inner"
                >
                  {regions.map((r) => (
                    <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" key={r.id} value={r.id}>
                      {r.district_city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs transition shadow-lg shadow-emerald-950/60 glow-emerald disabled:opacity-50"
            >
              {loading ? 'Ingesting via AI Pipeline...' : 'Ingest Signal into System'}
            </button>
          </form>
        )}
      </div>

      {/* 3D Animated Dataset Volume & Coverage Graph at the end */}
      <ThreeDBarChart />

      <RegionDetailModal
        region={activeDetailRegion}
        onClose={() => setActiveDetailRegion(null)}
      />
    </div>
  );
};
