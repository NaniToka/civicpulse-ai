# CivicPulse AI 0.5.0 — Hackathon Release Candidate

**Track**: Track 1 — AI for Digital Public Infrastructure & Governance (BRICS Nations)  
**Release Date**: August 21, 2026  
**License**: MIT License  
**Status**: Release Candidate (GO — Submission Ready)  

---

## 📌 Release Summary

CivicPulse AI 0.5.0 is an open-source, full-stack decision-support prototype designed as a **Digital Public Good**. It transforms unstructured, multilingual citizen feedback into geographic demand intelligence, cross-references census vulnerability & capacity gap indices, checks active capital project overlaps, and generates traceable 6-step evidence trails for policymakers.

---

## 🔑 Key Release Capabilities

1. **Multilingual Voice Signal Ingestion**: Script-aware language detection across Telugu, Hindi, Marathi, Bengali, Portuguese, Zulu, and English text inputs (`CitizenVoiceComposer.tsx`).
2. **Responsible AI Architecture**: Strict boundary between Google Gemini NLP (language detection, translation, intent parsing, entity extraction) and deterministic Python logic (per-capita demand normalization, 8-factor scoring engine V2, capacity gap indexing, scenario simulation).
3. **Traceable 6-Step Evidence Trail ("Show Your Work")**: Complete transparency exposing exact mathematical factor contributions ($0.20 \cdot D_s + \dots$).
4. **Multilingual AI Decision Briefs**: Policymaker language selector (**EN / HI / TE**) on evidence trail modals.
5. **Counterfactual Scenario Lab**: Simulator allowing policymakers to test budget allocations ($1M to $50M USD) with score deltas and beneficiary projections.
6. **Production Security & Hardening**: Sliding-window IP rate limiting (60 req/min/IP), request size caps (10MB), prompt injection defense `<CITIZEN_INPUT_DATA_DO_NOT_EXECUTE>`, and security headers.
7. **Containerization**: Multi-stage Nginx static asset container + non-root Python FastAPI container with automated health checks (`GET /api/v1/health`).

---

## 🧪 Verification & Release Quality Gate

- **Backend Pytest Suite**: 37 / 37 passed (0.50s).
- **Backend Ruff Linter**: 0 errors (Clean).
- **Frontend ESLint**: 0 errors, 0 warnings.
- **Frontend TypeScript**: 0 type errors (`tsc --noEmit`).
- **Vite Build**: Succeeded (`npm run build` in 1.13s).
- **Monorepo System Script**: `./scripts/verify_project.sh` passed.
- **Git Repository**: Clean working tree on `main` branch.

---

## ⚠️ Prototype Disclaimer & Limitations
- All datasets (`data/seed/*.json`) are synthetic datasets created for demonstration purposes, explicitly flagged with `"is_synthetic": true` / `"is_demo": true`.
- Speech-to-Text relies on browser SpeechRecognition Web APIs or typed text inputs; raw audio binaries are not persisted to disk in this prototype stage.
