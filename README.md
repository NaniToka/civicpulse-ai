# CivicPulse AI

> **Citizen Demand Intelligence & Infrastructure Prioritization Platform**  
> *Track 1 — AI for Digital Public Infrastructure & Governance (BRICS Nations)*

---

## 📌 Executive Overview

Governments across developing economies and BRICS nations process millions of fragmented citizen feedback entries across diverse languages (Hindi, Portuguese, Zulu, Tamil, Russian, Mandarin, English, etc.). Traditional public administration systems process feedback in silos—leading to unaddressed infrastructure bottlenecks, misallocated capital investments, and a disconnect between citizen demand signals and national infrastructure policy.

**CivicPulse AI** is an open-source, scalable, multilingual decision-support platform designed as a **Digital Public Good**. It bridges citizen feedback and national public investment planning by transforming unstructured citizen signals into geographic demand intelligence, cross-referencing demographic data, infrastructure deficit indices, and existing investment allocations to generate **transparent, explainable priority scores and actionable evidence cards for policymakers**.

---

## 🎯 Project Vision & Core Pipeline

Unlike generic chatbots or simple complaint ticketers, CivicPulse AI operates as a end-to-end **Citizen Demand Intelligence Engine**:

```
Citizen Voices (Voice / Text / WhatsApp)
               ↓
Multilingual Understanding & Entity Extraction (Gemini AI)
               ↓
Structured Civic Requests & Geospatial Mapping
               ↓
Demand Hotspot Aggregation & Cluster Analysis
               ↓
Infrastructure Deficit Indexing + Demographic Need Context
               ↓
Public Investment Alignment & Risk Assessment
               ↓
Deterministic, Reproducible Priority Scoring
               ↓
Explainable Recommendations & Policymaker Decision Dashboard
```

### Key Questions Answered by CivicPulse AI:
1. **What** specific infrastructure should be prioritized (Water, Clean Energy, Healthcare, Digital, Transit)?
2. **Where** is the demand hotspot geographically located?
3. **Why** is this project urgent (Demand Signal + Infrastructure Gap + Demographic Intake vs. Existing Investments)?
4. **For Whom** will this project yield the maximum socioeconomic impact?
5. **Based on What Evidence** (Synthesized citizen feedback, infrastructure capacity deficits, public budget records)?

---

## 🏗️ Architecture & Technology Stack

CivicPulse AI is structured as a clean, production-grade monorepo:

```
civicpulse-ai/
├── frontend/             # React + TypeScript + Vite + Tailwind CSS dashboard UI
├── backend/              # Python + FastAPI + Pydantic + Pytest service layer
├── data/                 # Seed datasets (regions, indicators, investments, requests)
├── docs/                 # Architecture, security, data models, and scoring formulas
├── scripts/              # Project verification & linting scripts
├── tests/                # System & integration verification suites
└── .github/              # CI/CD pipelines (GitHub Actions)
```

### Stack Highlights
* **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide icons, Vitest.
* **Backend**: Python 3.12, FastAPI, Pydantic v2, Pytest, Uvicorn, HTTPX.
* **AI Engine**: Google Gemini API via an isolated `AIService` abstraction with a resilient Graceful Fallback Mode for offline/unconfigured environments.
* **Data Model**: Normalized PostGIS-ready schema for regions, citizen requests, infrastructure indicators, investment plans, and priority recommendations.
* **Scoring Logic**: Fully deterministic, reproducible scoring formula—LLMs extract and summarize; code computes and ranks.

---

## 🛡️ Security Best Practices

CivicPulse AI enforces strict security-first engineering:
* **Zero API Key Leakage**: API credentials strictly isolated to backend environment variables (`.env`).
* **AI Output Validation**: Pydantic schemas enforce type safety on all LLM responses before database or API consumption.
* **CORS & Safe Headers**: Configurable CORS origin whitelist with security headers (`X-Content-Type-Options`, `X-Frame-Options`).
* **Input Sanitization & Size Limits**: Strict payload limits (10MB) and string sanitization against prompt injection & XSS.

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
* Backend: `cd backend && pytest`
* Frontend: `cd frontend && npm run build && npm run lint`

---

## 📄 License

Distributed under the [MIT License](LICENSE). Built as a Digital Public Good for global public governance.
