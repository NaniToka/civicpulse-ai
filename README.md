# CivicPulse AI

> **AI-Powered Civic Decision Intelligence Platform**  
> *Track 1 — AI for Digital Public Infrastructure & Governance (BRICS Nations)*

---

## 📌 Executive Overview

Governments across developing economies and BRICS nations process millions of fragmented citizen feedback entries across diverse languages (Hindi, Marathi, Telugu, Portuguese, Zulu, Bengali, Russian, Mandarin, English, etc.). Traditional public administration systems process feedback in silos—leading to unaddressed infrastructure bottlenecks, misallocated capital investments, and a disconnect between citizen demand signals and national infrastructure policy.

**CivicPulse AI** is an open-source, scalable, multilingual decision-support platform designed as a **Digital Public Good**. It bridges citizen feedback and national public investment planning by transforming unstructured citizen signals into geographic demand intelligence, cross-referencing demographic data, infrastructure deficit indices, and existing investment allocations to generate **transparent, explainable priority scores and actionable evidence cards for policymakers**.

> ⚠️ **Prototype Disclaimer**: All seed dataset files (`data/seed/*.json`) and demonstration API responses contain synthetic data created solely for prototyping and verification purposes, explicitly flagged with `"is_synthetic": true` / `"is_demo": true`.

---

## 🗣️ Multilingual Civic Intelligence Engine

CivicPulse AI accepts unstructured citizen feedback in multiple languages (Telugu, Hindi, Marathi, Bengali, Portuguese, Zulu, English) and converts it into structured, actionable civic signals:

```
CITIZEN VOICE / TEXT (e.g. "మా ప్రాంతంలో పిల్లలకు మంచి ఆసుపత్రి లేదు.")
                               ↓
LANGUAGE DETECTION (Script-aware: Telugu, Devanagari, Bengali, Latin)
                               ↓
LANGUAGE NORMALIZATION & TRANSLATION ("Lacks adequate pediatric healthcare facilities")
                               ↓
CIVIC INTENT CLASSIFICATION (e.g. request_improvement, report_outage)
                               ↓
ENTITY & URGENCY EXTRACTION (Pediatric Hospital • HIGH Urgency)
                               ↓
GEOSPATIAL LOCATION RESOLUTION (Kanpur / Ekurhuleni / Pune)
                               ↓
STRUCTURED CIVIC SIGNAL → DEMAND INTELLIGENCE → EVIDENCE GRAPH → PRIORITY ENGINE V2
```

---

## 🛡️ AI Architecture & Responsible AI Boundary

### Separation of Responsibilities

```
+-------------------------------------------------------+
|            GOOGLE GEMINI AI RESPONSIBILITIES          |
|  - Script & Multilingual Language Detection           |
|  - Translation & Text Normalization                   |
|  - Civic Intent & Entity Extraction                   |
|  - Multilingual Policymaker Summaries (EN, HI, TE)    |
+-------------------------------------------------------+
                           ↓ (Structured JSON Data)
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

### Responsible AI Principles

1. **No AI-Fabricated Statistics**: Google Gemini is **NEVER** allowed to calculate priority scores, invent population numbers, or modify deficit metrics.
2. **Prompt Injection Defense**: Citizen inputs are isolated inside `<CITIZEN_INPUT_DATA_DO_NOT_EXECUTE>` tags with strict system boundaries preventing embedded override commands.
3. **Structured Output Validation**: All AI responses are validated against Pydantic schemas with bounded confidence scores ($0.0 \le c \le 1.0$) and controlled retry logic.
4. **Graceful Fallback Provider**: If `GEMINI_API_KEY` is omitted or unconfigured, the platform seamlessly operates using `RuleBasedLanguageIntelligenceProvider` with script-aware language detection.

---

## 🖥️ Product Experience & Main Views

The interface presents a cohesive decision intelligence pipeline across 8 primary workspace views:

1. **Executive Overview** (`/`): High-level executive KPIs, interactive "Civic Demand Landscape" regional heatmap, Live Signal Ticker, Top Priority Actions, and Featured Evidence Preview.
2. **Demand Intelligence** (`/demand`): Interactive `CitizenVoiceComposer` for real-time multilingual feedback input, category demand distribution, 30-day temporal demand velocity signals (`INCREASING`, `STABLE`, `EMERGING`), and language representation metrics.
3. **Demand Hotspots** (`/hotspots`): Per-capita normalized demand concentration ($100,000$ residents baseline), selected Region Intelligence Panel, and sortable Municipal Hotspot Ranking Table.
4. **Infrastructure Gaps** (`/gaps`): Operational capacity deficit index overview and Region × Sector Deficit Heat Matrix (0.00 to 1.00 intensity).
5. **Priority Recommendations** (`/recommendations`): Ranked evidence-backed capital priorities, filterable cards (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`), score badges, and evidence trail triggers.
6. **Evidence Explorer** (`/evidence`): Searchable granular evidence nodes (`citizen_demand`, `infrastructure_gap`, `demographic_need`, `investment_context`), confidence metrics, and 6-step recommendation chains.
7. **Scenario Lab** (`/scenarios`): Interactive counterfactual policy simulator allowing budget allocation ($1M to $50M USD) and coverage target adjustments with Before/After score deltas and beneficiary projections.
8. **Data Explorer** (`/data`): Synthetic demonstration dataset inspector (Requests, Regions, Indicators, Investments) and live multilingual citizen request ingestion testing.

