# CivicPulse AI — Hackathon Submission Judge FAQ

---

### Q1: What does AI do vs Deterministic Logic?
**A**: Google Gemini processes natural language (script detection, translation, intent classification, entity parsing, decision brief generation). Deterministic Python code computes per-capita demand normalization, 8-factor priority scores, capacity gap indices, investment overlap penalties, and counterfactual scenario deltas.

---

### Q2: How are hallucinations prevented?
**A**: Gemini is never asked to generate priority scores or census data. AI JSON outputs are validated against Pydantic schemas (`StructuredAIOutput`) with bounded confidence ($0.0 \le c \le 1.0$). If validation fails, 1 controlled retry is triggered; if it fails again, the system falls back to `RuleBasedLanguageIntelligenceProvider`.

---

### Q3: How is prompt injection neutralized?
**A**: Untrusted citizen inputs are enclosed inside `<CITIZEN_INPUT_DATA_DO_NOT_EXECUTE>` tags in LLM prompts. `sanitize_input_text` neutralizes override commands (e.g. `"Ignore previous instructions"`).

---

### Q4: Is the dataset real government data?
**A**: No. All seed files (`data/seed/*.json`) are synthetic datasets generated for prototyping, explicitly flagged with `"is_synthetic": true` / `"is_demo": true`.
