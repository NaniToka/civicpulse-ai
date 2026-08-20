# CivicPulse AI Data Model & Schema Specification

> **Synthetic Data Disclaimer**: All seed data files (`data/seed/*.json`) and demonstration API responses contain synthetic data created solely for prototyping and verification purposes, explicitly flagged with `"is_synthetic": true` / `"is_demo": true`.

---

## Core Entities & Schemas

### 1. `CitizenRequest`
Represents an individual citizen demand signal.
- `id` (`str`): Unique request ID (e.g. `REQ-IND-UP-001`).
- `region_id` (`str`, FK -> `Region.id`).
- `source` (`str`): Ingestion channel (`voice`, `text`, `messaging`, `web`, `survey`, `imported_dataset`).
- `language` (`str`): BCP-47 tag (e.g. `hi`, `mr`, `pt`, `zu`, `bn`, `en`).
- `original_text` (`str`): Raw input text.
- `normalized_text` (`str`): English translation or normalized summary.
- `category` (`str`): Normalized taxonomy key (e.g. `water`, `healthcare`, `electricity`).
- `subcategory` (`str`, Optional): Detailed deficit type.
- `urgency` (`str`): `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
- `processing_status` (`str`): `PENDING`, `PROCESSED`, `FAILED`.
- `extracted_entities` (`ExtractedEntities`): Location, severity, impacted count, infrastructure type.
- `confidence` (`float`): Extraction confidence (0.0 to 1.0).
- `is_synthetic` (`bool`): Transparency flag (`true`).

### 2. `Region`
Administrative region with demographic indicators.
- `id` (`str`): Regional identifier (e.g. `REG-IND-UP-KANP-02`).
- `country`, `country_code`, `state_province`, `district_city` (`str`).
- `population` (`int`): Resident census count.
- `population_density` (`float`): Residents per km².
- `youth_percentage`, `elderly_percentage` (`float`): Age demographic metrics.
- `household_count` (`int`).
- `vulnerability_index` (`float`): Socioeconomic vulnerability score (0.0 to 1.0).
- `primary_language` (`str`).

### 3. `InfrastructureIndicator`
Sector-specific capacity metrics.
- `id` (`str`).
- `region_id` (`str`).
- `category` (`str`): Controlled taxonomy key.
- `current_capacity_pct` (`float`).
- `demand_index` (`float`).
- `coverage_ratio_pct` (`float`).
- `gap_score` (`float`): Infrastructure deficit score (0.0 to 1.0).
- `category_specific_metrics` (`dict`): Detailed indicators (e.g. `hospital_capacity_beds_per_1k`, `clean_water_access_pct`).

### 4. `InvestmentProject`
Public investment project records.
- `id` (`str`).
- `project_name` (`str`).
- `region_id` (`str`).
- `category` (`str`).
- `budget_usd` (`float`).
- `status` (`str`): `proposed`, `planned`, `active`, `completed`, `delayed`, `cancelled`.
- `planned_start`, `planned_completion` (`str`).

### 5. `DemandHotspot`
Normalized demand concentration signal.
- `region_id`, `region_name`, `country`, `category` (`str`).
- `raw_request_count` (`int`).
- `weighted_demand_signal` (`float`).
- `per_capita_demand_per_100k` (`float`).
- `hotspot_score` (`float`): 0.0 to 100.0.

### 6. `ExplanationDetails` & `FactorContribution`
Machine-readable explainability schema powering "Why this recommendation?".
- `recommendation_id`, `region_id`, `region_name`, `category` (`str`).
- `priority_score` (`float`), `priority_level` (`str`).
- `factors` (`list[FactorContribution]`): Factor name, raw value, weight, contribution, explanation.
- `risks` (`list[str]`): Risk warnings.
- `estimated_population_impact` (`int`).
