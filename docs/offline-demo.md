# CivicPulse AI — Offline Demo Backup Runbook

---

## ⚡ Live Demo Resilience Strategy

In the event of network disruption, Gemini API rate limits, or internet failure during judging, CivicPulse AI is engineered to operate 100% offline using `RuleBasedLanguageIntelligenceProvider`.

### Offline Verification Steps
1. **Zero Internet Required**: All seed datasets (`data/seed/*.json`), deterministic scoring algorithms, script-aware NLP detectors, and Vite SPA bundles execute locally.
2. **Fallback Indicator**: When operating offline without Gemini, the UI displays `Provider: rule_based_fallback` on analysis result cards.
3. **Identical Visual Experience**: All 8 workspace views, 6-step Evidence Trails, Telugu signal entry, and Scenario Lab simulations perform identically.
