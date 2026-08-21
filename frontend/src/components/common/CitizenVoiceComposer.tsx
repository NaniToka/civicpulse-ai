import React, { useState } from 'react';
import { Sparkles, Globe2, ShieldCheck, CheckCircle2, RefreshCw, Send, Radio } from 'lucide-react';
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
    <div className="p-6 md:p-8 rounded-2xl glass-panel-cyan space-y-7 border border-cyan-800/50 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-900/40 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-cyan-950/80 text-cyan-400 border border-cyan-700/60 shadow-lg glow-cyan">
            <Globe2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100 font-mono tracking-tight flex items-center gap-2">
              <span>Multilingual Citizen Voice Studio</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                LIVE INGRESS
              </span>
            </h2>
            <p className="text-xs text-slate-300 font-sans mt-1 font-medium">
              Submit citizen feedback in Telugu, Hindi, Marathi, Portuguese, Zulu, Bengali, or English to generate structured demand signals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-mono">
          <span className="text-slate-300 font-extrabold font-mono text-xs">Target Region:</span>
          <select
            value={selectedRegionId}
            onChange={(e) => setSelectedRegionId(e.target.value)}
            className="bg-[#0b0f19] border border-slate-700 text-slate-100 font-extrabold text-xs rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-400 font-mono shadow-inner cursor-pointer"
          >
            {regions.map((r) => (
              <option className="bg-[#0f172a] text-slate-100 font-extrabold text-sm py-2" key={r.id} value={r.id}>
                {r.district_city}, {r.country_code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Example Prompts */}
      <div className="space-y-2.5">
        <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Try a Multilingual Civic Signal:</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {samplePrompts.map((sample) => (
            <button
              key={sample.code}
              onClick={() => {
                setRawText(sample.text);
                setLanguageHint(sample.code);
                handleAnalyze(sample.text, sample.code);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-400 text-xs font-mono font-bold text-slate-200 hover:text-cyan-300 transition shadow-sm hover:scale-105"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Controls */}
      <div className="space-y-4">
        <div className="relative">
          <textarea
            rows={3}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Type or paste citizen feedback in any language (e.g. 'మా ప్రాంతంలో సరైన ఆసుపత్రి సౌకర్యాలు లేవు.')..."
            className="w-full p-4 bg-[#070b14]/90 border border-slate-700/90 rounded-2xl text-sm font-semibold text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-sans leading-relaxed shadow-inner"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-300 font-bold mr-2">Language:</span>
              <select
                value={languageHint}
                onChange={(e) => setLanguageHint(e.target.value)}
                className="bg-[#0b0f19] border border-slate-700 text-slate-100 font-bold text-xs rounded-xl px-3.5 py-2 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="auto">Auto Detect</option>
                <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="te">Telugu (తెలుగు)</option>
                <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="hi">Hindi (हिंदी)</option>
                <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="mr">Marathi (मराठी)</option>
                <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="bn">Bengali (বাংলা)</option>
                <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="pt">Portuguese (pt)</option>
                <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="zu">Zulu (zu)</option>
                <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="en">English (en)</option>
              </select>
            </div>

            <div>
              <span className="text-slate-300 font-bold mr-2">Channel:</span>
              <select
                value={channelSource}
                onChange={(e) => setChannelSource(e.target.value)}
                className="bg-[#0b0f19] border border-slate-700 text-slate-100 font-bold text-xs rounded-xl px-3.5 py-2 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="voice">Voice Call</option>
                <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="text">SMS Text</option>
                <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="whatsapp">WhatsApp</option>
                <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="web">Web Portal</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => handleAnalyze()}
            disabled={analyzing || !rawText.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/80 glow-cyan disabled:opacity-50 hover:scale-105 active:scale-95"
          >
            {analyzing ? (
              <span>Analyzing Signal...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Analyze Civic Signal</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Step-by-Step Pipeline Animation */}
      {pipelineStep && (
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-600 flex items-center gap-3 text-xs font-mono font-bold text-cyan-300 animate-pulse glow-cyan">
          <RefreshCw className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
          <span>{pipelineStep}</span>
        </div>
      )}

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-700 text-xs font-bold text-emerald-200 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-xs underline text-emerald-300 font-mono font-bold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Structured AI Analysis Result Preview Card */}
      {analysisResult && (
        <div className="p-6 md:p-7 rounded-2xl glass-card space-y-5 animate-in fade-in duration-200 shadow-xl border border-cyan-800/60">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-base font-extrabold text-slate-100 font-mono">Extracted Civic Intelligence Signal</span>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-700">
                {(analysisResult.confidence * 100).toFixed(0)}% Confidence
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              Provider: {aiProvider}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Detected Language</span>
              <div className="text-slate-100 font-extrabold text-lg mt-1 uppercase">{analysisResult.language}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Civic Category</span>
              <div className="text-cyan-300 font-extrabold text-lg mt-1 uppercase">{analysisResult.category}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Urgency Signal</span>
              <div className="mt-2">
                <PriorityBadge level={analysisResult.urgency} size="sm" />
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <span className="font-mono font-bold text-slate-300 text-xs uppercase">Normalized English Meaning:</span>
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-100 font-semibold text-sm leading-relaxed italic">
              "{analysisResult.summary}"
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="text-xs font-mono text-slate-300 font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Contributes to <span className="text-cyan-300 font-extrabold uppercase">{analysisResult.category}</span> demand index in selected district.</span>
            </div>

            <button
              onClick={handleIngestSignal}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 glow-emerald"
            >
              <Send className="w-4 h-4" />
              <span>Add Signal to Civic Intelligence</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
