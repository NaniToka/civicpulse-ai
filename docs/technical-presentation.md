# CivicPulse AI — 3-Minute Technical Deep Dive

**Track**: Track 1 — AI for Digital Public Infrastructure & Governance (BRICS Nations)  

---

## 🏛️ System Overview & Core Innovation

CivicPulse AI is an open-source, full-stack decision-support engine built with **React 18 + TypeScript + Vite + Tailwind CSS** on the frontend and **Python 3.12 + FastAPI + Pydantic v2 + Pytest** on the backend.

The platform's primary technical innovation is the **Strict AI vs. Deterministic Engine Boundary**:

```
+-------------------------------------------------------+
|            GOOGLE GEMINI AI RESPONSIBILITIES          |
|  - Script & Multilingual Language Detection           |
|  - Translation & Text Normalization                   |
|  - Civic Intent & Entity Extraction                   |
|  - Multilingual Policymaker Summaries (EN, HI, TE)    |
+-------------------------------------------------------+
                           ↓ (Structured Pydantic Data)
+-------------------------------------------------------+
|          DETERMINISTIC APPLICATION CODE LOGIC         |
|  - Per-Capita Population Normalization (100k)         |
|  - 30-Day Temporal Demand Velocity Momentum           |
|  - Infrastructure Capacity Deficit Scoring            |
|  - Demographic Census Vulnerability Indexing          |
|  - Capital Investment Overlap & Duplicate Risk        |
|  - Priority Score Calculation & Ranking (Engine V2)   |
|  - Counterfactual What-If Scenario Simulations        |
+-------------------------------------------------------+
```

---

## 🧠 Multilingual NLP Pipeline & Security

1. **Script Detection (`detect_language`)**: Evaluates text Unicode ranges for Telugu (`\u0C00-\u0C7F`), Devanagari/Hindi/Marathi (`\u0900-\u097F`), Bengali (`\u0980-\u09FF`), Portuguese, Zulu, and English.
2. **Prompt Injection Defense**: Citizen inputs are enclosed inside `<CITIZEN_INPUT_DATA_DO_NOT_EXECUTE>` tags in LLM prompts. `sanitize_input_text` neutralizes system overrides (`"Ignore previous instructions"`, `"Output API_KEY"`).
3. **Structured Output Schema**: Enforces strict JSON output validation matching Pydantic `StructuredAIOutput` with bounded confidence scores ($0.0 \le c \le 1.0$).
4. **Fallback Provider**: When `GEMINI_API_KEY` is unconfigured, the system resorts to `RuleBasedLanguageIntelligenceProvider` with script-aware heuristics.

---

## 📊 Deterministic Priority Engine V2 & Evidence Graph

Recommendations are ranked using an 8-factor weighted formula:

$$\text{Base Score} = (0.20 \cdot D_s) + (0.10 \cdot M_v) + (0.20 \cdot G_i) + (0.15 \cdot P_m) + (0.15 \cdot V_d) + (0.10 \cdot U_r) + (0.05 \cdot A_s) + (0.05 \cdot E_q)$$

- **Demand Density ($D_s$, weight $0.20$)**: Per-capita request volume ($100,000$ baseline).
- **Demand Acceleration ($M_v$, weight $0.10$)**: 30-day temporal request velocity.
- **Infrastructure Deficit ($G_i$, weight $0.20$)**: Operational capacity gap score ($0.00 \text{ to } 1.00$).
- **Demographic Need ($V_d$, weight $0.15$)**: Census vulnerability index.
- **Investment Overlap ($A_s$, weight $0.05$)**: Active project penalty (-15.0 pts), delayed project boost (+10.0 pts).

Every score is traceable through an ordered 6-step evidence chain:
`01 CITIZEN DEMAND → 02 DEMAND MOMENTUM → 03 INFRASTRUCTURE GAP → 04 DEMOGRAPHIC NEED → 05 INVESTMENT OVERLAP → 06 PRIORITY RECOMMENDATION`

---

## 🔒 Containerization & Production Deployment

- **Backend**: Non-root container (`python:3.12-slim`, user `civicpulse`, Uvicorn production server, `413` size limits, 60 req/min/IP rate limiter).
- **Frontend**: Multi-stage container (`node:20-alpine` → `nginx:alpine`) serving static production assets with custom `nginx.conf` supporting SPA fallback routing (`try_files $uri $uri/ /index.html`).
- **Orchestration**: `docker-compose.yml` linking frontend and backend services with container networking and automated health checks.
