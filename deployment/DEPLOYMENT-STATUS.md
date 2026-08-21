# 🚀 CivicPulse AI — Deployment Status

## Architecture Summary
- **Frontend Stack**: React 18 + TypeScript 5.5 + Vite 5 served via Render Production Static Site.
- **Backend Stack**: Python 3.12 + FastAPI + Uvicorn served via Render Web Service.
- **AI Gateway**: Google Gemini 2.5 Flash API with deterministic Python fallback engine.

---

## Service Endpoints & Status

| Component | Target URL | Status | Health Check |
| :--- | :--- | :--- | :--- |
| **Frontend Production Cockpit** | `https://civicpulse-ai-frontend.onrender.com` | `DEPLOYMENT_READY` | SPA Load |
| **Backend REST Gateway** | `https://civicpulse-ai-backend.onrender.com` | `DEPLOYMENT_READY` | `/api/v1/health` |
| **OpenAPI Documentation** | `https://civicpulse-ai-backend.onrender.com/docs` | `DEPLOYMENT_READY` | Swagger UI |

*Note: Production Render URLs are populated upon connecting the repository to Render via `render.yaml` Blueprint.*

---

## Production Health Check Response Format

```json
{
  "status": "healthy",
  "version": "0.5.0",
  "environment": "production",
  "service": "civicpulse-ai-backend",
  "ai_provider": "gemini"
}
```
