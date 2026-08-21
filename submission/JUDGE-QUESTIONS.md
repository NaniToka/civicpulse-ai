# CivicPulse AI — 23 Judge Questions & Answers

---

### Q1: What problem are you solving?
**A**: Traditional public administration complaint portals treat citizen feedback as isolated tickets. CivicPulse AI aggregates multilingual citizen voices, normalizes demand per 100,000 residents, cross-references census vulnerability and capacity gap indices, and outputs traceable, evidence-backed priority recommendations for public capital allocation.

### Q2: Why is this different from a complaint portal?
**A**: Complaint portals manage individual tickets without geographic or temporal aggregation. CivicPulse converts unstructured feedback into per-capita demand hotspots, checks existing public capital project overlaps, generates 6-step evidence trails, and simulates counterfactual budget interventions.

### Q3: Why do you need Gemini?
**A**: Citizens submit feedback in natural, non-standardized native languages (Hindi, Telugu, Marathi, Bengali, Portuguese, Zulu, English). Gemini handles script detection, translation, intent classification, entity extraction, and multilingual decision brief generation.

### Q4: What exactly does Gemini do?
**A**: Gemini handles language understanding and text extraction. It never computes priority scores or financial statistics.

### Q5: Does Gemini decide the priority score?
**A**: No. Gemini handles language understanding; deterministic Python application logic computes all priority scores, gap indices, and scenario deltas.

### Q6: How do you prevent hallucinations?
**A**: Gemini is never asked to generate numerical scores or census metrics. All AI JSON outputs are validated against Pydantic schemas (`StructuredAIOutput`) with bounded confidence scores ($0.0 \le c \le 1.0$). If validation fails, 1 controlled retry is triggered; if it fails again, the system falls back to `RuleBasedLanguageIntelligenceProvider`.

### Q7: How do you prevent prompt injection?
**A**: Untrusted citizen inputs are enclosed inside `<CITIZEN_INPUT_DATA_DO_NOT_EXECUTE>` tags in LLM prompts. `sanitize_input_text` neutralizes override commands (e.g. `"Ignore previous instructions"`).

### Q8: How do you calculate the priority score?
**A**: Using an 8-factor weighted formula:
$$\text{Base Score} = (0.20 \cdot D_s) + (0.10 \cdot M_v) + (0.20 \cdot G_i) + (0.15 \cdot P_m) + (0.15 \cdot V_d) + (0.10 \cdot U_r) + (0.05 \cdot A_s) + (0.05 \cdot E_q)$$

### Q9: Why deterministic scoring?
**A**: Public capital spending requires mathematical auditability, repeatability, and transparency. Deterministic scoring ensures two identical citizen demand profiles yield the exact same priority score.

### Q10: Why per-capita normalization?
**A**: Absolute complaint counts penalize low-population vulnerable areas. Normalizing per 100,000 residents ensures equal voice representation across large cities and small rural districts.

### Q11: How does multilingual support work?
**A**: The engine detects Unicode ranges (Telugu `\u0C00-\u0C7F`, Devanagari `\u0900-\u097F`, Bengali, Latin), extracts structured intent, normalizes text into English for cross-region aggregation, and renders decision briefs in English, Hindi, or Telugu.

### Q12: Why Telugu?
**A**: Telugu is spoken by over 80 million citizens in India. Demonstrating real-time Telugu extraction highlights how non-English voices directly shape public investment planning.

### Q13: What happens if Gemini goes down?
**A**: The system seamlessly executes `RuleBasedLanguageIntelligenceProvider` with script-aware NLP, ensuring zero downtime or application failure.

### Q14: Is the data real?
**A**: No. All datasets (`data/seed/*.json`) are synthetic demonstration datasets explicitly flagged with `"is_synthetic": true` / `"is_demo": true`.

### Q15: Why are you using synthetic data?
**A**: Synthetic data enables reproducible benchmarking and prototyping across multiple countries (India, South Africa, Brazil) without privacy or data governance barriers.

### Q16: How would this work with real government data?
**A**: By connecting FastAPI data loaders to municipal GIS databases, census APIs, and public ERP investment tracking systems via REST or GraphQL adapters.

### Q17: How would this scale?
**A**: The FastAPI backend is stateless and lightweight, enabling horizontal scaling behind load balancers. Ingested signals are normalized into structured JSON representations.

### Q18: What happens if thousands of citizens submit requests?
**A**: Signals are aggregated geographically and temporally. High request density increases the 30-day temporal demand velocity factor ($M_v$) and per-capita demand density ($D_s$).

### Q19: How do you prevent duplicate signals?
**A**: Signals within the same spatial-temporal window boost demand velocity rather than duplicating raw records, preventing artificial score manipulation.

### Q20: Can a government actually use this?
**A**: Yes. As a decision-support prototype, it provides public works directors and planning commissions with explainable evidence cards to validate budget requests.

### Q21: What is the biggest limitation?
**A**: Speech-to-Text relies on browser SpeechRecognition Web APIs or typed text inputs; raw audio binaries are not stored on disk in this prototype stage.

### Q22: What would you build next?
**A**: Native Speech-to-Text audio processing, PostGIS spatial boundary mapping, and automated integration adapters for municipal ERP databases.

### Q23: Why should judges select this project?
**A**: CivicPulse AI combines multilingual voice inclusion, deterministic public spending auditability, transparent evidence trails, and counterfactual scenario simulations into a deployable Digital Public Good.
