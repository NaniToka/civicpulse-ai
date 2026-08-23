# CivicPulse AI — Responsible AI Framework

**Track 1 — AI for Digital Public Infrastructure & Governance (BRICS Nations)**

---

## 📌 Core Philosophy & Boundaries

CivicPulse AI adheres to strict Responsible AI guidelines to ensure that artificial intelligence acts as a transparent, explainable decision-support tool for public officials rather than an autonomous decision-maker.

---

## 🛡️ Key Responsible AI Principles

### 1. Deterministic AI Boundary ("No AI-Fabricated Statistics")
- **AI Role**: Google Gemini is used solely for natural language processing—detecting scripts, translating text, classifying intent, extracting entities, drafting executive multilingual decision briefs, and formatting Copilot conversational markdown answers.
- **Deterministic Role**: All priority scores, per-capita demand normalization, infrastructure capacity gaps, census vulnerability indices, capital project overlap penalties, counterfactual scenario deltas, and CivicFund project funding gaps are computed 100% deterministically in Python application code.
- **Enforcement**: Gemini is **NEVER** allowed to compute numbers, modify priority scores, or fabricate stats. If data is absent, Copilot states: *"I don't have enough verified CivicPulse data to answer that."*

### 2. Prompt Injection & Key Exfiltration Defense
- Citizen feedback and user Copilot questions are treated as untrusted external data.
- Inputs are enclosed inside `<CITIZEN_INPUT_DATA_DO_NOT_EXECUTE>` tags with explicit system instructions to ignore prompt jailbreaks or key exfiltration commands.
- `sanitize_input_text` and `CopilotService._is_security_violation` neutralize system override patterns, secret key exfiltration requests (`GEMINI_API_KEY`, `os.environ`), and code execution attempts before reaching the LLM.


### 3. Strict Schema Validation & Bounded Confidence
- AI JSON responses are validated against Pydantic `StructuredAIOutput` schemas.
- Confidence scores are strictly bounded ($0.0 \le \text{confidence} \le 1.0$).
- If validation fails, 1 controlled retry is executed; if it fails again, the system falls back to `RuleBasedLanguageIntelligenceProvider`.

### 4. Synthetic Data Transparency
- All demonstration seed datasets (`data/seed/*.json`) are explicitly flagged with `"is_synthetic": true` / `"is_demo": true`.
- The UI features a persistent `DEMO ENVIRONMENT • SYNTHETIC DATA` banner to prevent confusion with official government statistics.

### 5. Multilingual Inclusivity & Human Oversight
- Policymakers can review AI Decision Briefs in English, Hindi, or Telugu.
- Final infrastructure funding decisions always require human policymaker review and approval.
