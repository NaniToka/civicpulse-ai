# CivicPulse AI — Technical Summary

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Python 3.12, FastAPI, Pydantic v2, Pytest, Uvicorn.
- **AI Engine**: Google Gemini (`google-genai` SDK / `gemini-2.5-flash`) + Script-Aware `RuleBasedLanguageIntelligenceProvider` fallback.
- **Containerization**: Multi-stage Nginx static container + Non-root Uvicorn FastAPI container (`docker-compose.yml`).

---

## 🔒 Security Controls & Responsible AI
- **Prompt Injection Defense**: Citizen inputs enclosed inside `<CITIZEN_INPUT_DATA_DO_NOT_EXECUTE>` tags; `sanitize_input_text` neutralizes system overrides.
- **Payload Limits**: 10MB request ceiling (`MAX_BODY_SIZE_BYTES=10485760`).
- **Rate Limiting**: Sliding-window IP rate limiter (`RateLimitMiddleware`) capping analysis & simulation endpoints to 60 req/min/IP.
- **Security Headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`.
- **Zero Credentials**: Environment variable isolation; zero secrets committed to Git.
