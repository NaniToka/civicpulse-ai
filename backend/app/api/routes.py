import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status

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
    DemandAggregationSummary,
    DemandHotspot,
    ExplanationDetails,
    ExtractedEntities,
    InfrastructureIndicator,
    InvestmentProject,
    PriorityRecommendation,
    Region,
    ScenarioWhatIfInput,
    ScenarioWhatIfResult,
)
from app.services.ai_service import get_ai_service
from app.services.data_loader import data_loader
from app.services.demand_engine import demand_aggregation_service
from app.services.hotspot_engine import hotspot_engine
from app.services.location_service import location_service
from app.services.scenario_service import scenario_simulation_service
from app.services.scoring_engine import scoring_engine

router = APIRouter(prefix="/api/v1")


@router.get("/health", summary="System Health Check")
async def health_check():
    return {
        "status": "healthy",
        "service": "CivicPulse AI Backend Intelligence Engine",
        "version": "0.2.0",
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
    ai_output = await ai_service.process_citizen_text(payload.raw_text, payload.language)

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
        source=payload.source,
        language=ai_output.language or payload.language,
        original_text=payload.raw_text,
        normalized_text=ai_output.summary or payload.raw_text,
        translated_text=ai_output.summary or payload.raw_text,
        category=cat_canonical,
        request_category=cat_display,
        subcategory=ai_output.subcategory or f"{cat_display} Issue",
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


@router.get("/recommendations", response_model=list[PriorityRecommendation], summary="Generate Priority Recommendations")
async def get_recommendations():
    regions = data_loader.get_regions()
    indicators = data_loader.get_infrastructure_indicators()
    requests = data_loader.get_citizen_requests()
    investments = data_loader.get_investment_projects()

    recommendations: list[PriorityRecommendation] = []
    all_cat_keys = list({normalize_category(i.category) for i in indicators})
    if not all_cat_keys:
        all_cat_keys = ["healthcare", "water", "electricity", "transportation", "digital_connectivity"]

    for region in regions:
        region_indicators = [i for i in indicators if i.region_id == region.id]
        region_requests = [r for r in requests if r.region_id == region.id]
        region_investments = [inv for inv in investments if inv.region_id == region.id]

        for cat_key in all_cat_keys:
            ind = next((i for i in region_indicators if normalize_category(i.category) == cat_key), None)

            score, evidence, reasoning, action, explanation_details = scoring_engine.calculate_priority_score(
                region=region,
                indicator=ind,
                requests=region_requests,
                investments=region_investments,
                category=cat_key,
            )

            rec_id = f"REC-{region.country_code}-{cat_key.upper()[:4]}"
            recommendations.append(
                PriorityRecommendation(
                    id=rec_id,
                    region_id=region.id,
                    region_name=f"{region.district_city}, {region.country}",
                    category=cat_key,
                    priority_score=score,
                    priority_level=explanation_details.priority_level,
                    confidence=0.92,
                    evidence_card=evidence,
                    explanation_details=explanation_details,
                    reasoning=reasoning,
                    expected_impact=f"Estimated impact across ~{int(region.population * 0.25):,} residents",
                    recommended_action=action,
                    is_synthetic=True,
                    is_demo=True,
                )
            )

    recommendations.sort(key=lambda x: x.priority_score, reverse=True)
    return recommendations


@router.get("/recommendations/{recommendation_id}", response_model=PriorityRecommendation, summary="Get Priority Recommendation by ID")
async def get_recommendation_by_id(recommendation_id: str):
    recs = await get_recommendations()
    rec = next((r for r in recs if r.id == recommendation_id), None)
    if not rec:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Recommendation '{recommendation_id}' not found")
    return rec


@router.get("/recommendations/{recommendation_id}/explanation", response_model=ExplanationDetails, summary="Get 'Why this recommendation?' Factor Explanation")
async def get_recommendation_explanation(recommendation_id: str):
    recs = await get_recommendations()
    rec = next((r for r in recs if r.id == recommendation_id), None)
    if not rec or not rec.explanation_details:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Explanation for recommendation '{recommendation_id}' not found")
    return rec.explanation_details


@router.post("/scenario/what-if", response_model=ScenarioWhatIfResult, summary="Execute What-If Policy Simulation")
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
