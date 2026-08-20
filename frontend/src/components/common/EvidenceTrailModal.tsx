import React, { useEffect, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, Network, ArrowRight, Globe } from 'lucide-react';
import { PriorityRecommendation, WhyThisRecommendation } from '../../types';
import { PriorityBadge } from './PriorityBadge';
import { api } from '../../services/api';

interface EvidenceTrailModalProps {
  recommendation: PriorityRecommendation | null;
  onClose: () => void;
}

export const EvidenceTrailModal: React.FC<EvidenceTrailModalProps> = ({ recommendation, onClose }) => {
  const [whyData, setWhyData] = useState<WhyThisRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [briefLang, setBriefLang] = useState<'en' | 'hi' | 'te'>('en');

  const fetchEvidence = useCallback((recId: string, lang: 'en' | 'hi' | 'te') => {
    setLoading(true);
    api
      .getEvidenceTrail(recId, lang)
      .then((res) => setWhyData(res))
      .catch(() => {
        setWhyData({
          recommendation_id: recId,
          summary: recommendation?.reasoning || 'Recommendation based on aggregated demand signals.',
          overall_confidence: recommendation?.confidence || 0.92,
          evidence_chain: recommendation?.evidence_chain || [],
          factors: recommendation?.explanation_details?.factors || [],
          risks: recommendation?.explanation_details?.risks || [],
        });
      })
      .finally(() => setLoading(false));
  }, [recommendation]);

  useEffect(() => {
    if (!recommendation) return;
    fetchEvidence(recommendation.id, briefLang);
  }, [recommendation, briefLang, fetchEvidence]);

  if (!recommendation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <PriorityBadge level={recommendation.priority_level} score={recommendation.priority_score} size="lg" />
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {recommendation.id}
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                {(recommendation.confidence * 100).toFixed(0)}% Confidence
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>{recommendation.category.toUpperCase()} Expansion in {recommendation.region_name}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Traceable 6-step evidence trail linking citizen signals to capital allocation priorities.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-8">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              Assembling Civic Evidence Graph...
            </div>
          ) : (
            <>
              {/* Signature Vertical 6-Step Evidence Trail */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Network className="w-4 h-4 text-sky-400" />
                  <span>Civic Evidence Chain ("Show Your Work")</span>
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {whyData?.evidence_chain.map((step) => (
                    <div key={step.step} className="relative group">
                      <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border ${
                        step.step === 6
                          ? 'bg-rose-950 text-rose-300 border-rose-600'
                          : 'bg-slate-900 text-sky-400 border-sky-500/60'
                      }`}>
                        {step.step}
                      </div>

                      <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-sky-400 uppercase tracking-wide">
                            {step.title}
                          </span>
                          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                            {step.contribution}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-slate-200">{step.finding}</div>
                        <div className="mt-2 text-xs font-mono text-slate-400 flex items-center gap-2">
                          <span>Evidence Metric:</span>
                          <span className="text-slate-300 font-semibold">{step.value}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8-Factor Scoring Model Breakdown */}
              {whyData?.factors && whyData.factors.length > 0 && (
                <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    Deterministic Scoring Model Factors (V2)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {whyData.factors.map((factor) => (
                      <div key={factor.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300">{factor.name}</span>
                          <span className="font-mono text-slate-400">
                            {factor.raw_value.toFixed(1)}/100 (w: {(factor.weight * 100).toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, factor.raw_value))}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-slate-500 italic">{factor.explanation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Multilingual AI Decision Brief Section */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-900/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                      Multilingual AI Decision Brief
                    </h3>
                  </div>

                  {/* Multilingual Language Switcher */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                    <Globe className="w-3.5 h-3.5 text-slate-400 ml-1" />
                    <button
                      onClick={() => setBriefLang('en')}
                      className={`px-2 py-0.5 rounded transition ${
                        briefLang === 'en' ? 'bg-indigo-900 text-indigo-200 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setBriefLang('hi')}
                      className={`px-2 py-0.5 rounded transition ${
                        briefLang === 'hi' ? 'bg-indigo-900 text-indigo-200 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      HI (हिंदी)
                    </button>
                    <button
                      onClick={() => setBriefLang('te')}
                      className={`px-2 py-0.5 rounded transition ${
                        briefLang === 'te' ? 'bg-indigo-900 text-indigo-200 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      TE (తెలుగు)
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {whyData?.summary || recommendation.reasoning}
                </p>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                  <ArrowRight className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-emerald-400">Recommended Policy Action: </span>
                    <span>{recommendation.recommended_action}</span>
                  </div>
                </div>

                {whyData?.risks && whyData.risks.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-indigo-900/30">
                    <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 mb-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Investment Risk Factors & Limitations:</span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                      {whyData.risks.map((risk, idx) => (
                        <li key={idx}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Validated by CivicPulse Evidence Engine • Synthetic Demo Data</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-200 transition font-medium"
          >
            Close Detail View
          </button>
        </div>
      </div>
    </div>
  );
};
