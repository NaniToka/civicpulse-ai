import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Alert } from '../components/common/Alert';
import { CitizenRequest } from '../types';
import { api } from '../services/api';

interface CitizenFeedbackFeedProps {
  requests: CitizenRequest[];
  onNewRequestAdded: (req: CitizenRequest) => void;
}

export const CitizenFeedbackFeed: React.FC<CitizenFeedbackFeedProps> = ({
  requests,
  onNewRequestAdded,
}) => {
  const [inputText, setInputText] = useState('');
  const [source, setSource] = useState('Web Intake');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setSuccessMessage(null);
    try {
      const newReq = await api.ingestCitizenRequest({
        raw_text: inputText,
        source: source,
        language: 'auto',
      });
      onNewRequestAdded(newReq);
      setInputText('');
      setSuccessMessage(`Citizen feedback ingested! Categorized as '${newReq.request_category}' with ${newReq.extracted_entities.severity} severity.`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-slate-950 font-bold">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">Multilingual Citizen Feedback Stream</h2>
        <p className="text-xs sm:text-sm text-slate-800 font-bold mt-1">
          Aggregated feedback entries from voice, WhatsApp, USSD, and web across Hindi, Portuguese, Zulu, Marathi, and English.
        </p>
      </div>

      {/* Ingest Form */}
      <Card title="Ingest Multilingual Feedback Entry" subtitle="Test Gemini NLP translation & entity extraction">
        <form onSubmit={handleSubmit} className="space-y-4 text-slate-950 font-bold">
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-bold">
            <div>
              <label className="block text-slate-800 mb-1 font-extrabold">Channel / Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-950 focus:outline-none cursor-pointer font-bold"
              >
                <option value="WhatsApp Voice Note">WhatsApp Voice Note</option>
                <option value="IVR Call">IVR Voice Call</option>
                <option value="USSD Gateway">USSD Gateway</option>
                <option value="Web Intake">Web Portal Intake</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-800 text-xs sm:text-sm mb-1 font-extrabold">
              Citizen Input Text (supports Hindi, Portuguese, Zulu, Tamil, English, etc.)
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. पानी की पाइपलाइन 3 हफ्तों से टूटी है 5000 घर प्रभावित हैं..."
              className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-950 placeholder:text-slate-500 focus:outline-none font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs sm:text-sm disabled:opacity-50 transition-colors cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Ingesting & Analyzing...' : 'Analyze & Ingest Request'}</span>
          </button>
        </form>
      </Card>

      {/* Stream List */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-950">Recent Citizen Demand Log ({requests.length} entries)</h3>
        {requests.map((req) => (
          <div key={req.id} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-sm text-slate-950 font-bold">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-bold">
              <div className="flex items-center gap-2">
                <Badge variant="accent">{req.request_category}</Badge>
                <span className="text-slate-800 font-mono font-extrabold">Channel: {req.source} ({req.language.toUpperCase()})</span>
              </div>
              <Badge variant={req.extracted_entities.severity === 'CRITICAL' ? 'danger' : 'warning'}>
                {req.extracted_entities.severity} SEVERITY
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm pt-1 font-bold">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-800 font-extrabold block">Original Text:</span>
                <span className="text-slate-950 italic">"{req.original_text}"</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-800 font-extrabold block">English Translation:</span>
                <span className="text-slate-950 font-extrabold">"{req.translated_text}"</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-800 pt-1 font-mono font-extrabold">
              <span>Location: {req.extracted_entities.location || 'Regional Hotspot'}</span>
              <span>Impacted Residents: ~{req.extracted_entities.impacted_count || 100}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
