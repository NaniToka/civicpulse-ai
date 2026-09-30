import time
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.config import settings
from app.core.security import validate_request_size
from app.core.taxonomy import (
    CivicCategory,
    get_all_categories,
    get_category_display_name,
    normalize_category,
)
from app.models.schemas import (
    CitizenRequest,
    CitizenRequestIngestInput,
    ClosureVerificationResult,
    CopilotChatRequest,
    CopilotChatResponse,
    DemandAggregationSummary,
    DemandHotspot,
    DemandMomentumSignal,
    ExtractedEntities,
    GrievanceRecord,
    GrievanceResolutionEvidence,
    GrievanceStatusEnum,
    InfrastructureIndicator,
    InvestmentOverlapDetail,
    InvestmentProject,
    PriorityRecommendation,
    Region,
    ResolvePendingInput,
    ScenarioWhatIfInput,
    ScenarioWhatIfResult,
    StructuredAIOutput,
    VerifyClosureInput,
    WhyThisRecommendation,
)
from app.services.ai_service import get_ai_service
from app.services.closure_validation_service import validate_closure_authenticity
from app.services.copilot_service import copilot_service
from app.services.data_loader import data_loader
from app.services.demand_engine import demand_aggregation_service
from app.services.demand_momentum import demand_momentum_engine
from app.services.grievance_store import (
    create_grievance,
    get_grievance,
    get_grievance_by_request_id,
    list_grievances,
    update_grievance,
)
from app.services.hotspot_engine import hotspot_engine
from app.services.investment_service import investment_overlap_engine
from app.services.location_service import location_service
from app.services.recommendation_service import recommendation_service
from app.services.scenario_service import scenario_simulation_service

router = APIRouter(prefix="/api/v1")


