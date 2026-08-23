# CivicPulse AI — Technical Judge FAQ

**Track**: Track 1 — AI for Digital Public Infrastructure & Governance (BRICS Nations)  

---

### Q1: What exactly does AI do in CivicPulse AI?
**A**: AI (Google Gemini / Fallback NLP) is strictly responsible for **natural language understanding**: script detection, language translation/normalization, civic intent classification (`request_improvement`, `report_outage`, etc.), entity parsing (facilities, population groups), and drafting executive multilingual decision briefs (English, Hindi, Telugu).

---

### Q2: Why not let the LLM calculate the final priority score?
**A**: LLMs are non-deterministic and susceptible to hallucinations, numerical drift, and prompt manipulation. In public infrastructure governance, spending millions based on an opaque LLM score is unacceptable. CivicPulse AI enforces a strict boundary: **AI processes language; deterministic Python code computes scores**.

---

### Q3: How do you prevent LLM hallucinations?
**A**: 
1. The LLM is never asked to generate numerical metrics, census data, or infrastructure gap scores.
2. All AI JSON outputs are validated against Pydantic schemas (`StructuredAIOutput`) with bounded confidence scores ($0.0 \le c \le 1.0$).
3. If JSON validation fails, 1 controlled retry is triggered; if it fails again, the system falls back to `RuleBasedLanguageIntelligenceProvider`.

---

### Q4: How do you defend against prompt injection attacks?
**A**:
1. Untrusted citizen text is enclosed inside `<CITIZEN_INPUT_DATA_DO_NOT_EXECUTE>` tags in system prompts.
2. `sanitize_input_text` neutralizes system override commands (e.g. `"Ignore previous instructions"` or `"Output API_KEY"`).
3. The LLM is instructed strictly to treat input text as raw data to classify, never as code or instructions to execute.

---

### Q5: What happens if the Gemini API goes down or is unconfigured?
**A**: CivicPulse AI includes an in-memory `RuleBasedLanguageIntelligenceProvider` with script-aware language detection (Telugu `\u0C00-\u0C7F`, Devanagari `\u0900-\u097F`, Bengali, Latin) and keyword heuristics. The system continues operating seamlessly with deterministic processing.

---

### Q6: How does the Priority Scoring Engine V2 work?
**A**: Priority scores ($0.0 \text{ to } 100.0$) are calculated using an 8-factor weighted formula:
$$\text{Base Score} = (0.20 \cdot D_s) + (0.10 \cdot M_v) + (0.20 \cdot G_i) + (0.15 \cdot P_m) + (0.15 \cdot V_d) + (0.10 \cdot U_r) + (0.05 \cdot A_s) + (0.05 \cdot E_q)$$
- **Demand Density ($0.20$)**: Normalized per 100,000 residents.
- **Demand Acceleration ($0.10$)**: 30-day temporal request velocity.
- **Infrastructure Deficit ($0.20$)**: Operational capacity gap ($0.00 \text{ to } 1.00$).
- **Demographic Vulnerability ($0.15$)**: Census vulnerability index.
- **Investment Overlap ($0.05$)**: Penalty for active duplicate projects (-15.0 pts), boost for delayed projects (+10.0 pts).

---

### Q7: How is this different from a standard municipal complaint portal?
**A**: Complaint portals treat requests as individual, isolated tickets. CivicPulse AI aggregates signals geographically and temporally, normalizes demand per 100,000 residents, cross-references infrastructure capacity deficits, checks existing capital investment overlaps, and generates traceable 6-step evidence trails for policymaker capital allocation.

---

### Q8: How does CivicPulse handle multiple languages?
**A**: CivicPulse supports Telugu, Hindi, Marathi, Bengali, Portuguese, Zulu, and English. The NLP engine detects the script, extracts intent and entities, translates the core meaning into normalized English for cross-region aggregation, and allows policymakers to view AI decision briefs in English, Hindi, or Telugu.

---

### Q9: How does the Scenario Lab calculate counterfactual deltas?
**A**: When a policymaker tests a budget allocation (e.g. $15,000,000 USD), the simulation engine statelessly projects the capacity deficit reduction ($\Delta \text{Gap} = \text{Budget} / \text{CostPerPct}$), re-runs the 8-factor scoring engine, and outputs the resulting score delta (`-18.5 pts`) and projected citizen beneficiaries (`+730,000 residents`).

---

### Q10: Is the dataset real government data?
**A**: No. All datasets (`data/seed/*.json`) are synthetic datasets generated explicitly for prototyping and verification, clearly flagged with `"is_synthetic": true` / `"is_demo": true`.

---

### Q11: Can CivicPulse scale to millions of citizen signals?
**A**: Yes. The FastAPI backend is lightweight and stateless, allowing horizontal scaling behind load balancers. Ingested signals are normalized into compact vector/json representations.

---

### Q12: What security controls are implemented?
**A**: Request payload limits (10MB), sliding-window rate limiting (60 req/min/IP), security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`), CORS origin restrictions, prompt injection defense, and non-root Docker container security.

---

### Q13: What are the current prototype limitations?
**A**: Speech-to-Text relies on browser SpeechRecognition Web APIs or typed text inputs; raw audio binaries are not stored on disk in this prototype stage. Real municipal deployment would require integration with municipal GIS and ERP databases.

---

### Q14: How does the Civic Intelligence Copilot work without hallucinating stats?
**A**: The Copilot (`/copilot`) uses a controlled context retrieval layer (`CopilotService`). When a user asks a natural-language question, the backend identifies the intent, retrieves verified facts from the deterministic data loaders, engines, and simulation services, and feeds only that grounded context to Gemini. If the required information is missing, it explicitly states *"I don't have enough verified CivicPulse data to answer that."* rather than inventing numbers.

