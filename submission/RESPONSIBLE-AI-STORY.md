# CivicPulse AI — Responsible AI & Human Oversight

---

## 🛡️ Responsible AI Principles & Human-in-the-Loop Governance

1. **Deterministic Priority Boundary**: AI processes natural language only. Deterministic Python mathematical code computes all priority scores, gap indices, and scenario deltas.
2. **Schema-Constrained LLM Outputs**: LLM responses must strictly conform to Pydantic validation schemas with bounded confidence scores ($0.0 \le c \le 1.0$).
3. **1-Time Controlled Retry & Fallback**: If LLM output fails schema validation, 1 retry is triggered; if it fails again, the system falls back to `RuleBasedLanguageIntelligenceProvider`.
4. **Human Policymaker Oversight**: Recommendations serve as decision-support evidence cards for public works directors and planning commissions—never as autonomous, unreviewed spending triggers.
5. **Synthetic Data Transparency**: Demo datasets are explicitly flagged with `"is_synthetic": true` / `"is_demo": true` disclaimers.
