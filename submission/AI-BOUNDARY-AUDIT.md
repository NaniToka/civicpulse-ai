# AI Boundary Audit: Gemini vs. Deterministic Architecture

## Executive Summary
This document establishes the strict architectural boundary between Google Gemini AI (LLM) and deterministic Python code in CivicPulse AI.

---

## Architectural Responsibility Matrix

| Capability / Calculation | Handled By | Implementation Location | Method / Logic |
| :--- | :--- | :--- | :--- |
| Script & Language Detection | **Google Gemini** / Script Fallback | `backend/app/services/ai_service.py` | Regex Unicode scripts + Gemini prompt |
| Text Translation & Normalization | **Google Gemini** / Keyword Fallback | `backend/app/services/ai_service.py` | Structured LLM prompt (`summary` field) |
| Civic Intent Classification | **Google Gemini** / Keyword Fallback | `backend/app/services/ai_service.py` | Controlled taxonomy (`CivicIntent`) |
| Entity & Urgency Extraction | **Google Gemini** / Keyword Fallback | `backend/app/services/ai_service.py` | Pydantic `StructuredAIOutput` schema |
| Multilingual Reasoning Briefs | **Google Gemini** / Rule Brief Fallback | `backend/app/services/ai_service.py` | Zero-shot localized text generation |
| **Population Normalization** | **Deterministic Python** | `backend/app/services/hotspot_engine.py` | $(S_{\text{raw}} / \text{Pop}) \times 100,000$ per-capita scaling |
| **Infrastructure Deficit Scoring** | **Deterministic Python** | `backend/app/services/scoring_engine.py` | Capacity gap index $(0.0 - 1.0) \times 100$ |
| **30-Day Demand Velocity** | **Deterministic Python** | `backend/app/services/demand_momentum.py` | Temporal window percentage change |
| **Demographic Vulnerability** | **Deterministic Python** | `backend/app/services/demographic_service.py` | Youth + elderly census weighting formula |
| **Capital Investment Overlap** | **Deterministic Python** | `backend/app/services/investment_service.py` | Status matching + duplicate penalty rule |
| **Priority Score Calculation** | **Deterministic Python** | `backend/app/services/scoring_engine.py` | $V_2$ Weighted 8-Factor Math Formula |
| **Counterfactual Scenario Simulation** | **Deterministic Python** | `backend/app/services/scenario_service.py` | Investment coverage curve simulation |

---

## Architectural Guarantees
1. **Gemini CANNOT invent priority scores**: `StructuredAIOutput` does not contain any score fields.
2. **Gemini CANNOT alter ranking orders**: Priority rankings are produced strictly by sorting mathematical floats in Python (`ScoringEngineV2`).
3. **Gemini output is validated by Pydantic**: Any malformed JSON or out-of-bounds confidence score causes an immediate fallback to `RuleBasedLanguageIntelligenceProvider`.
