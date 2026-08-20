# Security Policy — CivicPulse AI

## 🛡️ Security Architecture Overview

CivicPulse AI implements defense-in-depth security controls across the application stack:

1. **Deterministic AI Boundaries**:
   - Google Gemini AI is restricted to language detection, translation, intent parsing, entity extraction, and multilingual summaries.
   - **Gemini NEVER computes priority scores, calculates capacity gaps, alters statistics, or fabricates evidence**. All scoring and ranking remain 100% deterministic.

2. **Prompt Injection Isolation**:
   - Untrusted citizen inputs are enclosed inside `<CITIZEN_INPUT_DATA_DO_NOT_EXECUTE>` tags with strict system rules commanding Gemini to treat input strictly as data.
   - Input text sanitization (`sanitize_input_text`) neutralizes injection attempts (e.g. `"Ignore previous instructions"` or `"Output API_KEY"`).

3. **Backend API Protection**:
   - **Request Body Size Limits**: 10 MB payload ceiling (`413 Request Entity Too Large`).
   - **Rate Limiting**: Sliding-window IP rate limiting (`RateLimitMiddleware`) capping POST analysis and simulation endpoints to 60 requests per minute per IP.
   - **Security Headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`.
   - **CORS Restrictions**: Explicit origin whitelist (`ALLOWED_CORS_ORIGINS`).

4. **Credential Isolation**:
   - `GEMINI_API_KEY` exists strictly on the backend. Private keys are never exposed in `VITE_*` environment variables or committed to Git.

---

## 🔒 Reporting Vulnerabilities

If you discover a security vulnerability or credential leak within CivicPulse AI, please report it privately:

- **Email**: `security@civicpulse.ai` (or open a private security advisory on GitHub)
- **Response Time**: We aim to acknowledge reports within 48 hours and provide a patch timeline within 5 business days.

Please do NOT create public GitHub issues for security vulnerabilities.