@router.get("/health", summary="System Health Check")
async def health_check():
    ai_configured = bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY.strip())
    return {
        "status": "healthy",
        "service": "CivicPulse AI Backend Intelligence Engine",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "ai_provider": "gemini" if ai_configured else "rule_based_fallback",
        "ai_status": "active" if ai_configured else "unconfigured_fallback",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.post("/demo/reset", summary="Reset In-Memory Demonstration Signals")
async def reset_demo_environment():
    cleared_count = data_loader.reset_demo_state()
    return {
        "success": True,
        "message": f"Demo environment successfully reset. Cleared {cleared_count} in-memory signals.",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/categories", response_model=list[CivicCategory], summary="Get Controlled Civic Taxonomy Categories")
async def list_categories():
    return get_all_categories()


@router.get("/regions", response_model=list[Region], summary="List Target Regions with Demographics")
async def list_regions():
    return data_loader.get_regions()


@router.get("/regions/{region_id}", response_model=Region, summary="Get Single Region Details")
async def get_region(region_id: str):
    regions = data_loader.get_regions()
    region = next((r for r in regions if r.id == region_id), None)
    if not region:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Region '{region_id}' not found")
    return region


@router.get("/citizen-requests", response_model=list[CitizenRequest], summary="List Citizen Demands with Filters")
@router.get("/requests", response_model=list[CitizenRequest], summary="List Citizen Demands (Legacy Route)", include_in_schema=False)
async def list_citizen_requests(
    region_id: str | None = Query(None, description="Filter by Region ID"),
    category: str | None = Query(None, description="Filter by Taxonomy Category"),
    source: str | None = Query(None, description="Filter by Input Source Channel"),
):
    requests = data_loader.get_citizen_requests()
    if region_id:
        requests = [r for r in requests if r.region_id == region_id]
    if category:
        norm_cat = normalize_category(category)
        requests = [r for r in requests if normalize_category(r.category or r.request_category) == norm_cat]
    if source:
        requests = [r for r in requests if r.source.lower() == source.lower()]
    return requests


@router.post(
    "/citizen-requests/analyze",
    summary="Analyze Multilingual Citizen Text for Structured Intelligence",
    dependencies=[Depends(validate_request_size)]
)
async def analyze_citizen_request(payload: CitizenRequestIngestInput):
    start_time = time.time()
    ai_service = get_ai_service()
    ai_output: StructuredAIOutput = await ai_service.process_citizen_text(payload.raw_text, payload.language or "auto")

    elapsed_ms = round((time.time() - start_time) * 1000, 2)
    ai_provider = "gemini" if bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY.strip()) else "rule_based_fallback"

    return {
        "success": True,
        "data": {
            "analysis": ai_output.model_dump(),
            "raw_text": payload.raw_text,
        },
        "meta": {
            "ai_provider": ai_provider,
            "processing_mode": "ai_enriched" if ai_provider == "gemini" else "deterministic_fallback",
            "processing_time_ms": elapsed_ms,
        }
    }


@router.post(
    "/citizen-requests",
    response_model=CitizenRequest,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest & Classify Multilingual Citizen Feedback",
    dependencies=[Depends(validate_request_size)]
)
@router.post(
    "/ingest",
    response_model=CitizenRequest,
    summary="Ingest Multilingual Citizen Feedback (Legacy Route)",
    include_in_schema=False,
    dependencies=[Depends(validate_request_size)]
)
async def ingest_citizen_request(payload: CitizenRequestIngestInput):
    ai_service = get_ai_service()
    ai_output = await ai_service.process_citizen_text(payload.raw_text, payload.language or "auto")

    regions = data_loader.get_regions()
    resolved_region = None

    if payload.latitude is not None and payload.longitude is not None:
        resolved_region = location_service.resolve_region_by_coordinates(payload.latitude, payload.longitude, regions)
    elif payload.region_id:
        resolved_region = next((r for r in regions if r.id == payload.region_id), None)
    elif ai_output.location:
        resolved_region = location_service.resolve_region_by_text(ai_output.location, regions)

    if not resolved_region:
        resolved_region = regions[0] if regions else None

    region_id = resolved_region.id if resolved_region else "REG-IND-UP-KANP-02"
    lat = payload.latitude or (resolved_region.latitude if resolved_region else 26.4499)
    lon = payload.longitude or (resolved_region.longitude if resolved_region else 80.3319)

    cat_canonical = normalize_category(ai_output.category)
    cat_display = get_category_display_name(cat_canonical)

    new_request = CitizenRequest(
        id=f"REQ-USER-{uuid.uuid4().hex[:6].upper()}",
        region_id=region_id,
        source=payload.source or "text",
        language=ai_output.language or payload.language or "en",
        original_text=payload.raw_text,
        normalized_text=ai_output.summary or payload.raw_text,
        translated_text=ai_output.summary or payload.raw_text,
        category=cat_canonical,
        request_category=cat_display,
        subcategory=ai_output.subcategory or f"{cat_display} Deficit",
        urgency=ai_output.urgency,
        processing_status="PROCESSED",
        extracted_entities=ExtractedEntities(
            location=ai_output.location or (resolved_region.district_city if resolved_region else "Unspecified"),
            severity=ai_output.urgency,
            impacted_count=100,
            infrastructure_type=cat_display,
            subcategory=ai_output.subcategory,
        ),
        latitude=lat,
        longitude=lon,
        timestamp=datetime.now(timezone.utc),
        confidence=ai_output.confidence,
        is_synthetic=False,
        is_demo=False,
    )

    data_loader.add_citizen_request(new_request)
    return new_request


@router.get("/demand/summary", response_model=DemandAggregationSummary, summary="Get Aggregated Demand Statistics")
async def get_demand_summary(region_id: str | None = Query(None, description="Optional Region Filter")):
    requests = data_loader.get_citizen_requests()
    return demand_aggregation_service.aggregate_demand(requests, region_id=region_id)


@router.get("/demand/hotspots", response_model=list[DemandHotspot], summary="Detect Demand Hotspots")
async def get_demand_hotspots(category: str | None = Query(None, description="Optional Category Filter")):
    regions = data_loader.get_regions()
    requests = data_loader.get_citizen_requests()
    indicators = data_loader.get_infrastructure_indicators()
    return hotspot_engine.detect_hotspots(regions, requests, indicators, category_filter=category)


@router.get("/demand/trends", response_model=list[DemandMomentumSignal], summary="Get Demand Momentum Velocity Signals")
async def get_demand_trends(
    region_id: str | None = Query(None, description="Optional Region Filter"),
    category: str | None = Query(None, description="Optional Category Filter"),
):
    regions = data_loader.get_regions()
    requests = data_loader.get_citizen_requests()
    indicators = data_loader.get_infrastructure_indicators()

    signals: list[DemandMomentumSignal] = []
    target_regions = [r for r in regions if r.id == region_id] if region_id else regions
    target_categories = [normalize_category(category)] if category else list({normalize_category(i.category) for i in indicators})

    for r in target_regions:
        for cat in target_categories:
            signal = demand_momentum_engine.calculate_momentum(r.id, cat, requests)
            signals.append(signal)

    return signals


@router.get("/infrastructure/gaps", response_model=list[InfrastructureIndicator], summary="List Infrastructure Gap Indicators")
@router.get("/indicators", response_model=list[InfrastructureIndicator], summary="List Infrastructure Gap Indicators (Legacy)", include_in_schema=False)
async def list_infrastructure_gaps(
    region_id: str | None = Query(None, description="Filter by Region ID"),
    category: str | None = Query(None, description="Filter by Category"),
):
    indicators = data_loader.get_infrastructure_indicators()
    if region_id:
        indicators = [i for i in indicators if i.region_id == region_id]
    if category:
        norm_cat = normalize_category(category)
        indicators = [i for i in indicators if normalize_category(i.category) == norm_cat]
    return indicators


@router.get("/investments", response_model=list[InvestmentProject], summary="List National Capital Investments")
async def list_investments(
    region_id: str | None = Query(None, description="Filter by Region ID"),
    category: str | None = Query(None, description="Filter by Category"),
):
    investments = data_loader.get_investment_projects()
    if region_id:
        investments = [inv for inv in investments if inv.region_id == region_id]
    if category:
        norm_cat = normalize_category(category)
        investments = [inv for inv in investments if normalize_category(inv.category) == norm_cat]
    return investments


@router.get("/investments/overlaps", response_model=list[InvestmentOverlapDetail], summary="Detect Investment Overlaps & Status Alignment")
async def get_investment_overlaps(
    region_id: str | None = Query(None, description="Optional Region Filter"),
    category: str | None = Query(None, description="Optional Category Filter"),
):
    regions = data_loader.get_regions()
    investments = data_loader.get_investment_projects()
    indicators = data_loader.get_infrastructure_indicators()

    overlaps: list[InvestmentOverlapDetail] = []
    target_regions = [r for r in regions if r.id == region_id] if region_id else regions
    target_categories = [normalize_category(category)] if category else list({normalize_category(i.category) for i in indicators})

    for r in target_regions:
        for cat in target_categories:
            detail = investment_overlap_engine.evaluate_investment_overlap(r.id, cat, investments)
            overlaps.append(detail)

    return overlaps


@router.get("/recommendations/ranked", response_model=list[PriorityRecommendation], summary="List Ranked Recommendations with Evidence Graphs")
@router.get("/recommendations", response_model=list[PriorityRecommendation], summary="Generate Priority Recommendations")
async def get_recommendations():
    regions = data_loader.get_regions()
    indicators = data_loader.get_infrastructure_indicators()
    requests = data_loader.get_citizen_requests()
    investments = data_loader.get_investment_projects()

    return recommendation_service.generate_all_ranked_recommendations(
        regions=regions,
        indicators=indicators,
        requests=requests,
        investments=investments,
    )


@router.get("/recommendations/{recommendation_id}", response_model=PriorityRecommendation, summary="Get Priority Recommendation by ID")
async def get_recommendation_by_id(recommendation_id: str):
    recs = await get_recommendations()
    rec = next((r for r in recs if r.id == recommendation_id), None)
    if not rec:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Recommendation '{recommendation_id}' not found")
    return rec


@router.get("/recommendations/{recommendation_id}/explain", response_model=WhyThisRecommendation, summary="Get 'Why This Recommendation?' Evidence Trail")
@router.get("/evidence/{recommendation_id}", response_model=WhyThisRecommendation, summary="Get Civic Evidence Graph Trail for Recommendation")
async def get_recommendation_explanation(
    recommendation_id: str,
    target_language: str = Query("en", description="Target Language for AI Brief (en, hi, te)"),
):
    recs = await get_recommendations()
    rec = next((r for r in recs if r.id == recommendation_id), None)
    if not rec or not rec.why_this_recommendation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Evidence trail for recommendation '{recommendation_id}' not found")

    ai_service = get_ai_service()
    ai_summary = await ai_service.generate_evidence_explanation(rec.why_this_recommendation, target_language=target_language)
    rec.why_this_recommendation.summary = ai_summary

    return rec.why_this_recommendation


@router.post("/scenarios", response_model=ScenarioWhatIfResult, summary="Execute Counterfactual Policy Simulation")
@router.post("/scenario/what-if", response_model=ScenarioWhatIfResult, summary="Execute What-If Policy Simulation (Legacy)", include_in_schema=False)
async def scenario_what_if(payload: ScenarioWhatIfInput):
    regions = data_loader.get_regions()
    region = next((r for r in regions if r.id == payload.region_id), None)
    if not region:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Region '{payload.region_id}' not found")

    cat_canonical = normalize_category(payload.category)
    indicators = data_loader.get_infrastructure_indicators()
    ind = next((i for i in indicators if i.region_id == payload.region_id and normalize_category(i.category) == cat_canonical), None)
    requests = data_loader.get_citizen_requests()
    investments = data_loader.get_investment_projects()

    return scenario_simulation_service.simulate_scenario(
        payload=payload,
        region=region,
        indicator=ind,
        requests=requests,
        investments=investments,
    )


@router.post(
    "/copilot/chat",
    response_model=CopilotChatResponse,
    summary="Execute Grounded Civic Intelligence Copilot Query",
    dependencies=[Depends(validate_request_size)],
)
async def copilot_chat(payload: CopilotChatRequest):
    return await copilot_service.process_chat(payload)


# ─────────────────────────────────────────────────────────────────────────────
# CITIZEN-VERIFIED RESOLUTION LOOP — ANTI-FAKE CLOSURE ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────

@router.get(
    "/issues",
    response_model=list[GrievanceRecord],
    summary="List All Grievance Records with Lifecycle Status",
)
async def list_grievance_records(
    status_str: str | None = Query(None, alias="status", description="Filter by GrievanceStatusEnum value"),
    region_id: str | None = Query(None, description="Filter by Region ID"),
):
    """Returns all grievance records, optionally filtered by status and/or region."""
    status_filter: GrievanceStatusEnum | None = None
    if status_str:
        try:
            status_filter = GrievanceStatusEnum(status_str.upper())
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid status '{status_str}'. Valid values: {[s.value for s in GrievanceStatusEnum]}",
            )
    return list_grievances(status=status_filter, region_id=region_id)


