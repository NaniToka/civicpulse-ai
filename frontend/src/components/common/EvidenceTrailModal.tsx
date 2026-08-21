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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 md:p-8 border-b border-slate-800 bg-slate-950/80 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <PriorityBadge level={recommendation.priority_level} score={recommendation.priority_score} size="lg" />
              <span className="text-xs font-mono font-bold text-slate-200 bg-slate-800 px-3 py-1 rounded-md border border-slate-700">
                {recommendation.id}
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-4 h-4" />
                {(recommendation.confidence * 100).toFixed(0)}% Confidence
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-2">
              <span>{recommendation.category.toUpperCase()} Expansion in {recommendation.region_name}</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              Traceable 6-step evidence trail linking citizen signals to capital allocation priorities.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8">
          {loading ? (
            <div className="py-16 text-center text-slate-300 text-sm font-bold font-mono">
              Assembling Civic Evidence Graph...
            </div>
          ) : (
            <>
              {/* Signature Vertical 6-Step Evidence Trail */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Network className="w-4 h-4 text-sky-400" />
                  <span>Civic Evidence Chain ("Show Your Work")</span>
                </h3>

                <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                  {whyData?.evidence_chain.map((step) => (
                    <div key={step.step} className="relative group">
                      <div className={`absolute -left-7 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-extrabold border ${
                        step.step === 6
                          ? 'bg-rose-950 text-rose-200 border-rose-500 shadow-md shadow-rose-950'
                          : 'bg-slate-900 text-sky-300 border-sky-500'
                      }`}>
                        {step.step}
                      </div>

                      <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-2 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-sky-400 uppercase tracking-wide font-mono">
                            {step.title}
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 border border-emerald-700 px-2.5 py-1 rounded-md">
                            {step.contribution}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-100">{step.finding}</div>
                        <div className="text-xs font-mono text-slate-300 flex items-center gap-2 pt-1 font-semibold">
                          <span>Evidence Metric:</span>
                          <span className="text-slate-100 font-bold">{step.value}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8-Factor Scoring Model Breakdown */}
              {whyData?.factors && whyData.factors.length > 0 && (
                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    Deterministic Scoring Model Factors (V2)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {whyData.factors.map((factor) => (
                      <div key={factor.name} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-100">{factor.name}</span>
                          <span className="font-mono text-sky-300">
                            {factor.raw_value.toFixed(1)}/100 (w: {(factor.weight * 100).toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, factor.raw_value))}%` }}
                          />
                        </div>
                        <div className="text-xs text-slate-300 font-medium">{factor.explanation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Multilingual AI Decision Brief Section */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-800/60 space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-900/40 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-wider font-mono">
                      Multilingual AI Decision Brief
                    </h3>
                  </div>

                  {/* Multilingual Language Switcher */}
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-xs font-mono">
                    <Globe className="w-4 h-4 text-slate-400 ml-1" />
                    <button
                      onClick={() => setBriefLang('en')}
                      className={`px-2.5 py-1 rounded-md transition font-bold ${
                        briefLang === 'en' ? 'bg-indigo-900 text-indigo-100 border border-indigo-700' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setBriefLang('hi')}
                      className={`px-2.5 py-1 rounded-md transition font-bold ${
                        briefLang === 'hi' ? 'bg-indigo-900 text-indigo-100 border border-indigo-700' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      HI (हिंदी)
                    </button>
                    <button
                      onClick={() => setBriefLang('te')}
                      className={`px-2.5 py-1 rounded-md transition font-bold ${
                        briefLang === 'te' ? 'bg-indigo-900 text-indigo-100 border border-indigo-700' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      TE (తెలుగు)
                    </button>
                  </div>
                </div>

                <p className="text-sm font-medium text-slate-100 leading-relaxed">
                  {whyData?.summary || recommendation.reasoning}
                </p>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 flex items-start gap-3 shadow-md">
                  <ArrowRight className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <span className="font-bold text-emerald-400 uppercase font-mono">
                      {briefLang === 'hi'
                        ? 'अनुशंसित नीति कार्रवाई: '
                        : briefLang === 'te'
                        ? 'సిఫార్సు చేసిన విధాన చర్య: '
                        : 'Recommended Policy Action: '}
                    </span>
                    <span className="font-semibold">
                      {briefLang === 'hi'
                        ? `${recommendation.region_name} में त्वरित बुनियादी ढांचा पूंजी आवंटन शुरू करें।`
                        : briefLang === 'te'
                        ? `${recommendation.region_name} ప్రాంతంలో తక్షణ మూలధన కేటాయింపులను ప్రారంభించండి.`
                        : recommendation.recommended_action}
                    </span>
                  </div>
                </div>

                {whyData?.risks && whyData.risks.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-indigo-900/40 space-y-2">
                    <div className="text-xs font-bold text-amber-400 flex items-center gap-2 font-mono">
                      <AlertTriangle className="w-4 h-4" />
                      <span>
                        {briefLang === 'hi'
                          ? 'निवेश जोखिम कारक एवं सीमाएं:'
                          : briefLang === 'te'
                          ? 'పెట్టుబడి ప్రమాద కారకాలు మరియు పరిమితులు:'
                          : 'Investment Risk Factors & Limitations:'}
                      </span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-slate-300 font-medium space-y-1">
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
        <div className="p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-300 font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Validated by CivicPulse Evidence Engine • Synthetic Demo Data</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 transition font-bold shadow-sm"
          >
            Close Detail View
          </button>
        </div>
      </div>
    </div>
  );
};
