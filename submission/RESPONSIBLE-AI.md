# CivicPulse AI — Responsible AI Framework

---

## 🛡️ Responsible AI Principles

1. **Deterministic Priority Boundary**: AI never computes priority scores or alters financial statistics. Public capital spending recommendations are strictly computed by deterministic Python code.
2. **Schema-Constrained Outputs**: AI responses must conform to Pydantic validation schemas with bounded confidence scores.
3. **Prompt Injection Defense**: Citizen text is treated as raw un-executable data (`<CITIZEN_INPUT_DATA_DO_NOT_EXECUTE>`).
4. **Offline Fallback Resilience**: System operates seamlessly without an active API key using `RuleBasedLanguageIntelligenceProvider`.
5. **Synthetic Data Transparency**: Demo datasets are explicitly flagged with `"is_synthetic": true` / `"is_demo": true` warnings.
