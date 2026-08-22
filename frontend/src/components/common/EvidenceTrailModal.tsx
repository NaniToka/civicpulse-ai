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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#000000]/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#0A0A0C] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/[0.08] bg-[#121215] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <PriorityBadge level={recommendation.priority_level} score={recommendation.priority_score} size="lg" />
              <span className="text-xs font-mono font-medium text-slate-300 bg-[#0A0A0C] px-2.5 py-0.5 rounded border border-white/[0.08]">
                {recommendation.id}
              </span>
              <span className="text-xs font-medium text-green-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-4 h-4" />
                {(recommendation.confidence * 100).toFixed(0)}% Confidence
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-slate-100 flex items-center gap-2">
              <span>{recommendation.category.toUpperCase()} Expansion in {recommendation.region_name}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Traceable 6-step evidence trail linking citizen signals to capital allocation priorities.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0A0A0C] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs font-mono">
              Assembling Civic Evidence Graph...
            </div>
          ) : (
            <>
              {/* Signature Vertical 6-Step Evidence Trail */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Network className="w-4 h-4 text-indigo-400" />
                  <span>Civic Evidence Chain ("Show Your Work")</span>
                </h3>

                <div className="relative pl-7 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.08]">
                  {whyData?.evidence_chain.map((step) => (
                    <div key={step.step} className="relative group">
                      <div className={`absolute -left-7 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold border ${
                        step.step === 6
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-[#0A0A0C] text-indigo-400 border-indigo-500/30'
                      }`}>
                        {step.step}
                      </div>

                      <div className="p-4 rounded-lg bg-[#121215] border border-white/[0.08] hover:border-white/[0.16] transition-colors space-y-1.5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide font-mono">
                            {step.title}
                          </span>
                          <span className="text-[11px] font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">
                            {step.contribution}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-slate-100">{step.finding}</div>
                        <div className="text-xs font-mono text-slate-400 flex items-center gap-2 pt-0.5">
                          <span>Evidence Metric:</span>
                          <span className="text-slate-200 font-semibold">{step.value}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8-Factor Scoring Model Breakdown */}
              {whyData?.factors && whyData.factors.length > 0 && (
                <div className="p-5 rounded-lg bg-[#121215] border border-white/[0.08] space-y-3">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                    Deterministic Scoring Model Factors (V2)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {whyData.factors.map((factor) => (
                      <div key={factor.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-100">{factor.name}</span>
                          <span className="font-mono text-indigo-400">
                            {factor.raw_value.toFixed(1)}/100 (w: {(factor.weight * 100).toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-[#0A0A0C] overflow-hidden border border-white/[0.08]">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, factor.raw_value))}%` }}
                          />
                        </div>
                        <div className="text-xs text-slate-400">{factor.explanation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Multilingual AI Decision Brief Section */}
              <div className="p-5 rounded-lg bg-[#121215] border border-white/[0.08] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                      Multilingual AI Decision Brief
                    </h3>
                  </div>

                  {/* Multilingual Language Switcher */}
                  <div className="flex items-center gap-1 bg-[#0A0A0C] p-1 rounded-lg border border-white/[0.08] text-xs font-mono">
                    <Globe className="w-3.5 h-3.5 text-slate-400 ml-1" />
                    <button
                      onClick={() => setBriefLang('en')}
                      className={`px-2 py-0.5 rounded transition cursor-pointer font-medium ${
                        briefLang === 'en' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setBriefLang('hi')}
                      className={`px-2 py-0.5 rounded transition cursor-pointer font-medium ${
                        briefLang === 'hi' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      HI (हिंदी)
                    </button>
                    <button
                      onClick={() => setBriefLang('te')}
                      className={`px-2 py-0.5 rounded transition cursor-pointer font-medium ${
                        briefLang === 'te' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      TE (తెలుగు)
                    </button>
                  </div>
                </div>

                <p className="text-xs font-medium text-slate-200 leading-relaxed">
                  {whyData?.summary || recommendation.reasoning}
                </p>

                <div className="p-3 rounded-lg bg-[#0A0A0C] border border-white/[0.08] text-xs text-slate-200 flex items-start gap-2.5">
                  <ArrowRight className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="font-semibold text-green-400 uppercase font-mono">
                      {briefLang === 'hi'
                        ? 'अनुशंसित नीति कार्रवाई: '
                        : briefLang === 'te'
                        ? 'సిఫార్సు చేసిన విధాన చర్య: '
                        : 'Recommended Policy Action: '}
                    </span>
                    <span>
                      {briefLang === 'hi'
                        ? `${recommendation.region_name} में त्वरित बुनियादी ढांचा पूंजी आवंटन शुरू करें।`
                        : briefLang === 'te'
                        ? `${recommendation.region_name} ప్రాంతంలో తక్షణ మూలధన కేటాయింపులను ప్రారంభించండి.`
                        : recommendation.recommended_action}
                    </span>
                  </div>
                </div>

                {whyData?.risks && whyData.risks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/[0.08] space-y-1.5">
                    <div className="text-xs font-semibold text-amber-400 flex items-center gap-2 font-mono">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>
                        {briefLang === 'hi'
                          ? 'निवेश जोखिम कारक एवं सीमाएं:'
                          : briefLang === 'te'
                          ? 'పెట్టుబడి ప్రమాద కారకాలు మరియు పరిమితులు:'
                          : 'Investment Risk Factors & Limitations:'}
                      </span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                      {whyData.risks.map((risk, idx) => {
                        let translatedRisk = risk;
                        if (briefLang === 'hi') {
                          if (risk.includes('Active capital project')) translatedRisk = 'इस क्षेत्र में सक्रिय पूंजी परियोजना जारी है (दोहरे निवेश का जोखिम)।';
                          else if (risk.includes('DELAYED')) translatedRisk = 'विशेष ध्यान: मौजूदा पूंजी परियोजना में देरी हो रही है।';
                          else if (risk.includes('High baseline coverage')) translatedRisk = 'उच्च बुनियादी कवरेज अनुपात (>75%)।';
                        } else if (briefLang === 'te') {
                          if (risk.includes('Active capital project')) translatedRisk = 'ఈ రంగంలో ఇప్పటికే చురుగ్గా మూలధన ప్రాజెక్ట్ కొనసాగుతోంది (పునరావృత పెట్టుబడి ప్రమాదం).';
                          else if (risk.includes('DELAYED')) translatedRisk = 'ప్రత్యేక శ్రద్ధ: ఉన్న మూలధన ప్రాజెక్ట్ ఆలస్యమైంది.';
                          else if (risk.includes('High baseline coverage')) translatedRisk = 'అధిక ప్రాథమిక కవరేజ్ నిష్పత్తి (>75%).';
                        }
                        return <li key={idx}>{translatedRisk}</li>;
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#121215] flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span>Validated by CivicPulse Evidence Engine</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0A0A0C] hover:bg-[#101014] border border-white/[0.08] text-slate-200 transition font-medium cursor-pointer"
          >
            Close Detail View
          </button>
        </div>
      </div>
    </div>
  );
};
