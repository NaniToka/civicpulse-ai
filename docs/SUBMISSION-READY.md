# CivicPulse AI — Hackathon Submission Dossier

**Track**: Track 1 — AI for Digital Public Infrastructure & Governance (BRICS Nations)  
**Project**: CivicPulse AI  
**Version**: 0.5.0  
**License**: MIT License  

---

## 📌 Executive Summary

Governments across developing economies and BRICS nations process millions of fragmented citizen feedback entries across diverse languages (Hindi, Marathi, Telugu, Portuguese, Zulu, Bengali, English). Traditional public administration systems process complaints in isolated silos—leading to unaddressed infrastructure bottlenecks, misallocated capital investments, and a disconnect between citizen demand signals and national infrastructure policy.

**CivicPulse AI** is an open-source, scalable decision-support platform designed as a **Digital Public Good**. It bridges citizen feedback and national public investment planning by transforming unstructured citizen signals into geographic demand intelligence, cross-referencing demographic data, infrastructure deficit indices, and existing investment allocations to generate **transparent, explainable priority scores and actionable evidence cards for policymakers**.

---

## 🔑 Key Features & Differentiators

1. **Multilingual Voice Signal Ingestion**: Script-aware language detection across Telugu, Hindi, Marathi, Bengali, Portuguese, Zulu, and English text inputs.
2. **Deterministic Priority Scoring Engine V2**: 8-factor mathematical scoring model ($w_d=0.20, w_m=0.10, w_g=0.20, w_p=0.15, w_v=0.15, w_u=0.10, w_a=0.05, w_e=0.05$).
3. **Traceable 6-Step Evidence Trail ("Show Your Work")**: Complete transparency linking citizen voices down to capital project alignment.
4. **Multilingual AI Decision Briefs**: Language selector (**EN / HI / TE**) on evidence trail modals.
5. **Counterfactual Scenario Lab**: Simulator allowing policymakers to test budget allocations ($1M to $50M USD) with score deltas and beneficiary projections.
6. **Responsible AI & Security**: Strict separation between LLM language parsing and deterministic scoring, prompt injection defense, 10MB payload ceiling, and rate limiting (60 req/min/IP).

---

## 🛠️ Verification & Quality Assurance

- **Backend Pytest Suite**: 37 / 37 passed (0.44s).
- **Backend Ruff Linter**: 0 errors (Clean).
- **Frontend ESLint**: 0 errors, 0 warnings.
- **Frontend TypeScript**: 0 type errors (`tsc --noEmit`).
- **Vite Build**: Succeeded (`npm run build` in 1.06s).
- **Monorepo System Script**: `./scripts/verify_project.sh` passed.
- **Git Repository**: Clean working tree on `main` branch.

---

## 🚀 Deployment Instructions

### Quickstart (Local)
```bash
# Backend
cd backend && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend && npm install && npm run dev
```

### Quickstart (Docker Compose)
```bash
docker compose build
docker compose up -d
```
- Frontend Cockpit: `http://localhost:5173`
- Backend API Docs: `http://localhost:8000/docs`
