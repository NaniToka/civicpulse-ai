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
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-xl bg-[#121319] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <h1 className="text-2xl md:text-[28px] font-semibold text-slate-100 tracking-tight">
              Synthetic Demonstration <span className="hero-gradient-text">Datasets</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-md bg-[#1A1C24] border border-white/[0.08] text-slate-300 font-medium">
              35 Indian Districts
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#1A1C24] border border-white/[0.08] text-slate-300 font-medium">
              Demographic Census
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1C24] border border-white/[0.08] text-xs font-mono font-medium text-amber-400">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>DEMO DATASET</span>
        </div>
      </div>

      <div className="flex border-b border-white/[0.08] text-xs font-mono overflow-x-auto">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2.5 font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'requests'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Citizen Requests ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('regions')}
          className={`px-4 py-2.5 font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'regions'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Regions & Census ({regions.length})
        </button>
        <button
          onClick={() => setActiveTab('indicators')}
          className={`px-4 py-2.5 font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'indicators'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Infrastructure Indicators ({indicators.length})
        </button>
        <button
          onClick={() => setActiveTab('investments')}
          className={`px-4 py-2.5 font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'investments'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Capital Investments ({investments.length})
        </button>
        <button
          onClick={() => setActiveTab('ingest')}
          className={`px-4 py-2.5 font-medium transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'ingest'
              ? 'border-green-500 text-green-400'
              : 'border-transparent text-green-500/80 hover:text-green-400'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ingest Test Signal</span>
        </button>
      </div>

      <div className="p-6 rounded-xl bg-[#121319] border border-white/[0.08] space-y-4 shadow-sm">
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <h3 className="text-[15px] font-semibold text-slate-100 font-mono">Citizen Requests Data</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="bg-[#1A1C24] text-slate-400 border-b border-white/[0.08] uppercase text-[11px]">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">REGION</th>
                    <th className="p-3">LANG</th>
                    <th className="p-3">CATEGORY</th>
                    <th className="p-3">URGENCY</th>
                    <th className="p-3">ORIGINAL TEXT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.08]">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-[#1A1C24] transition-colors">
                      <td className="p-3 font-semibold text-indigo-400">{r.id}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleOpenRegionDetails(r.region_id)}
                          className="text-indigo-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>{r.region_id}</span>
                        </button>
                      </td>
                      <td className="p-3 text-slate-300 uppercase">{r.language}</td>
                      <td className="p-3 text-slate-100 font-medium">{r.request_category || r.category}</td>
                      <td className="p-3 font-semibold text-red-400">{r.urgency || r.extracted_entities.severity}</td>
                      <td className="p-3 text-slate-300 italic">"{r.original_text}"</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'regions' && (
          <div className="space-y-4">
            <h3 className="text-[15px] font-semibold text-slate-100 font-mono">Regions & Demographic Census Data</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="bg-[#1A1C24] text-slate-400 border-b border-white/[0.08] uppercase text-[11px]">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">CITY</th>
                    <th className="p-3">COUNTRY</th>
                    <th className="p-3">POPULATION</th>
                    <th className="p-3">VULNERABILITY</th>
                    <th className="p-3">PRIMARY LANG</th>
                    <th className="p-3">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.08]">
                  {regions.map((r) => (
                    <tr key={r.id} className="hover:bg-[#1A1C24] transition-colors">
                      <td className="p-3 font-semibold text-indigo-400">{r.id}</td>
                      <td className="p-3 font-semibold text-slate-100">{r.district_city}</td>
                      <td className="p-3 text-slate-400">{r.country}</td>
                      <td className="p-3 text-slate-100 font-medium">{r.population.toLocaleString()}</td>
                      <td className="p-3 font-semibold text-amber-400">{r.vulnerability_index.toFixed(2)}</td>
                      <td className="p-3 text-green-400 uppercase font-medium">{r.primary_language}</td>
                      <td className="p-3">
                        <button
                          onClick={() => setActiveDetailRegion(r)}
                          className="px-2.5 py-1 rounded-lg bg-[#1A1C24] hover:bg-[#161822] border border-white/[0.08] text-slate-300 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <MapPin className="w-3 h-3 text-indigo-400" />
                          <span>Details</span>
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
            <h3 className="text-[15px] font-semibold text-slate-100 font-mono">Infrastructure Capacity Indicators</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="bg-[#1A1C24] text-slate-400 border-b border-white/[0.08] uppercase text-[11px]">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">REGION</th>
                    <th className="p-3">CATEGORY</th>
                    <th className="p-3">COVERAGE %</th>
                    <th className="p-3">GAP SCORE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.08]">
                  {indicators.map((ind) => (
                    <tr key={ind.id} className="hover:bg-[#1A1C24] transition-colors">
                      <td className="p-3 text-slate-300">{ind.id}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleOpenRegionDetails(ind.region_id)}
                          className="text-indigo-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>{ind.region_id}</span>
                        </button>
                      </td>
                      <td className="p-3 text-indigo-400 uppercase font-semibold">{ind.category}</td>
                      <td className="p-3 text-slate-100 font-medium">{ind.coverage_ratio_pct}%</td>
                      <td className="p-3 font-semibold text-red-400">{ind.gap_score.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="space-y-4">
            <h3 className="text-[15px] font-semibold text-slate-100 font-mono">Public Capital Investments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="bg-[#1A1C24] text-slate-400 border-b border-white/[0.08] uppercase text-[11px]">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">PROJECT NAME</th>
                    <th className="p-3">REGION</th>
                    <th className="p-3">CATEGORY</th>
                    <th className="p-3">BUDGET (USD)</th>
                    <th className="p-3">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.08]">
                  {investments.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#1A1C24] transition-colors">
                      <td className="p-3 text-slate-300">{inv.id}</td>
                      <td className="p-3 font-semibold text-slate-100">{inv.project_name}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleOpenRegionDetails(inv.region_id)}
                          className="text-indigo-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>{inv.region_id}</span>
                        </button>
                      </td>
                      <td className="p-3 text-indigo-400 uppercase font-semibold">{inv.category}</td>
                      <td className="p-3 text-green-400 font-semibold">${inv.budget_usd.toLocaleString()}</td>
                      <td className="p-3 font-semibold text-amber-400 uppercase">{inv.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ingest' && (
          <form onSubmit={handleIngest} className="space-y-4 max-w-2xl">
            <h3 className="text-[15px] font-semibold text-slate-100 font-mono">Ingest Multilingual Citizen Feedback Signal</h3>

            {successMsg && (
              <div className="p-3.5 rounded-lg bg-[#1A1C24] border border-green-500/30 text-xs font-medium text-green-400 flex items-center gap-2 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-400">Citizen Raw Text Feedback:</label>
              <textarea
                rows={4}
                required
                placeholder="Enter feedback in Hindi, Marathi, Portuguese, Zulu, Bengali, English..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full p-3 bg-[#1A1C24] border border-white/[0.08] rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-white/[0.16] font-sans leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Language:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#1A1C24] border border-white/[0.08] text-slate-100 text-xs rounded-lg p-2.5 focus:outline-none cursor-pointer"
                >
                  <option className="bg-[#1A1C24] text-slate-100 text-xs py-1" value="hi">Hindi (hi)</option>
                  <option className="bg-[#1A1C24] text-slate-100 text-xs py-1" value="mr">Marathi (mr)</option>
                  <option className="bg-[#1A1C24] text-slate-100 text-xs py-1" value="pt">Portuguese (pt)</option>
                  <option className="bg-[#1A1C24] text-slate-100 text-xs py-1" value="zu">Zulu (zu)</option>
                  <option className="bg-[#1A1C24] text-slate-100 text-xs py-1" value="bn">Bengali (bn)</option>
                  <option className="bg-[#1A1C24] text-slate-100 text-xs py-1" value="en">English (en)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Channel Source:</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-[#1A1C24] border border-white/[0.08] text-slate-100 text-xs rounded-lg p-2.5 focus:outline-none cursor-pointer"
                >
                  <option className="bg-[#1A1C24] text-slate-100 text-xs py-1" value="voice">Voice Call</option>
                  <option className="bg-[#1A1C24] text-slate-100 text-xs py-1" value="text">SMS Text</option>
                  <option className="bg-[#1A1C24] text-slate-100 text-xs py-1" value="whatsapp">WhatsApp</option>
                  <option className="bg-[#1A1C24] text-slate-100 text-xs py-1" value="web">Web Portal</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400">Target Region:</label>
                  <button
                    type="button"
                    onClick={() => handleOpenRegionDetails(regionId)}
                    className="text-[11px] font-mono text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <select
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                  className="w-full bg-[#1A1C24] border border-white/[0.08] text-slate-100 text-xs rounded-lg p-2.5 focus:outline-none cursor-pointer"
                >
                  {regions.map((r) => (
                    <option className="bg-[#1A1C24] text-slate-100 text-xs py-1" key={r.id} value={r.id}>
                      {r.district_city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition disabled:opacity-50 cursor-pointer shadow-sm"
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