@router.get(
    "/issues/{grievance_id}",
    response_model=GrievanceRecord,
    summary="Get Single Grievance Record by ID",
)
async def get_grievance_record(grievance_id: str):
    """Returns a single GrievanceRecord by its ID."""
    record = get_grievance(grievance_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Grievance '{grievance_id}' not found.",
        )
    return record


@router.post(
    "/issues/{grievance_id}/resolve-pending",
    response_model=GrievanceRecord,
    status_code=status.HTTP_200_OK,
    summary="[Staff] Submit Resolution Evidence — Transition to RESOLVED_PENDING_VERIFICATION",
)
async def resolve_pending(
    grievance_id: str,
    payload: ResolvePendingInput,
    _: None = Depends(validate_request_size),
):
    """
    Municipal staff endpoint: transitions a grievance from OPEN/IN_PROGRESS to
    RESOLVED_PENDING_VERIFICATION, attaching closure notes and optional after-image.

    State transitions allowed:
      OPEN → RESOLVED_PENDING_VERIFICATION
      IN_PROGRESS → RESOLVED_PENDING_VERIFICATION
      REJECTED_REOPENED → RESOLVED_PENDING_VERIFICATION  (re-submission after rejection)
    """
    record = get_grievance(grievance_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Grievance '{grievance_id}' not found.",
        )

    allowed_from = {
        GrievanceStatusEnum.OPEN,
        GrievanceStatusEnum.IN_PROGRESS,
        GrievanceStatusEnum.REJECTED_REOPENED,
    }
    if record.status not in allowed_from:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"Cannot submit resolution for grievance in '{record.status.value}' state. "
                f"Allowed from: {[s.value for s in allowed_from]}."
            ),
        )

    # Fetch existing evidence to preserve the before-image and original description
    existing_evidence = record.resolution_evidence

    record.resolution_evidence = GrievanceResolutionEvidence(
        # Preserve original citizen evidence if already set
        before_image_url=(
            existing_evidence.before_image_url if existing_evidence else None
        ),
        original_description=(
            existing_evidence.original_description
            if existing_evidence
            else "Original complaint text not available."
        ),
        original_category=(
            existing_evidence.original_category if existing_evidence else "other"
        ),
        original_urgency=(
            existing_evidence.original_urgency if existing_evidence else "MEDIUM"
        ),
        original_submitted_at=(
            existing_evidence.original_submitted_at
            if existing_evidence
            else record.created_at
        ),
        # New staff resolution evidence
        after_image_url=payload.after_image_base64,
        resolution_notes=payload.resolution_notes,
        resolved_by_staff_id=payload.staff_id,
        resolved_by_staff_name=payload.staff_name,
        resolution_submitted_at=datetime.now(timezone.utc),
    )
    record.status = GrievanceStatusEnum.RESOLVED_PENDING_VERIFICATION
    updated = update_grievance(record)

    return updated


