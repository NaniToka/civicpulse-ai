# CivicPulse AI

> **Citizen Demand Intelligence & Infrastructure Prioritization Platform**  
> *Track 1 — AI for Digital Public Infrastructure & Governance (BRICS Nations)*

---

## 📌 Executive Overview

Governments across developing economies and BRICS nations process millions of fragmented citizen feedback entries across diverse languages (Hindi, Marathi, Portuguese, Zulu, Bengali, Russian, Mandarin, English, etc.). Traditional public administration systems process feedback in silos—leading to unaddressed infrastructure bottlenecks, misallocated capital investments, and a disconnect between citizen demand signals and national infrastructure policy.

**CivicPulse AI** is an open-source, scalable, multilingual decision-support platform designed as a **Digital Public Good**. It bridges citizen feedback and national public investment planning by transforming unstructured citizen signals into geographic demand intelligence, cross-referencing demographic data, infrastructure deficit indices, and existing investment allocations to generate **transparent, explainable priority scores and actionable evidence cards for policymakers**.

> ⚠️ **Synthetic Demonstration Data Disclaimer**: All seed data files (`data/seed/*.json`) and demonstration API responses contain synthetic data created solely for prototyping and verification purposes, explicitly flagged with `"is_synthetic": true` / `"is_demo": true`.

---

## ⭐ Why CivicPulse AI is Different

Unlike generic chatbots or complaints databases, CivicPulse AI operates as an evidence-driven decision intelligence system:

1. **Not a Mere Complaint Aggregator**: Transforms raw multilingual feedback into structured, per-capita normalized demand signals ($100,000$ residents baseline).
2. **Civic Evidence Graph**: Every recommendation is backed by a 6-step evidence trail (`CITIZEN SIGNAL → DEMAND MOMENTUM → INFRASTRUCTURE GAP → DEMOGRAPHIC CONTEXT → INVESTMENT ALIGNMENT → PRIORITY RECOMMENDATION`).
3. **Temporal Demand Velocity**: Detects whether citizen demand is `INCREASING` (+15% acceleration), `STABLE`, `DECREASING`, or `EMERGING`.
4. **Demographic Need Intelligence**: Cross-references category-specific census metrics (elderly %, youth %, student density, digital divide gap).
5. **Investment Overlap Detection**: Evaluates active public projects to avoid duplicate funding while flagging delayed projects for urgent policy intervention.
6. **Transparent Priority Engine V2**: 8-factor deterministic scoring formula ($w_d=0.20, w_m=0.10, w_g=0.20, w_p=0.15, w_v=0.15, w_u=0.10, w_a=0.05, w_e=0.05$) with full factor contribution visibility.
7. **"Show Your Work" Explainability**: Exposes machine-readable evidence chains via `/api/v1/recommendations/{id}/explain`.
8. **Counterfactual What-If Simulation**: Simulates post-investment score deltas, gap reductions, and population impact.
9. **Strict AI Boundary**: Google Gemini is used solely for multilingual extraction and executive natural language explanations; **AI NEVER computes numbers or alters deterministic scores**.

---

## 🎯 Core Pipeline & Evidence Graph

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
DEMAND SIGNAL & TEMPORAL VELOCITY MOMENTUM
               ↓
PER-CAPITA DEMAND HOTSPOT ENGINE
               ↓
INFRASTRUCTURE GAP ANALYSIS & DEMOGRAPHIC CONTEXT
               ↓
PUBLIC CAPITAL INVESTMENT OVERLAP CHECK
               ↓
DETERMINISTIC PRIORITY ENGINE V2 (8 Factors + Penalties)
               ↓
CIVIC EVIDENCE GRAPH & "WHY THIS RECOMMENDATION?" TRAIL
```

---

## 🏗️ Monorepo Structure

```
civicpulse-ai/
├── frontend/             # React + TypeScript + Vite + Tailwind CSS dashboard UI
├── backend/              # Python + FastAPI + Pydantic v2 + Pytest intelligence backend
│   ├── app/
│   │   ├── api/          # RESTful API routes (/api/v1/recommendations/ranked, /evidence/{id}, etc.)
│   │   ├── core/         # Config, security middleware, and centralized taxonomy
│   │   ├── models/       # Strongly typed Pydantic domain schemas & Evidence Graph models
│   │   └── services/     # AI service, location, demand momentum, demographic, investment & scoring engines
│   └── tests/            # Automated Pytest suite (taxonomy, AI, prompt injection, hotspots, momentum, scoring, APIs)
├── data/seed/            # Multi-country synthetic demo datasets (labeled synthetic)
├── docs/                 # Architecture, security, data models, evidence graph, and scoring formulas
├── scripts/              # Project verification & linting scripts
└── .github/              # CI/CD pipelines (GitHub Actions)
```

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
