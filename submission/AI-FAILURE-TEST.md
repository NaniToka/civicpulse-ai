# AI Failure & Fallback Audit

## Executive Summary
This document details the failure-mode resilience tests performed on the Google Gemini AI integration.

---

## Simulated Failure Scenarios & System Responses

| Scenario | Simulated Condition | Active Provider | UI Communication | System Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **1. Missing API Key** | `GEMINI_API_KEY=""` in `.env` | `RuleBasedLanguageIntelligenceProvider` | Badge: *"Fallback NLP Mode"* | Application uses script-aware regex & heuristic lookup. 100% operational. |
| **2. Invalid API Key** | `GEMINI_API_KEY="invalid_key_xyz"` | `RuleBasedLanguageIntelligenceProvider` | Badge: *"Fallback NLP Mode"* | Gemini client initialization catches exception and reverts to fallback gracefully. |
| **3. Provider Timeout** | Network delay > 5.0 seconds | `RuleBasedLanguageIntelligenceProvider` | Badge: *"Fallback NLP Mode"* | Request catches timeout and returns rule-based structured signal. No hanging requests. |
| **4. Malformed AI Response** | Non-JSON text returned | `RuleBasedLanguageIntelligenceProvider` | Badge: *"Fallback NLP Mode"* | Retries structured prompt once. If second try fails, falls back cleanly. |
| **5. Provider Unavailable** | HTTP 503 / 500 from Gemini API | `RuleBasedLanguageIntelligenceProvider` | Badge: *"Fallback NLP Mode"* | `_call_and_validate` catches HTTP errors and uses deterministic fallback. |
| **6. Missing Schema Fields** | Partial JSON returned | `RuleBasedLanguageIntelligenceProvider` | Badge: *"Fallback NLP Mode"* | Pydantic validation fails, logging warning and triggering rule-based provider. |

---

## UI Transparency Policy
- When Gemini API is active and successful, the system meta tag reports `"ai_provider": "gemini"`.
- When Gemini API key is missing or fails validation, the system meta tag reports `"ai_provider": "rule_based_fallback"`.
- **Honesty Guarantee**: The UI never claims Gemini succeeded when fallback mode was activated.
