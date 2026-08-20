# CivicPulse AI Security Architecture & Guidelines

Security is designed as a foundational requirement across all layers of the CivicPulse AI platform.

## Key Security Foundations

### 1. API Key Protection
* All AI keys (e.g. `GEMINI_API_KEY`) reside exclusively in backend environment settings (`.env`).
* No frontend bundle or client code ever imports or receives access to raw LLM keys.
* If `GEMINI_API_KEY` is omitted, the system defaults gracefully to an internal heuristic fallback engine without exposing stack traces or error keys.

### 2. Input Validation & Prompt Injection Defense
* All REST request bodies are strictly parsed and validated using Pydantic v2 schemas before processing.
* Raw text inputs are sanitized to strip malicious control characters and prompt injection attempts before reaching the LLM service.
* Standard payload limits (`MAX_BODY_SIZE_BYTES = 10MB`) prevent Denial of Service (DoS) attempts.

### 3. AI Output Validation
* Generative model outputs are strictly constrained to JSON schemas.
* Out-of-spec LLM outputs are caught and validated against Pydantic models before being persisted or returned to clients.

### 4. CORS & Safe Security Headers
* Whitelisted CORS origins (`ALLOWED_CORS_ORIGINS`) prevent unauthorized cross-origin requests.
* Security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`) are added to all FastAPI response objects.

### 5. Dependency & Supply Chain Hygiene
* Automated CI checks audit dependencies.
* Standard non-root execution profiles for containerized deployments.
