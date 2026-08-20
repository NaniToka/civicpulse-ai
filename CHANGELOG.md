# Changelog — CivicPulse AI

All notable changes to **CivicPulse AI** will be documented in this file.

---

## [0.5.0] - 2026-08-21 (Production Hardening & Judge Showcase Release)

### Added
- **Multilingual Citizen Intelligence Engine**: Support for Telugu (`te`), Hindi (`hi`), Marathi (`mr`), Bengali (`bn`), Portuguese (`pt`), Zulu (`zu`), and English (`en`).
- **Interactive `CitizenVoiceComposer`**: Real-time signal composer with quick multilingual prompts, step-by-step pipeline animation, and structured extraction preview.
- **Multilingual Decision Briefs**: Language selection (**EN / HI / TE**) on Evidence Trail modals.
- **Production Containerization**: Multi-stage `frontend/Dockerfile` (Node 20 + Nginx Alpine), `backend/Dockerfile` (Python 3.12-slim non-root user), and `docker-compose.yml`.
- **API Security Hardening**: Bounded sliding-window IP rate limiting (`RateLimitMiddleware`), request size limits (10MB), prompt injection neutralization, and global exception payload contract.
- **Demo Reset Endpoint**: `POST /api/v1/demo/reset` for clearing transient in-memory signals back to seed data state.
- **Documentation Suite**: `LICENSE` (MIT), `CONTRIBUTING.md`, `SECURITY.md`, `docs/architecture.md`, `docs/responsible-ai.md`, `docs/judge-demo.md`, `docs/final-checklist.md`.

### Changed
- Modernized backend startup using FastAPI `lifespan` context manager.
- Updated Priority Scoring Engine to 8-factor weighted formula (Engine V2).

---

## [0.4.0] - 2026-08-20 (Premium Decision Intelligence Interface)
- Built 8-tab executive decision cockpit in React + TypeScript + Vite + Tailwind CSS.
- Added `CommandPalette` (`⌘K` / `Ctrl+K`), `PriorityBadge`, `TrendBadge`, and `EvidenceTrailModal`.

---

## [0.3.0] - 2026-08-20 (Civic Evidence Graph & Recommendation Intelligence)
- Implemented `DemandMomentumEngine`, `DemographicRelevanceEngine`, `InvestmentOverlapEngine`, and 6-step Evidence Graph Service.

---

## [0.2.0] - 2026-08-20 (Citizen Demand Intelligence Engine)
- Implemented centralized 15-category taxonomy in `taxonomy.py` and rule-based AI provider fallback.

---

## [0.1.0] - 2026-08-20 (System Foundation Scaffolding)
- Initial monorepo scaffolding for backend FastAPI and frontend React app.
