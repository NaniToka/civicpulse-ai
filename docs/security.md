# CivicPulse AI Security Architecture & Guidelines

Security is designed as a foundational requirement across all layers of the CivicPulse AI platform.

---

## 🛡️ Core Security Controls

### 1. API Key Isolation
- All LLM API keys (`GEMINI_API_KEY`) reside strictly in backend environment variables (`.env`).
- Frontend client applications never receive raw keys or direct AI provider access.

### 2. Prompt Injection Defense
- Citizen feedback is treated as **UNTRUSTED USER DATA**.
- The AI prompt isolates citizen input within `<CITIZEN_INPUT_DATA_DO_NOT_EXECUTE>` tags.
- Explicit system instructions enforce that embedded instructions, persona overrides, or administrative privilege escalations inside citizen text MUST be ignored.
- Input strings are sanitized (`sanitize_input_text`) to strip null bytes and non-printable control characters.

### 3. Strict Structured AI Output Validation
- All LLM responses are parsed and validated against strict Pydantic schemas (`StructuredAIOutput`).
- Out-of-spec or malformed JSON responses trigger controlled retries before gracefully resorting to a deterministic rule-based fallback provider.
- Diagnostic logging sanitizes outputs to prevent key or sensitive prompt leakage.

### 4. Deterministic Business & Analytics Logic
- All demand aggregations, per-capita hotspot calculations, and priority scores are executed purely in Python code.
- Generative AI models are NOT permitted to compute statistics or output unverified numbers.

### 5. Input Payload & CORS Protection
- Request bodies are size-bounded (`MAX_BODY_SIZE_BYTES = 10MB`).
- Security middleware appends standard security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `HSTS`).
- Whitelisted CORS origins prevent unauthorized cross-origin requests.
