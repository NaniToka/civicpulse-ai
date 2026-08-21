# CivicPulse AI — Security Architecture Story

---

## 🔒 End-to-End Security Controls

Security and threat defense are designed into the core architecture of CivicPulse AI:

1. **Prompt Injection Defense**: Citizen inputs are enclosed inside `<CITIZEN_INPUT_DATA_DO_NOT_EXECUTE>` tags in system prompts. `sanitize_input_text` neutralizes system override commands (`"Ignore previous instructions"`).
2. **Payload Size Caps**: Enforces a 10MB payload ceiling (`MAX_BODY_SIZE_BYTES=10485760`) to prevent denial-of-service memory exhaustion.
3. **Sliding-Window IP Rate Limiting**: `RateLimitMiddleware` caps sensitive POST analysis and scenario simulation endpoints to 60 requests per minute per IP.
4. **Security Headers**: Standard headers injected on all API responses (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`).
5. **CORS Restrictions**: Configurable CORS whitelist (`ALLOWED_CORS_ORIGINS`).
6. **Container Security**: Non-root security user (`civicpulse`) in Uvicorn backend containers.
7. **Secret Isolation**: Zero credentials embedded in source code or frontend bundles. API keys exist strictly in backend environment variables.
