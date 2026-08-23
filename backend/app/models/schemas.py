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


class EvidenceType(str, Enum):
    CITIZEN_DEMAND = "citizen_demand"
    INFRASTRUCTURE_GAP = "infrastructure_gap"
    DEMOGRAPHIC_NEED = "demographic_need"
    INVESTMENT_CONTEXT = "investment_context"
    URGENCY = "urgency"
    POPULATION_IMPACT = "population_impact"
    DEMAND_MOMENTUM = "demand_momentum"
    COVERAGE = "coverage"
    ACCESSIBILITY = "accessibility"


class DemandMomentumTrend(str, Enum):
    INCREASING = "INCREASING"
    STABLE = "STABLE"
    DECREASING = "DECREASING"
    EMERGING = "EMERGING"


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
    request_category: str = "Other Civic Need"  # Legacy compatibility
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


class EvidenceItem(BaseModel):
    id: str
    type: str  # citizen_demand, infrastructure_gap, demographic_need, investment_context, urgency, population_impact, demand_momentum, coverage, accessibility
    source: str
    region_id: str
    category: str
    metric: str
    value: float
    normalized_value: float = Field(ge=0.0, le=100.0)
    contribution: float = Field(ge=-100.0, le=100.0)
    confidence: float = Field(ge=0.0, le=1.0, default=0.90)
    explanation: str
    is_synthetic: bool = True

    @field_validator("category", mode="before")
    @classmethod
    def validate_category(cls, v: Any) -> str:
        if isinstance(v, str):
            return normalize_category(v)
        return "other"


class DemandMomentumSignal(BaseModel):
    region_id: str
    category: str
    trend: str  # INCREASING, STABLE, DECREASING, EMERGING
    percentage_change: float
    recent_window_count: int
    previous_window_count: int
    momentum_score: float = Field(ge=0.0, le=100.0)


class InvestmentOverlapDetail(BaseModel):
    has_overlap: bool
    overlap_type: str  # NONE, ACTIVE_PROJECT, PLANNED_PROJECT, DELAYED_PROJECT, COMPLETED_PROJECT
    project_id: str | None = None
    project_name: str | None = None
    project_status: str | None = None
    budget_usd: float | None = 0.0
    geographic_overlap: bool = True
    category_overlap: bool = True
    explanation: str


class EvidenceChainStep(BaseModel):
    step: int
    title: str
    finding: str
    value: str
    contribution: str
    evidence_item_id: str | None = None


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


class WhyThisRecommendation(BaseModel):
    recommendation_id: str
    summary: str
    overall_confidence: float = Field(ge=0.0, le=1.0, default=0.92)
    evidence_chain: list[EvidenceChainStep]
    factors: list[FactorContribution]
    risks: list[str]


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
    evidence_items: list[EvidenceItem] = Field(default_factory=list)
    demand_momentum: DemandMomentumSignal | None = None
    investment_overlap: InvestmentOverlapDetail | None = None
    evidence_chain: list[EvidenceChainStep] = Field(default_factory=list)
    why_this_recommendation: WhyThisRecommendation | None = None
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
    raw_text: str = Field(min_length=1, max_length=10000)
    latitude: float | None = Field(default=None, ge=-90.0, le=90.0)
    longitude: float | None = Field(default=None, ge=-180.0, le=180.0)
    region_id: str | None = None


class ScenarioWhatIfInput(BaseModel):
    region_id: str
    category: str
    budget_allocation_usd: float = Field(ge=0.0)
    policy_urgency_override: str | None = None  # LOW, MEDIUM, HIGH, CRITICAL
    target_coverage_addition_pct: float | None = Field(default=10.0, ge=0.0, le=100.0)


class ScenarioWhatIfResult(BaseModel):
    original_priority_score: float
    simulated_priority_score: float
    score_delta: float
    projected_gap_score: float
    expected_population_beneficiaries: int
    simulation_notes: str


class CopilotChatContext(BaseModel):
    route: str | None = None
    region_id: str | None = None
    category: str | None = None
    project_id: str | None = None
    recommendation_id: str | None = None


class CopilotChatMessage(BaseModel):
    role: str  # user | assistant | system
    content: str = Field(max_length=10000)


class CopilotActionLink(BaseModel):
    label: str
    action_type: str  # navigate | open_modal | run_scenario
    target: str


class CopilotEvidenceRef(BaseModel):
    title: str
    metric: str
    value: str
    link: str | None = None


class CopilotChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=5000)
    conversation_id: str | None = None
    history: list[CopilotChatMessage] = Field(default_factory=list)
    context: CopilotChatContext | None = None


class CopilotChatResponse(BaseModel):
    success: bool = True
    message: str
    ai_provider: str = "gemini"
    grounded: bool = True
    evidence: list[CopilotEvidenceRef] = Field(default_factory=list)
    suggested_actions: list[str] = Field(default_factory=list)
    action_link: CopilotActionLink | None = None

