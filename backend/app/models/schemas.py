from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field


class ExtractedEntities(BaseModel):
    location: Optional[str] = None
    severity: str = "MEDIUM"  # LOW, MEDIUM, HIGH, CRITICAL
    impacted_count: Optional[int] = 0
    infrastructure_type: Optional[str] = None


class CitizenRequest(BaseModel):
    id: str
    region_id: str
    source: str
    language: str
    original_text: str
    translated_text: str
    request_category: str
    extracted_entities: ExtractedEntities
    latitude: float
    longitude: float
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    confidence: float = Field(ge=0.0, le=1.0, default=0.85)
    is_demo: bool = True


class Region(BaseModel):
    id: str
    country: str
    country_code: str
    state_province: str
    district_city: str
    latitude: float
    longitude: float
    population: int
    vulnerability_index: float = Field(ge=0.0, le=1.0)
    primary_language: str
    is_demo: bool = True


class InfrastructureIndicator(BaseModel):
    id: str
    region_id: str
    category: str
    current_capacity_pct: float
    demand_index: float
    coverage_ratio_pct: float
    gap_score: float = Field(ge=0.0, le=1.0)
    last_assessed: str
    is_demo: bool = True


class InvestmentProject(BaseModel):
    id: str
    project_name: str
    region_id: str
    category: str
    budget_usd: float
    status: str  # PLANNED, APPROVED, IN_PROGRESS, COMPLETED
    planned_start: str
    expected_capacity_addition: Optional[str] = None
    is_demo: bool = True


class EvidenceCard(BaseModel):
    demand_signal_summary: str
    infrastructure_deficit_summary: str
    demographic_impact_summary: str
    investment_status_summary: str
    data_sources: List[str]


class PriorityRecommendation(BaseModel):
    id: str
    region_id: str
    region_name: str
    category: str
    priority_score: float = Field(ge=0.0, le=100.0)
    confidence: float = Field(ge=0.0, le=1.0)
    evidence_card: EvidenceCard
    reasoning: str
    expected_impact: str
    recommended_action: str
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_demo: bool = True


class CitizenRequestIngestInput(BaseModel):
    source: str = "Web Intake"
    language: str = "auto"
    raw_text: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    region_id: Optional[str] = None


class ScenarioWhatIfInput(BaseModel):
    region_id: str
    category: str
    budget_allocation_usd: float
    policy_urgency_override: Optional[str] = None  # LOW, MEDIUM, HIGH, CRITICAL
    target_coverage_addition_pct: Optional[float] = 10.0


class ScenarioWhatIfResult(BaseModel):
    original_priority_score: float
    simulated_priority_score: float
    score_delta: float
    projected_gap_score: float
    expected_population_beneficiaries: int
    simulation_notes: str
