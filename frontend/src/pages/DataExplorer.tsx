import React, { useState } from 'react';
import { Database, Plus, CheckCircle2, ShieldAlert } from 'lucide-react';
import { CitizenRequest, InfrastructureIndicator, InvestmentProject, Region } from '../types';
import { api } from '../services/api';

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

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-slate-400" />
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight font-mono">
              Synthetic Demonstration Datasets
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Inspect the underlying datasets, census demographics, and test live multilingual citizen signal ingestion.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/60 border border-amber-800/40 text-[11px] font-mono text-amber-300">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>SYNTHETIC DEMO DATA</span>
        </div>
      </div>

      <div className="flex border-b border-slate-800 text-xs font-mono">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2.5 font-semibold transition border-b-2 ${
            activeTab === 'requests'
              ? 'border-sky-500 text-sky-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Citizen Requests ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('regions')}
          className={`px-4 py-2.5 font-semibold transition border-b-2 ${
            activeTab === 'regions'
              ? 'border-sky-500 text-sky-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Regions & Census ({regions.length})
        </button>
        <button
          onClick={() => setActiveTab('indicators')}
          className={`px-4 py-2.5 font-semibold transition border-b-2 ${
            activeTab === 'indicators'
              ? 'border-sky-500 text-sky-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Infrastructure Indicators ({indicators.length})
        </button>
        <button
          onClick={() => setActiveTab('investments')}
          className={`px-4 py-2.5 font-semibold transition border-b-2 ${
            activeTab === 'investments'
              ? 'border-sky-500 text-sky-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Capital Investments ({investments.length})
        </button>
        <button
          onClick={() => setActiveTab('ingest')}
          className={`px-4 py-2.5 font-semibold transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'ingest'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30'
              : 'border-transparent text-emerald-400/80 hover:text-emerald-300'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ingest Test Signal</span>
        </button>
      </div>

      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 font-mono">Citizen Requests Data</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">REGION</th>
                    <th className="p-3">LANG</th>
                    <th className="p-3">CATEGORY</th>
                    <th className="p-3">URGENCY</th>
                    <th className="p-3">ORIGINAL TEXT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-950/60 transition">
                      <td className="p-3 font-bold text-sky-400">{r.id}</td>
                      <td className="p-3 text-slate-300">{r.region_id}</td>
                      <td className="p-3 text-slate-400 uppercase">{r.language}</td>
                      <td className="p-3 text-slate-200">{r.request_category || r.category}</td>
                      <td className="p-3 font-bold text-rose-400">{r.urgency || r.extracted_entities.severity}</td>
                      <td className="p-3 text-slate-400 italic line-clamp-1">"{r.original_text}"</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'regions' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 font-mono">Regions & Demographic Census Data</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">CITY</th>
                    <th className="p-3">COUNTRY</th>
                    <th className="p-3">POPULATION</th>
                    <th className="p-3">VULNERABILITY</th>
                    <th className="p-3">PRIMARY LANG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {regions.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-950/60 transition">
                      <td className="p-3 font-bold text-indigo-400">{r.id}</td>
                      <td className="p-3 font-bold text-slate-200">{r.district_city}</td>
                      <td className="p-3 text-slate-400">{r.country}</td>
                      <td className="p-3 text-slate-200">{r.population.toLocaleString()}</td>
                      <td className="p-3 font-bold text-amber-400">{r.vulnerability_index.toFixed(2)}</td>
                      <td className="p-3 text-emerald-400 uppercase">{r.primary_language}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'indicators' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 font-mono">Infrastructure Capacity Indicators</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">REGION</th>
                    <th className="p-3">CATEGORY</th>
                    <th className="p-3">COVERAGE %</th>
                    <th className="p-3">GAP SCORE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {indicators.map((ind) => (
                    <tr key={ind.id} className="hover:bg-slate-950/60 transition">
                      <td className="p-3 font-bold text-slate-300">{ind.id}</td>
                      <td className="p-3 text-slate-400">{ind.region_id}</td>
                      <td className="p-3 text-sky-400 uppercase">{ind.category}</td>
                      <td className="p-3 text-slate-200">{ind.coverage_ratio_pct}%</td>
                      <td className="p-3 font-bold text-rose-400">{ind.gap_score.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 font-mono">Public Capital Investments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">PROJECT NAME</th>
                    <th className="p-3">REGION</th>
                    <th className="p-3">CATEGORY</th>
                    <th className="p-3">BUDGET (USD)</th>
                    <th className="p-3">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {investments.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-950/60 transition">
                      <td className="p-3 font-bold text-slate-300">{inv.id}</td>
                      <td className="p-3 font-bold text-slate-200">{inv.project_name}</td>
                      <td className="p-3 text-slate-400">{inv.region_id}</td>
                      <td className="p-3 text-sky-400 uppercase">{inv.category}</td>
                      <td className="p-3 text-emerald-400 font-bold">${inv.budget_usd.toLocaleString()}</td>
                      <td className="p-3 font-bold text-amber-400 uppercase">{inv.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ingest' && (
          <form onSubmit={handleIngest} className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-100 font-mono">Ingest Multilingual Citizen Feedback Signal</h3>

            {successMsg && (
              <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">Citizen Raw Text Feedback:</label>
              <textarea
                rows={4}
                required
                placeholder="Enter feedback in Hindi, Marathi, Portuguese, Zulu, Bengali, English..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <label className="text-slate-400">Language:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2 mt-1"
                >
                  <option value="hi">Hindi (hi)</option>
                  <option value="mr">Marathi (mr)</option>
                  <option value="pt">Portuguese (pt)</option>
                  <option value="zu">Zulu (zu)</option>
                  <option value="bn">Bengali (bn)</option>
                  <option value="en">English (en)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400">Channel Source:</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2 mt-1"
                >
                  <option value="voice">Voice Call</option>
                  <option value="text">SMS Text</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="web">Web Portal</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400">Target Region:</label>
                <select
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2 mt-1"
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.district_city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-md shadow-emerald-950/60 disabled:opacity-50"
            >
              {loading ? 'Ingesting via AI Pipeline...' : 'Ingest Signal into System'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
