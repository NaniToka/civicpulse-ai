from datetime import datetime, timezone
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field, field_validator

from app.core.taxonomy import normalize_category


class InputSourceEnum(str, Enum):
    VOICE = "voice"
    TEXT = "text"
    MESSAGING = "messaging"
    WEB = "web"
    SURVEY = "survey"
    IMPORTED_DATASET = "imported_dataset"
    # Legacy fallbacks
    WHATSAPP_VOICE = "WhatsApp Voice Note"
    IVR = "IVR Voice Call"
    MOBILE_APP = "Mobile App Text"
    USSD = "USSD Gateway"


class RequestStatusEnum(str, Enum):
    PENDING = "PENDING"
    PROCESSED = "PROCESSED"
    FAILED = "FAILED"


class UrgencyLevelEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class ProjectStatusEnum(str, Enum):
    PROPOSED = "proposed"
    PLANNED = "planned"
    ACTIVE = "active"
    APPROVED = "approved"       # Legacy compatibility
    IN_PROGRESS = "in_progress" # Legacy compatibility
    COMPLETED = "completed"
    DELAYED = "delayed"
    CANCELLED = "cancelled"


class ExtractedEntities(BaseModel):
    location: str | None = None
    severity: str = "MEDIUM"  # LOW, MEDIUM, HIGH, CRITICAL
    impacted_count: int | None = 0
    infrastructure_type: str | None = None
    subcategory: str | None = None


class CitizenRequest(BaseModel):
    id: str
    region_id: str
    source: str = "web"
    language: str = "en"
    original_text: str
    normalized_text: str = ""
    translated_text: str = ""
    category: str = "other"
    request_category: str = "Other Civic Need"  # Legacy compatibility field
    subcategory: str | None = None
    urgency: str = "MEDIUM"
    processing_status: str = "PROCESSED"
    extracted_entities: ExtractedEntities = Field(default_factory=ExtractedEntities)
    latitude: float = 0.0
    longitude: float = 0.0
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    confidence: float = Field(ge=0.0, le=1.0, default=0.85)
    is_synthetic: bool = True
    is_demo: bool = True

    @field_validator("category", mode="before")
    @classmethod
    def validate_category(cls, v: Any) -> str:
        if isinstance(v, str):
            return normalize_category(v)
        return "other"


class Region(BaseModel):
    id: str
    country: str
    country_code: str
    state_province: str
    district_city: str
    latitude: float
    longitude: float
    population: int = Field(ge=0)
    population_density: float | None = Field(default=None, ge=0.0)
    youth_percentage: float | None = Field(default=None, ge=0.0, le=100.0)
    elderly_percentage: float | None = Field(default=None, ge=0.0, le=100.0)
    household_count: int | None = Field(default=None, ge=0)
    urbanization_rate: float | None = Field(default=None, ge=0.0, le=100.0)
    digital_access_rate: float | None = Field(default=None, ge=0.0, le=100.0)
    vulnerability_index: float = Field(ge=0.0, le=1.0)
    primary_language: str
    is_synthetic: bool = True
    is_demo: bool = True


class InfrastructureIndicator(BaseModel):
    id: str
    region_id: str
    category: str
    current_capacity_pct: float = Field(ge=0.0, le=100.0)
    demand_index: float = Field(ge=0.0, le=100.0)
    coverage_ratio_pct: float = Field(ge=0.0, le=100.0)
    gap_score: float = Field(ge=0.0, le=1.0)
    category_specific_metrics: dict[str, Any] | None = None
    last_assessed: str = "2026-Q3"
    is_synthetic: bool = True
    is_demo: bool = True

    @field_validator("category", mode="before")
    @classmethod
    def validate_category(cls, v: Any) -> str:
        if isinstance(v, str):
            return normalize_category(v)
        return "other"


class InvestmentProject(BaseModel):
    id: str
    project_name: str
    region_id: str
    category: str
    budget_usd: float = Field(ge=0.0)
    status: str  # proposed, planned, active, completed, delayed, cancelled, APPROVED, IN_PROGRESS
    planned_start: str
    planned_completion: str | None = None
    expected_capacity_addition: str | None = None
    coverage_area: str | None = None
    is_synthetic: bool = True
    is_demo: bool = True

    @field_validator("category", mode="before")
    @classmethod
    def validate_category(cls, v: Any) -> str:
        if isinstance(v, str):
            return normalize_category(v)
        return "other"


class EvidenceCard(BaseModel):
    demand_signal_summary: str
    infrastructure_deficit_summary: str
    demographic_impact_summary: str
    investment_status_summary: str
    data_sources: list[str]


class FactorContribution(BaseModel):
    name: str
    raw_value: float
    weight: float
    contribution: float
    explanation: str


class ExplanationDetails(BaseModel):
    recommendation_id: str
    region_id: str
    region_name: str
    category: str
    priority_score: float
    priority_level: str  # CRITICAL, HIGH, MEDIUM, LOW
    factors: list[FactorContribution]
    risks: list[str]
    existing_investment_context: str
    estimated_population_impact: int
    recommended_action: str


class PriorityRecommendation(BaseModel):
    id: str
    region_id: str
    region_name: str
    category: str
    priority_score: float = Field(ge=0.0, le=100.0)
    priority_level: str = "MEDIUM"
    confidence: float = Field(ge=0.0, le=1.0)
    evidence_card: EvidenceCard
    explanation_details: ExplanationDetails | None = None
    reasoning: str
    expected_impact: str
    recommended_action: str
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_synthetic: bool = True
    is_demo: bool = True


class StructuredAIOutput(BaseModel):
    language: str
    category: str
    subcategory: str | None = None
    intent: str
    location: str | None = None
    urgency: str = "MEDIUM"  # LOW, MEDIUM, HIGH, CRITICAL
    entities: list[str] = Field(default_factory=list)
    summary: str
    confidence: float = Field(ge=0.0, le=1.0, default=0.85)

    @field_validator("category", mode="before")
    @classmethod
    def validate_category(cls, v: Any) -> str:
        if isinstance(v, str):
            return normalize_category(v)
        return "other"

    @field_validator("urgency", mode="before")
    @classmethod
    def validate_urgency(cls, v: Any) -> str:
        if isinstance(v, str) and v.upper() in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]:
            return v.upper()
        return "MEDIUM"


class DemandAggregationSummary(BaseModel):
    total_requests: int
    unique_sources: int
    category_distribution: dict[str, int]
    urgency_distribution: dict[str, int]
    regional_demand: dict[str, int]
    language_distribution: dict[str, int]


class DemandHotspot(BaseModel):
    region_id: str
    region_name: str
    country: str
    category: str
    raw_request_count: int
    weighted_demand_signal: float
    per_capita_demand_per_100k: float
    population: int
    infrastructure_gap_score: float
    vulnerability_index: float
    hotspot_score: float = Field(ge=0.0, le=100.0)


class CitizenRequestIngestInput(BaseModel):
    source: str = "web"
    language: str = "auto"
    raw_text: str
    latitude: float | None = None
    longitude: float | None = None
    region_id: str | None = None


class ScenarioWhatIfInput(BaseModel):
    region_id: str
    category: str
    budget_allocation_usd: float = Field(ge=0.0)
    policy_urgency_override: str | None = None  # LOW, MEDIUM, HIGH, CRITICAL
    target_coverage_addition_pct: float | None = 10.0


class ScenarioWhatIfResult(BaseModel):
    original_priority_score: float
    simulated_priority_score: float
    score_delta: float
    projected_gap_score: float
    expected_population_beneficiaries: int
    simulation_notes: str