---

## ⭐ Key Differentiator — Civic Evidence Trail ("Show Your Work")

Every priority recommendation is traceable through an ordered 6-step evidence trail:

```
01 CITIZEN DEMAND → 02 DEMAND MOMENTUM → 03 INFRASTRUCTURE GAP → 04 DEMOGRAPHIC NEED → 05 INVESTMENT OVERLAP → 06 PRIORITY RECOMMENDATION
```

Clicking **"View Evidence Trail"** on any recommendation opens a dedicated detail modal exposing:
- **Visual Vertical Timeline**: Ordered 6-step evidence chain with exact findings and contribution points.
- **8-Factor Scoring Formula Breakdown**: Transparent horizontal bar visualization for Demand Signal (0.20), Demand Momentum (0.10), Deficit Gap (0.20), Population (0.15), Demographic Need (0.15), Urgency (0.10), Investment Alignment (0.05), and Evidence Quality (0.05).
- **Multilingual AI Decision Brief**: Gemini-generated executive summary with language switcher (English, Hindi, Telugu).

---

## 🎬 90-Second Ideal Judge Demo Flow

See [docs/demo-script.md](docs/demo-script.md) for the complete judge presentation script:
1. **Executive Overview**: Inspect top KPIs and hover over the **Civic Demand Landscape**.
2. **Select Hotspot**: Click a district (e.g. *Kanpur South Belt*) to open the Region Intelligence Panel.
3. **Open Recommendation**: Navigate to **Priority Recommendations** and select the top `CRITICAL` recommendation (*Healthcare Expansion*).
4. **Follow Evidence Trail**: Click **"View Evidence Trail"** to inspect the vertical 6-step evidence timeline and toggle language (EN → HI → TE).
5. **Open Scenario Lab**: Navigate to **Scenario Lab**, adjust the budget slider to **$15,000,000 USD**, and click **"Execute Counterfactual Simulation"**.
6. **Submit Telugu Voice Signal**: Open **Demand Intelligence**, select the Telugu example (`మా ప్రాంతంలో పిల్లలకు మంచి ఆసుపత్రి లేదు.`), click **"Analyze Civic Signal"**, and observe real-time classification and demand engine integration.

---

## 🏗️ Monorepo Structure

```
civicpulse-ai/
├── frontend/             # React + TypeScript + Vite + Tailwind CSS decision cockpit
│   ├── src/
│   │   ├── components/   # Sidebar, Navbar, CommandPalette (⌘K), CitizenVoiceComposer, PriorityBadge, EvidenceTrailModal
│   │   ├── pages/        # Executive Overview, Demand Intelligence, Hotspots, Gaps, Recommendations, Evidence Explorer, Scenario Lab, Data Explorer
│   │   ├── services/     # Typed API client connecting to backend /api/v1
│   │   └── types/        # TypeScript domain models & Evidence Graph schemas
├── backend/              # Python + FastAPI + Pydantic v2 + Pytest intelligence engine
│   ├── app/
│   │   ├── api/          # RESTful API routes (/recommendations/ranked, /citizen-requests/analyze, /scenarios, etc.)
│   │   ├── core/         # Security middleware, prompt injection defense, controlled taxonomy & intents
│   │   ├── models/       # Pydantic schemas & Evidence Graph models
│   │   └── services/     # AI service, location, demand momentum, demographic, investment & scoring engines
│   └── tests/            # Pytest test suite (35 passing tests)
├── data/seed/            # Multi-country synthetic demo datasets
├── docs/                 # Architecture, evidence graph, and 90-second demo script documentation
└── scripts/              # Project verification & linting scripts
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
* Backend Unit & AI Tests: `cd backend && .venv/bin/pytest`
* Backend Linting: `cd backend && .venv/bin/ruff check .`
* Frontend Linting & Build: `cd frontend && npm run lint && npm run build`

---

## 📄 License

Distributed under the [MIT License](LICENSE). Built as a Digital Public Good for global public governance.
