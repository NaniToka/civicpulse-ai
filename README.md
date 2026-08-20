# CivicPulse AI

> **Citizen Demand Intelligence & Infrastructure Prioritization Platform**  
> *Track 1 — AI for Digital Public Infrastructure & Governance (BRICS Nations)*

---

## 📌 Executive Overview

Governments across developing economies and BRICS nations process millions of fragmented citizen feedback entries across diverse languages (Hindi, Marathi, Portuguese, Zulu, Bengali, Russian, Mandarin, English, etc.). Traditional public administration systems process feedback in silos—leading to unaddressed infrastructure bottlenecks, misallocated capital investments, and a disconnect between citizen demand signals and national infrastructure policy.

**CivicPulse AI** is an open-source, scalable, multilingual decision-support platform designed as a **Digital Public Good**. It bridges citizen feedback and national public investment planning by transforming unstructured citizen signals into geographic demand intelligence, cross-referencing demographic data, infrastructure deficit indices, and existing investment allocations to generate **transparent, explainable priority scores and actionable evidence cards for policymakers**.

> ⚠️ **Synthetic Demonstration Data Disclaimer**: All seed data files (`data/seed/*.json`) and demonstration API responses contain synthetic data created solely for prototyping and verification purposes, explicitly flagged with `"is_synthetic": true` / `"is_demo": true`.

---

## 🎯 Project Vision & Core Pipeline

Unlike generic chatbots or simple complaint ticketers, CivicPulse AI operates as an end-to-end **Citizen Demand Intelligence Engine**:

```
RAW CITIZEN INPUT (Voice / Text / WhatsApp / Survey)
               ↓
LANGUAGE DETECTION & NORMALIZATION
               ↓
PROMPT INJECTION DEFENSE & PARSING
               ↓
CIVIC INTENT CLASSIFICATION (Controlled Taxonomy)
               ↓
ENTITY / REQUIREMENT EXTRACTION
               ↓
GEOSPATIAL LOCATION RESOLUTION
               ↓
DEMAND SIGNAL & DETERMINISTIC AGGREGATION
               ↓
PER-CAPITA DEMAND HOTSPOT ENGINE
               ↓
INFRASTRUCTURE GAP ANALYSIS & DEMOGRAPHIC CONTEXT
               ↓
DETERMINISTIC PRIORITY ENGINE (Scoring & Penalties)
               ↓
EXPLAINABILITY ENGINE ("Why This Recommendation?")
```

### Key Questions Answered by CivicPulse AI:
1. **What** specific infrastructure should be prioritized (`healthcare`, `education`, `water`, `sanitation`, `electricity`, `roads`, `transportation`, `digital_connectivity`, etc.)?
2. **Where** is the demand hotspot geographically located (per-capita normalized per 100,000 residents)?
3. **Why** is this project urgent (Demand Signal + Deficit Index + Population Impact + Demographic Need vs. Active Investments)?
4. **For Whom** will this project yield the maximum socioeconomic impact?
5. **Based on What Evidence** (Synthesized citizen feedback, infrastructure capacity deficits, public budget records)?

---

## ⚡ Intelligence Layer Highlights (Prompt 2 Implementation)

- **Centralized Controlled Taxonomy** (`app/core/taxonomy.py`): Single source of truth defining 15 standardized civic infrastructure categories with alias normalization for native BRICS languages.
- **Provider-Independent AI Service** (`app/services/ai_service.py`): Clean `BaseLanguageIntelligenceProvider` interface wrapping Google Gemini API with strict `StructuredAIOutput` validation, retries, and a deterministic rule-based fallback model (`RuleBasedLanguageIntelligenceProvider`).
- **Prompt Injection Safeguards**: Untrusted citizen inputs are isolated inside `<CITIZEN_INPUT_DATA_DO_NOT_EXECUTE>` tags with prompt controls preventing instruction override attacks.
- **Per-Capita Hotspot Detection Engine** (`app/services/hotspot_engine.py`): Normalizes citizen demand per 100,000 residents ($\frac{\text{Weighted Demand}}{\text{Population}} \times 100,000$) to highlight high-density deficit areas regardless of absolute population size.
- **Deterministic Multi-Factor Scoring & Explainability** (`app/services/scoring_engine.py`): Mathematical scoring ($w_d=0.25, w_g=0.25, w_p=0.15, w_v=0.15, w_u=0.10, w_a=0.10$) with active investment penalty (-15 pts) and machine-readable `ExplanationDetails` factor breakdowns ("Why this recommendation?").
- **What-If Policy Simulation Service** (`app/services/scenario_service.py`): Simulates post-investment score deltas, gap reductions, and population impact for budget allocations.

---

## 🏗️ Architecture & Monorepo Structure

```
civicpulse-ai/
├── frontend/             # React + TypeScript + Vite + Tailwind CSS dashboard UI
├── backend/              # Python + FastAPI + Pydantic v2 + Pytest intelligence backend
│   ├── app/
│   │   ├── api/          # RESTful API routes (/api/v1/citizen-requests, /demand/hotspots, etc.)
│   │   ├── core/         # Config, security middleware, and centralized taxonomy
│   │   ├── models/       # Strongly typed Pydantic domain schemas
│   │   └── services/     # AI service, location resolution, demand aggregation, hotspot & scoring engines
│   └── tests/            # Automated Pytest suite (taxonomy, AI, prompt injection, hotspots, scoring, APIs)
├── data/seed/            # Multi-country synthetic demo datasets (labeled synthetic)
├── docs/                 # Architecture, security, data models, and scoring formulas
├── scripts/              # Project verification & linting scripts
└── .github/              # CI/CD pipelines (GitHub Actions)
```

---

## 🛡️ Security Best Practices

CivicPulse AI enforces strict security-first engineering:
* **Zero API Key Leakage**: API credentials strictly isolated to backend environment variables (`.env`).
* **Prompt Injection Protection**: Citizen input text treated strictly as untrusted data inside XML boundaries.
* **AI Output Validation**: Pydantic schemas enforce type safety on all LLM responses before database or API consumption.
* **CORS & Safe Headers**: Configurable CORS origin whitelist with security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `HSTS`).
* **Input Sanitization & Size Limits**: Payload limit of 10MB and string sanitization against prompt injection & XSS.

---

## 🚀 Quickstart & Local Setup

### Prerequisites
* **Python**: 3.10+
* **Node.js**: v18+ (Node 22 recommended)
* **Git**: 2.x

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run backend development server
uvicorn app.main:app --reload --port 8000
```
API Documentation will be live at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Start Vite dev server
npm run dev
```
Dashboard will be live at: `http://localhost:5173`

---

## 🧪 Verification & Quality Checks

Run the automated full-system verification script:
```bash
./scripts/verify_project.sh
```

Or run test suites manually:
* Backend Unit & API Tests: `cd backend && .venv/bin/pytest`
* Backend Linting: `cd backend && .venv/bin/ruff check .`
* Frontend Checks: `cd frontend && npm run build && npm run lint`

---

## 📄 License

Distributed under the [MIT License](LICENSE). Built as a Digital Public Good for global public governance.
