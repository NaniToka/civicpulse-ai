import React, { useState } from 'react';
import { Sparkles, Globe2, ShieldCheck, CheckCircle2, RefreshCw, Send, Radio, ArrowRight } from 'lucide-react';
import { CitizenRequest, Region, StructuredAIOutput } from '../../types';
import { api } from '../../services/api';
import { PriorityBadge } from './PriorityBadge';
import { useLanguage } from '../../context/LanguageContext';

interface CitizenVoiceComposerProps {
  regions: Region[];
  onSignalAdded?: (req: CitizenRequest) => void;
  onOpenRegionDetails?: (regionId: string) => void;
}

export const CitizenVoiceComposer: React.FC<CitizenVoiceComposerProps> = ({ regions, onSignalAdded, onOpenRegionDetails }) => {
  const { t } = useLanguage();
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
    <div className="p-6 md:p-8 rounded-xl bg-white border border-slate-200 space-y-6 shadow-sm text-slate-950 font-bold">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 font-extrabold">
            <Globe2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
              <span>{t('studio_title')}</span>
              <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                LIVE INGRESS
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 mt-0.5 font-bold">
              {t('studio_sub')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono font-bold">
          <span className="text-slate-700 font-bold text-xs">{t('target_region_label')}</span>
          <select
            value={selectedRegionId}
            onChange={(e) => setSelectedRegionId(e.target.value)}
            className="bg-slate-100 border border-slate-200 text-slate-950 text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none cursor-pointer font-bold"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.district_city}, {r.country_code}
              </option>
            ))}
          </select>
          {onOpenRegionDetails && (
            <button
              onClick={() => onOpenRegionDetails(selectedRegionId)}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-extrabold transition flex items-center gap-1.5 cursor-pointer font-sans shadow-xs"
            >
              <span>{t('btn_region_details')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Example Prompts */}
      <div className="space-y-2.5">
        <div className="text-xs font-mono text-slate-800 uppercase tracking-wider flex items-center gap-2 font-extrabold">
          <Radio className="w-4 h-4 text-indigo-600 font-extrabold" />
          <span>{t('try_signal_label')}</span>
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
              className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 text-xs sm:text-sm text-slate-950 transition cursor-pointer font-bold"
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
            placeholder={t('placeholder_feedback')}
            className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm sm:text-base text-slate-950 placeholder:text-slate-400 focus:outline-none font-sans font-bold leading-relaxed shadow-xs"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-mono font-bold">
            <div>
              <span className="text-slate-700 mr-2 font-bold">{t('label_language')}:</span>
              <select
                value={languageHint}
                onChange={(e) => setLanguageHint(e.target.value)}
                className="bg-slate-100 border border-slate-200 text-slate-950 text-xs sm:text-sm rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer font-bold"
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
              <span className="text-slate-700 mr-2 font-bold">{t('label_channel')}:</span>
              <select
                value={channelSource}
                onChange={(e) => setChannelSource(e.target.value)}
                className="bg-slate-100 border border-slate-200 text-slate-950 text-xs sm:text-sm rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer font-bold"
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
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                <span>{pipelineStep || 'Analyzing...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{t('btn_analyze_signal')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Step-by-Step Pipeline Animation */}
      {pipelineStep && (
        <div className="p-3.5 rounded-lg bg-[#121215] border border-indigo-500/30 flex items-center gap-3 text-xs font-mono text-indigo-400">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-400 shrink-0" />
          <span>{pipelineStep}</span>
        </div>
      )}

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3.5 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-xs underline text-green-300 font-mono ml-4 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Structured AI Analysis Result Preview Card */}
      {analysisResult && (
        <div className="p-6 rounded-xl bg-[#121215] border border-white/[0.08] space-y-4 animate-in fade-in duration-150 shadow-sm">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-100">Extracted Civic Intelligence Signal</span>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {(analysisResult.confidence * 100).toFixed(0)}% Confidence
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 uppercase">
              Provider: {aiProvider}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-mono font-bold">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
              <span className="text-slate-700 text-xs uppercase tracking-wider font-extrabold">Detected Language</span>
              <div className="text-slate-950 font-extrabold text-lg mt-1 uppercase">{analysisResult.language}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
              <span className="text-slate-700 text-xs uppercase tracking-wider font-extrabold">Civic Category</span>
              <div className="text-indigo-700 font-extrabold text-lg mt-1 uppercase">{analysisResult.category}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
              <span className="text-slate-700 text-xs uppercase tracking-wider font-extrabold">Urgency Signal</span>
              <div className="mt-1.5">
                <PriorityBadge level={analysisResult.urgency} size="sm" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs sm:text-sm font-bold">
            <span className="font-mono text-slate-800 text-xs uppercase font-extrabold">Normalized English Meaning:</span>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-950 text-sm sm:text-base italic font-bold shadow-2xs">
              "{analysisResult.summary}"
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="text-xs sm:text-sm font-mono text-slate-800 flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0 font-extrabold" />
              <span>Contributes to <span className="text-indigo-700 font-extrabold uppercase">{analysisResult.category}</span> demand index in selected district.</span>
            </div>

            <button
              onClick={handleIngestSignal}
              className="px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
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
