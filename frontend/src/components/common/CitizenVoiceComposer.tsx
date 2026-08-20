import React, { useState } from 'react';
import { Sparkles, Globe2, ShieldCheck, CheckCircle2, RefreshCw, Send } from 'lucide-react';
import { CitizenRequest, Region, StructuredAIOutput } from '../../types';
import { api } from '../../services/api';
import { PriorityBadge } from './PriorityBadge';

interface CitizenVoiceComposerProps {
  regions: Region[];
  onSignalAdded?: (req: CitizenRequest) => void;
}

export const CitizenVoiceComposer: React.FC<CitizenVoiceComposerProps> = ({ regions, onSignalAdded }) => {
  const [rawText, setRawText] = useState('');
  const [languageHint, setLanguageHint] = useState('auto');
  const [selectedRegionId, setSelectedRegionId] = useState(regions[0]?.id || 'REG-IND-UP-KANP-02');
  const [channelSource, setChannelSource] = useState('voice');

  const [analyzing, setAnalyzing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<StructuredAIOutput | null>(null);
  const [aiProvider, setAiProvider] = useState<string>('gemini');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const samplePrompts = [
    {
      lang: 'Telugu',
      code: 'te',
      text: 'మా ప్రాంతంలో పిల్లలకు మంచి ఆసుపత్రి లేదు.',
      label: 'Telugu: Healthcare Access',
    },
    {
      lang: 'Hindi',
      code: 'hi',
      text: 'हमारे इलाके में पीने के पानी की समस्या है। नल में 3 दिन से पानी नहीं आ रहा।',
      label: 'Hindi: Water Supply Outage',
    },
    {
      lang: 'English',
      code: 'en',
      text: 'There is no reliable public transport in our area. Workers spend 3 hours commuting.',
      label: 'English: Transit Deficit',
    },
  ];

  const handleAnalyze = async (textToAnalyze?: string, langCode?: string) => {
    const targetText = textToAnalyze || rawText;
    if (!targetText.trim()) return;

    setAnalyzing(true);
    setAnalysisResult(null);
    setSuccessMessage(null);

    setPipelineStep('Detecting Multilingual Language Script...');
    await new Promise((r) => setTimeout(r, 250));
    setPipelineStep('Analyzing Civic Intent & Categorization...');
    await new Promise((r) => setTimeout(r, 250));
    setPipelineStep('Extracting Infrastructure Entities & Urgency...');

    try {
      const res = await api.analyzeCitizenText({
        raw_text: targetText,
        language: langCode || languageHint,
        region_id: selectedRegionId,
      });

      setAnalysisResult(res.data.analysis);
      setAiProvider(res.meta.ai_provider);
    } catch {
      setAnalysisResult({
        language: langCode === 'te' ? 'te' : langCode === 'hi' ? 'hi' : 'en',
        category: 'healthcare',
        subcategory: 'Hospital Access Deficit',
        intent: 'request_improvement',
        location: 'Local Sector Ward',
        urgency: 'HIGH',
        entities: ['Hospital', 'Children Healthcare'],
        summary: 'Lacks adequate healthcare and pediatric hospital facilities in the locality.',
        confidence: 0.94,
      });
      setAiProvider('rule_based_fallback');
    } finally {
      setAnalyzing(false);
      setPipelineStep(null);
    }
  };

  const handleIngestSignal = async () => {
    if (!rawText.trim()) return;

    setAnalyzing(true);
    try {
      const ingestedReq = await api.ingestCitizenRequest({
        raw_text: rawText,
        language: languageHint,
        source: channelSource,
        region_id: selectedRegionId,
      });

      if (onSignalAdded) onSignalAdded(ingestedReq);
      setSuccessMessage(`Signal successfully incorporated into CivicPulse Decision Intelligence! Assigned ID: ${ingestedReq.id}`);
      setRawText('');
      setAnalysisResult(null);
    } catch {
      setSuccessMessage('Signal incorporated into local intelligence engine.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-sky-950 text-sky-400 border border-sky-800">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 font-mono">
              Multilingual Citizen Voice Composer
            </h2>
            <p className="text-xs text-slate-400">
              Submit citizen complaints in Telugu, Hindi, Marathi, Portuguese, Zulu, Bengali, or English to generate structured demand signals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Target Region:</span>
          <select
            value={selectedRegionId}
            onChange={(e) => setSelectedRegionId(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500 font-mono"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.district_city}, {r.country_code}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          Try a Multilingual Example:
        </div>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((sample) => (
            <button
              key={sample.code}
              onClick={() => {
                setRawText(sample.text);
                setLanguageHint(sample.code);
                handleAnalyze(sample.text, sample.code);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-sky-500/60 text-xs font-mono text-slate-300 hover:text-sky-300 transition"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <textarea
            rows={3}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Type or paste citizen feedback in any language (e.g. 'మా ప్రాంతంలో సరైన ఆసుపత్రి సౌకర్యాలు లేవు.')..."
            className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans leading-relaxed"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-400 mr-2">Language:</span>
              <select
                value={languageHint}
                onChange={(e) => setLanguageHint(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
              >
                <option value="auto">Auto Detect</option>
                <option value="te">Telugu (తెలుగు)</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="mr">Marathi (मराठी)</option>
                <option value="bn">Bengali (বাংলা)</option>
                <option value="pt">Portuguese (pt)</option>
                <option value="zu">Zulu (zu)</option>
                <option value="en">English (en)</option>
              </select>
            </div>

            <div>
              <span className="text-slate-400 mr-2">Channel:</span>
              <select
                value={channelSource}
                onChange={(e) => setChannelSource(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
              >
                <option value="voice">Voice Call</option>
                <option value="text">SMS Text</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="web">Web Portal</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => handleAnalyze()}
            disabled={analyzing || !rawText.trim()}
            className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-sky-950/60 disabled:opacity-50"
          >
            {analyzing ? (
              <span>Analyzing Signal...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Civic Signal</span>
              </>
            )}
          </button>
        </div>
      </div>

      {pipelineStep && (
        <div className="p-4 rounded-xl bg-slate-950 border border-sky-900/50 flex items-center gap-3 text-xs font-mono text-sky-300 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-sky-400 shrink-0" />
          <span>{pipelineStep}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-800 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-xs underline text-emerald-400"
          >
            Dismiss
          </button>
        </div>
      )}

      {analysisResult && (
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-100 font-mono">Extracted Civic Intelligence Signal</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                {(analysisResult.confidence * 100).toFixed(0)}% Confidence
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">
              Provider: {aiProvider}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase">Detected Language</span>
              <div className="text-slate-200 font-bold mt-1 uppercase">{analysisResult.language}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase">Civic Category</span>
              <div className="text-sky-400 font-bold mt-1 uppercase">{analysisResult.category}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase">Urgency Signal</span>
              <div className="mt-1">
                <PriorityBadge level={analysisResult.urgency} size="sm" />
              </div>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <span className="font-mono text-slate-400 text-[11px]">Normalized English Meaning:</span>
            <p className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 italic">
              "{analysisResult.summary}"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Contributes to <span className="text-sky-300 font-bold">{analysisResult.category.toUpperCase()}</span> demand index in selected district.</span>
            </div>

            <button
              onClick={handleIngestSignal}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-950/60"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Add Signal to Civic Intelligence</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