@router.post(
    "/issues/{grievance_id}/verify-closure",
    response_model=ClosureVerificationResult,
    status_code=status.HTTP_200_OK,
    summary="[Citizen] Confirm or Reject Resolution — AI Anti-Fake-Closure Guardrail",
    dependencies=[Depends(validate_request_size)],
)
async def verify_closure(
    grievance_id: str,
    payload: VerifyClosureInput,
):
    """
    Citizen endpoint: confirms or rejects a RESOLVED_PENDING_VERIFICATION grievance.

    When action='confirm':
      1. Triggers the AI Anti-Fake-Closure guardrail.
      2. If AI confidence ≥ 60: transitions to VERIFIED_CLOSED.
      3. If AI confidence < 60: transitions to SUSPICIOUS_CLOSURE and prompts
         the citizen to provide feedback.

    When action='reject':
      Immediately transitions to REJECTED_REOPENED with citizen feedback attached.
    """
    record = get_grievance(grievance_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Grievance '{grievance_id}' not found.",
        )

    allowed_from = {
        GrievanceStatusEnum.RESOLVED_PENDING_VERIFICATION,
        GrievanceStatusEnum.SUSPICIOUS_CLOSURE,  # Allow retry after suspicion flag
    }
    if record.status not in allowed_from:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"Grievance is in '{record.status.value}' state, not pending citizen verification. "
                f"Allowed from: {[s.value for s in allowed_from]}."
            ),
        )

    if not record.resolution_evidence:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Grievance has no resolution evidence attached. Staff must submit resolution first.",
        )

    # ── REJECT PATH ──────────────────────────────────────────────────────────
    if payload.action == "reject":
        record.status = GrievanceStatusEnum.REJECTED_REOPENED
        record.citizen_feedback = payload.citizen_feedback or "Citizen rejected the resolution without additional feedback."
        update_grievance(record)
        return ClosureVerificationResult(
            success=True,
            grievance_id=grievance_id,
            new_status=GrievanceStatusEnum.REJECTED_REOPENED,
            message=(
                "Resolution rejected. The grievance has been reopened for further action by municipal staff."
            ),
        )

    # ── CONFIRM PATH — Run AI Anti-Fake-Closure Guardrail ───────────────────
    validation = await validate_closure_authenticity(record.resolution_evidence)

    record.ai_confidence_score = validation.confidence_score
    record.ai_validation_notes = validation.reasoning
    if validation.flags:
        record.ai_validation_notes += "  Flags: " + " | ".join(validation.flags)

    if validation.is_suspicious:
        # AI detected a likely fake closure — hold for citizen review
        record.status = GrievanceStatusEnum.SUSPICIOUS_CLOSURE
        update_grievance(record)
        return ClosureVerificationResult(
            success=True,
            grievance_id=grievance_id,
            new_status=GrievanceStatusEnum.SUSPICIOUS_CLOSURE,
            ai_confidence_score=validation.confidence_score,
            is_suspicious=True,
            ai_validation_notes=validation.reasoning,
            message=(
                f"⚠️ Suspicious closure detected (AI confidence: {validation.confidence_score:.0f}/100). "
                "The resolution does not appear to adequately address the original complaint. "
                "Please review and provide feedback, or reject this closure."
            ),
        )

    # AI validated — mark as permanently closed
    record.status = GrievanceStatusEnum.VERIFIED_CLOSED
    record.verified_at = datetime.now(timezone.utc)
    record.citizen_feedback = payload.citizen_feedback
    update_grievance(record)

    return ClosureVerificationResult(
        success=True,
        grievance_id=grievance_id,
        new_status=GrievanceStatusEnum.VERIFIED_CLOSED,
        ai_confidence_score=validation.confidence_score,
        is_suspicious=False,
        ai_validation_notes=validation.reasoning,
        message=(
            f"✅ Resolution verified and closure confirmed (AI confidence: {validation.confidence_score:.0f}/100). "
            "Thank you for verifying this resolution. The grievance has been permanently closed."
        ),
    )
