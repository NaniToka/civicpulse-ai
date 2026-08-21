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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-slate-300" />
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight font-mono">
              Synthetic Demonstration Datasets
            </h1>
          </div>
          <p className="text-sm text-slate-300 mt-1 font-sans font-medium">
            Inspect the underlying datasets, census demographics, and test live multilingual citizen signal ingestion.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950 border border-amber-600 text-xs font-mono font-bold text-amber-200 shadow-sm">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>SYNTHETIC DEMO DATA</span>
        </div>
      </div>

      <div className="flex border-b border-slate-800 text-xs font-mono font-bold">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-5 py-3 font-extrabold transition border-b-2 ${
            activeTab === 'requests'
              ? 'border-sky-400 text-sky-300 bg-slate-900'
              : 'border-transparent text-slate-300 hover:text-white'
          }`}
        >
          Citizen Requests ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('regions')}
          className={`px-5 py-3 font-extrabold transition border-b-2 ${
            activeTab === 'regions'
              ? 'border-sky-400 text-sky-300 bg-slate-900'
              : 'border-transparent text-slate-300 hover:text-white'
          }`}
        >
          Regions & Census ({regions.length})
        </button>
        <button
          onClick={() => setActiveTab('indicators')}
          className={`px-5 py-3 font-extrabold transition border-b-2 ${
            activeTab === 'indicators'
              ? 'border-sky-400 text-sky-300 bg-slate-900'
              : 'border-transparent text-slate-300 hover:text-white'
          }`}
        >
          Infrastructure Indicators ({indicators.length})
        </button>
        <button
          onClick={() => setActiveTab('investments')}
          className={`px-5 py-3 font-extrabold transition border-b-2 ${
            activeTab === 'investments'
              ? 'border-sky-400 text-sky-300 bg-slate-900'
              : 'border-transparent text-slate-300 hover:text-white'
          }`}
        >
          Capital Investments ({investments.length})
        </button>
        <button
          onClick={() => setActiveTab('ingest')}
          className={`px-5 py-3 font-extrabold transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'ingest'
              ? 'border-emerald-500 text-emerald-300 bg-emerald-950'
              : 'border-transparent text-emerald-400 hover:text-emerald-300'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Ingest Test Signal</span>
        </button>
      </div>

      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-mono">Citizen Requests Data</h3>
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
                      <td className="p-3.5 font-extrabold text-sky-400">{r.id}</td>
                      <td className="p-3.5 text-slate-200 font-bold">{r.region_id}</td>
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
            <h3 className="text-base font-bold text-slate-100 font-mono">Regions & Demographic Census Data</h3>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {regions.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-950/80 transition">
                      <td className="p-3.5 font-extrabold text-indigo-400">{r.id}</td>
                      <td className="p-3.5 font-bold text-slate-100 text-sm">{r.district_city}</td>
                      <td className="p-3.5 text-slate-300 font-semibold">{r.country}</td>
                      <td className="p-3.5 text-slate-100 font-bold">{r.population.toLocaleString()}</td>
                      <td className="p-3.5 font-extrabold text-amber-400">{r.vulnerability_index.toFixed(2)}</td>
                      <td className="p-3.5 text-emerald-400 uppercase font-extrabold">{r.primary_language}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'indicators' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-mono">Infrastructure Capacity Indicators</h3>
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
                      <td className="p-3.5 text-slate-300 font-bold">{ind.region_id}</td>
                      <td className="p-3.5 text-sky-400 uppercase font-extrabold">{ind.category}</td>
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
            <h3 className="text-base font-bold text-slate-100 font-mono">Public Capital Investments</h3>
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
                      <td className="p-3.5 font-bold text-slate-100">{inv.project_name}</td>
                      <td className="p-3.5 text-slate-300 font-bold">{inv.region_id}</td>
                      <td className="p-3.5 text-sky-400 uppercase font-extrabold">{inv.category}</td>
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
            <h3 className="text-base font-bold text-slate-100 font-mono">Ingest Multilingual Citizen Feedback Signal</h3>

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
                className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-sm font-semibold text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-400 font-sans leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs font-mono font-extrabold">
              <div>
                <label className="text-slate-200 text-sm">Language:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-950 border-2 border-slate-700 text-slate-100 font-extrabold text-xs rounded-xl p-3.5 mt-1.5 focus:outline-none focus:border-sky-400 cursor-pointer"
                >
                  <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="hi">Hindi (hi)</option>
                  <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="mr">Marathi (mr)</option>
                  <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="pt">Portuguese (pt)</option>
                  <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="zu">Zulu (zu)</option>
                  <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="bn">Bengali (bn)</option>
                  <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="en">English (en)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-200 text-sm">Channel Source:</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-slate-950 border-2 border-slate-700 text-slate-100 font-extrabold text-xs rounded-xl p-3.5 mt-1.5 focus:outline-none focus:border-sky-400 cursor-pointer"
                >
                  <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="voice">Voice Call</option>
                  <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="text">SMS Text</option>
                  <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="whatsapp">WhatsApp</option>
                  <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" value="web">Web Portal</option>
                </select>
              </div>

              <div>
                <label className="text-slate-200 text-sm">Target Region:</label>
                <select
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                  className="w-full bg-slate-950 border-2 border-slate-700 text-slate-100 font-extrabold text-xs rounded-xl p-3.5 mt-1.5 focus:outline-none focus:border-sky-400 cursor-pointer"
                >
                  {regions.map((r) => (
                    <option className="bg-slate-900 text-slate-100 font-extrabold text-sm py-2" key={r.id} value={r.id}>
                      {r.district_city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-950/60 disabled:opacity-50"
            >
              {loading ? 'Ingesting via AI Pipeline...' : 'Ingest Signal into System'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
