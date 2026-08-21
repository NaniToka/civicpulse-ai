# CivicPulse AI — Demo Recovery Plan

---

## 🛠️ Presentation Contingency Matrix

| Failure Scenario | Automatic System Behavior | Presenter Action |
| :--- | :--- | :--- |
| **Gemini API Unavailable / Unconfigured** | System executes `RuleBasedLanguageIntelligenceProvider` with script-aware NLP. Display badge: `rule_based_fallback`. | Continue demo seamlessly; point out graceful fallback resilience. |
| **Network Disruption / Offline** | Application runs 100% locally from Vite static bundle & local FastAPI backend. | Continue live demo; explain zero-dependency offline design. |
| **Browser Speech API Unsupported** | Textarea allows instant typing or clicking pre-configured Telugu/Hindi/English sample buttons. | Click the Telugu sample button (`మా ప్రాంతంలో...`). |
| **Backend Service Interrupted** | Backend health check auto-restarts Uvicorn or container. | Run `docker compose restart backend` or `uvicorn app.main:app --reload --port 8000`. |
| **Scenario Engine Delay** | Fallback simulation handler calculates counterfactual score delta locally. | Explain simulation math while result renders. |
