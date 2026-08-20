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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-civic-100 tracking-tight">Multilingual Citizen Feedback Stream</h2>
        <p className="text-xs text-civic-400 mt-1">
          Aggregated feedback entries from voice, WhatsApp, USSD, and web across Hindi, Portuguese, Zulu, Marathi, and English.
        </p>
      </div>

      {/* Ingest Form */}
      <Card title="Ingest Multilingual Feedback Entry" subtitle="Test Gemini NLP translation & entity extraction">
        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-civic-400 mb-1 font-medium">Channel / Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-civic-950 border border-civic-800 rounded px-3 py-2 text-civic-100 focus:outline-none focus:border-accent-blue"
              >
                <option value="WhatsApp Voice Note">WhatsApp Voice Note</option>
                <option value="IVR Call">IVR Voice Call</option>
                <option value="USSD Gateway">USSD Gateway</option>
                <option value="Web Intake">Web Portal Intake</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-civic-400 text-xs mb-1 font-medium">
              Citizen Input Text (supports Hindi, Portuguese, Zulu, Tamil, English, etc.)
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. पानी की पाइपलाइन 3 हफ्तों से टूटी है 5000 घर प्रभावित हैं..."
              className="w-full bg-civic-950 border border-civic-800 rounded p-3 text-sm text-civic-100 focus:outline-none focus:border-accent-blue"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-civic-950 font-semibold rounded text-xs hover:bg-sky-400 disabled:opacity-50 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Ingesting & Analyzing...' : 'Analyze & Ingest Request'}</span>
          </button>
        </form>
      </Card>

      {/* Stream List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-civic-200">Recent Citizen Demand Log ({requests.length} entries)</h3>
        {requests.map((req) => (
          <div key={req.id} className="p-4 bg-civic-900 border border-civic-800 rounded-lg space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Badge variant="accent">{req.request_category}</Badge>
                <span className="text-civic-400 font-mono">Channel: {req.source} ({req.language.toUpperCase()})</span>
              </div>
              <Badge variant={req.extracted_entities.severity === 'CRITICAL' ? 'danger' : 'warning'}>
                {req.extracted_entities.severity} SEVERITY
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-2.5 bg-civic-950/60 rounded border border-civic-800/80">
                <span className="text-civic-400 font-medium block">Original Text:</span>
                <span className="text-civic-300 italic">"{req.original_text}"</span>
              </div>
              <div className="p-2.5 bg-civic-950/60 rounded border border-civic-800/80">
                <span className="text-civic-400 font-medium block">English Translation:</span>
                <span className="text-civic-100 font-medium">"{req.translated_text}"</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-civic-400 pt-1">
              <span>Location: {req.extracted_entities.location || 'Regional Hotspot'}</span>
              <span>Impacted Residents: ~{req.extracted_entities.impacted_count || 100}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
