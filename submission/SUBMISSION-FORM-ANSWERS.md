# CivicPulse AI — Hackathon Submission Form Answers

---

### 1. Project Name
CivicPulse AI

### 2. One-Line Tagline
An open-source civic decision intelligence layer that transforms multilingual citizen voices into traceable, evidence-backed civic investment priorities.

### 3. Problem Statement
Traditional municipal 311 and complaint systems process citizen feedback in isolated administrative silos. Unstructured feedback across native languages (Hindi, Telugu, Marathi, Bengali, Zulu, Portuguese, English) remains unaggregated and disconnected from public capital planning, leading to unaddressed infrastructure bottlenecks and misallocated municipal spending.

### 4. Solution Description
CivicPulse AI aggregates multilingual citizen requests, normalizes demand per 100,000 residents, cross-references census vulnerability and operational capacity gap indices, checks active capital project overlaps, and generates transparent, 6-step evidence trails and counterfactual scenario simulations for public policymakers.

### 5. Core Innovation
Strict separation between LLM natural language understanding (Google Gemini AI) and deterministic Python decision scoring (Engine V2). AI handles script detection, translation, intent parsing, and multilingual decision briefs; deterministic code computes all priority scores, gap indices, and scenario deltas.

### 6. AI/ML Usage
Google Gemini (`google-genai` SDK / `gemini-2.5-flash`) handles script-aware language detection (Telugu, Hindi, Marathi, Bengali, Portuguese, Zulu, English), civic intent classification, entity parsing, and multilingual executive decision briefs (EN, HI, TE).

### 7. Technical Architecture
React 18 + TypeScript + Vite + Tailwind CSS frontend; Python 3.12 + FastAPI + Pydantic v2 + Pytest backend; containerized via multi-stage Nginx static container and non-root Uvicorn Python container.

### 8. Social Impact
Gives non-English-speaking citizens direct voice representation in public investment planning, while per-capita normalization ($100k$ baseline) ensures small rural districts receive equal voice representation against large metropolitan hubs.

### 9. Security & Responsible AI
Prompt injection defense (`<CITIZEN_INPUT_DATA_DO_NOT_EXECUTE>`), 10MB payload ceiling, sliding-window IP rate limiting (60 req/min/IP), security headers, Pydantic schema validation, and offline rule-based fallback provider resilience.

### 10. Future Scope
PostGIS spatial boundary mapping, native Speech-to-Text audio processing, Kafka async request queues, and REST/GraphQL adapters for municipal ERP databases.

### 11. Open Source & License
MIT License (`LICENSE`), open-source governance documentation (`README.md`, `CONTRIBUTING.md`, `SECURITY.md`), and reproducible Docker packaging.

### 12. Demo Description
Interactive 90-second live demonstration: Landing dashboard -> Telugu signal ingestion (`మా ప్రాంతంలో పిల్లలకు మంచి ఆసుపత్రి లేదు.`) -> 6-step evidence trail inspection -> Scenario Lab ($15M USD budget -> -18.5 pt score delta).

### 13. Challenges Faced
Enforcing a strict boundary between non-deterministic LLM language processing and deterministic mathematical decision logic while maintaining real-time responsiveness.

### 14. Key Achievement
Building a complete, containerized, 7-language decision-support prototype with 37 passing unit tests, zero secret exposure, and 6-step traceable evidence trails.
