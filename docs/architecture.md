# CivicPulse AI Architecture

## Overview
CivicPulse AI is structured as a decoupled monorepo containing a Python/FastAPI backend and a React/TypeScript frontend. It acts as a Digital Public Good decision-support tool for infrastructure planning across BRICS nations.

```
       +-------------------------------------------------------------+
       |                  Citizen Feedback Ingress                   |
       |         (Voice Notes, SMS/USSD, Mobile Apps, Web)           |
       +-------------------------------------------------------------+
                                      |
                                      v
       +-------------------------------------------------------------+
       |                     FastAPI Backend API                     |
       |                (/api/v1/ingest, /api/v1/predict)             |
       +-------------------------------------------------------------+
                                      |
                 +--------------------+--------------------+
                 |                                         |
                 v                                         v
       +-------------------+                     +-------------------+
       |   Gemini AI Service|                     |   Scoring Engine  |
       | (Language, Entity |                     |  (Deterministic   |
       |  Classification,  |                     |  Multi-Factor     |
       |  Summarization)   |                     |  Prioritization)  |
       +-------------------+                     +-------------------+
                 |                                         |
                 +--------------------+--------------------+
                                      |
                                      v
       +-------------------------------------------------------------+
       |                     PostgreSQL / PostGIS                    |
       |             (Regions, Indicators, Investments,              |
       |                 Requests, Priority Cards)                   |
       +-------------------------------------------------------------+
                                      |
                                      v
       +-------------------------------------------------------------+
       |                   React / Vite / Tailwind UI                |
       |           (Decision Dashboard & Policy Cockpit)             |
       +-------------------------------------------------------------+
```

## Modular Service Layers

### 1. Ingestion & Multilingual AI (`app/services/ai_service.py`)
* Abstract Interface `AIService` wraps the Gemini API (`google-genai` SDK).
* Handles translation from native regional languages (Hindi, Zulu, Marathi, Portuguese, etc.) into structured English request schemas.
* Extracts key entities (`location`, `severity`, `impacted_count`, `infrastructure_type`).
* **Graceful Fallback**: If `GEMINI_API_KEY` is not present, the `FallbackAIService` seamlessly parses incoming text using rule-based heuristic fallback models, ensuring 100% demo stability offline.

### 2. Prioritization Engine (`app/services/scoring_engine.py`)
* Fully deterministic, mathematical scoring function.
* Blends five positive demand drivers (Citizen Signal, Deficit Index, Population Impact, Demographic Vulnerability, Urgency) against two risk modifiers (Existing Coverage, Duplicate Investment Risk).
* Generates reproducible priority scores on a 0-100 scale alongside human-readable evidence strings.

### 3. Data Storage & Schema Design (`app/models/schemas.py`)
* Strongly typed Pydantic models for request validation.
* Geospatial ready (Latitude/Longitude coordinates ready for PostGIS `ST_DWithin` and spatial indexing).
