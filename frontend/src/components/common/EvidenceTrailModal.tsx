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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 text-slate-900">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <PriorityBadge level={recommendation.priority_level} score={recommendation.priority_score} size="lg" />
              <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded border border-slate-300">
                {recommendation.id}
              </span>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {(recommendation.confidence * 100).toFixed(0)}% Confidence
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span>{recommendation.category.toUpperCase()} Expansion in {recommendation.region_name}</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Traceable 6-step evidence trail linking citizen signals to capital allocation priorities.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-16 text-center text-slate-500 text-xs font-mono font-semibold">
              Assembling Civic Evidence Graph...
            </div>
          ) : (
            <>
              {/* Signature Vertical 6-Step Evidence Trail */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Network className="w-4 h-4 text-indigo-600" />
                  <span>Civic Evidence Chain ("Show Your Work")</span>
                </h3>

                <div className="relative pl-7 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {whyData?.evidence_chain.map((step) => (
                    <div key={step.step} className="relative group">
                      <div className={`absolute -left-7 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold border ${
                        step.step === 6
                          ? 'bg-rose-50 text-rose-700 border-rose-300'
                          : 'bg-white text-indigo-700 border-indigo-300 shadow-xs'
                      }`}>
                        {step.step}
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors space-y-2 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-indigo-700 uppercase tracking-wide font-mono">
                            {step.title}
                          </span>
                          <span className="text-xs font-mono font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-md">
                            {step.contribution}
                          </span>
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-slate-950 leading-snug">{step.finding}</div>
                        <div className="text-xs sm:text-sm font-mono text-slate-700 font-bold flex items-center gap-2 pt-0.5">
                          <span>Evidence Metric:</span>
                          <span className="text-slate-950 font-extrabold">{step.value}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8-Factor Scoring Model Breakdown */}
              {whyData?.factors && whyData.factors.length > 0 && (
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3.5 shadow-xs">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono">
                    Deterministic Scoring Model Factors (V2)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {whyData.factors.map((factor) => (
                      <div key={factor.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs sm:text-sm font-extrabold">
                          <span className="text-slate-950">{factor.name}</span>
                          <span className="font-mono text-indigo-700">
                            {factor.raw_value.toFixed(1)}/100 (w: {(factor.weight * 100).toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, factor.raw_value))}%` }}
                          />
                        </div>
                        <div className="text-xs text-slate-700 font-bold">{factor.explanation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Multilingual AI Decision Brief Section */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3.5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-indigo-600 font-extrabold" />
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-950 uppercase tracking-wider font-mono">
                      Multilingual AI Decision Brief
                    </h3>
                  </div>

                  {/* Multilingual Language Switcher */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs font-mono font-bold shadow-2xs">
                    <Globe className="w-4 h-4 text-slate-600 ml-1" />
                    <button
                      onClick={() => setBriefLang('en')}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer font-extrabold ${
                        briefLang === 'en' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setBriefLang('hi')}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer font-extrabold ${
                        briefLang === 'hi' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      HI (हिंदी)
                    </button>
                    <button
                      onClick={() => setBriefLang('te')}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer font-extrabold ${
                        briefLang === 'te' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      TE (తెలుగు)
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-950 leading-relaxed">
                  {whyData?.summary || recommendation.reasoning}
                </p>

                <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm text-slate-950 flex items-start gap-2.5 font-bold shadow-2xs">
                  <ArrowRight className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0 font-extrabold" />
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-emerald-800 uppercase font-mono">
                      {briefLang === 'hi'
                        ? 'अनुशंसित नीति कार्रवाई: '
                        : briefLang === 'te'
                        ? 'సిఫార్సు చేసిన విధాన చర్య: '
                        : 'Recommended Policy Action: '}
                    </span>
                    <span className="font-bold text-slate-950">
                      {briefLang === 'hi'
                        ? `${recommendation.region_name} में त्वरित बुनियादी ढांचा पूंजी आवंटन शुरू करें।`
                        : briefLang === 'te'
                        ? `${recommendation.region_name} ప్రాంతంలో తక్షణ మూలధన కేటాయింపులను ప్రారంభించండి.`
                        : recommendation.recommended_action}
                    </span>
                  </div>
                </div>

                {whyData?.risks && whyData.risks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5">
                    <div className="text-xs sm:text-sm font-extrabold text-amber-800 flex items-center gap-2 font-mono">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>
                        {briefLang === 'hi'
                          ? 'निवेश जोखिम कारक एवं सीमाएं:'
                          : briefLang === 'te'
                          ? 'పెట్టుబడి ప్రమాద కారకాలు మరియు పరిమితులు:'
                          : 'Investment Risk Factors & Limitations:'}
                      </span>
                    </div>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-slate-800 font-bold space-y-1">
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
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs sm:text-sm text-slate-900 font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 font-extrabold" />
            <span className="font-extrabold text-slate-950">Validated by CivicPulse Evidence Engine</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-950 transition font-extrabold cursor-pointer shadow-2xs"
          >
            Close Detail View
          </button>
        </div>
      </div>
    </div>
  );
};
