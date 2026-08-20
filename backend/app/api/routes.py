from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from app.models.schemas import (
    CitizenRequest,
    Region,
    InfrastructureIndicator,
    InvestmentProject,
    PriorityRecommendation,
    CitizenRequestIngestInput,
    ScenarioWhatIfInput,
    ScenarioWhatIfResult,
    ExtractedEntities,
)
from app.services.data_loader import data_loader
from app.services.ai_service import get_ai_service
from app.services.scoring_engine import scoring_engine
from app.core.security import validate_request_size

router = APIRouter(prefix="/api/v1")


@router.get("/health", summary="System Health Check")
async def health_check():
    return {
        "status": "healthy",
        "service": "CivicPulse AI Backend",
        "version": "0.1.0",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@router.get("/regions", response_model=List[Region], summary="List BRICS Target Regions")
async def list_regions():
    return data_loader.get_regions()


@router.get("/requests", response_model=List[CitizenRequest], summary="List Multilingual Citizen Feedback Entries")
async def list_citizen_requests(region_id: Optional[str] = None):
    requests = data_loader.get_citizen_requests()
    if region_id:
        requests = [r for r in requests if r.region_id == region_id]
    return requests


@router.get("/indicators", response_model=List[InfrastructureIndicator], summary="List Infrastructure Indicators")
async def list_indicators(region_id: Optional[str] = None):
    indicators = data_loader.get_infrastructure_indicators()
    if region_id:
        indicators = [i for i in indicators if i.region_id == region_id]
    return indicators


@router.get("/investments", response_model=List[InvestmentProject], summary="List National Capital Investments")
async def list_investments(region_id: Optional[str] = None):
    investments = data_loader.get_investment_projects()
    if region_id:
        investments = [inv for inv in investments if inv.region_id == region_id]
    return investments


@router.get("/recommendations", response_model=List[PriorityRecommendation], summary="Generate Priority Recommendations")
async def get_recommendations():
    regions = data_loader.get_regions()
    indicators = data_loader.get_infrastructure_indicators()
    requests = data_loader.get_citizen_requests()
    investments = data_loader.get_investment_projects()
    ai_service = get_ai_service()

    recommendations: List[PriorityRecommendation] = []
    categories = [
        "Clean Water & Sanitation",
        "Clean Energy & Grid Resilience",
        "Healthcare & Sanitation",
        "Public Transit & Roads",
    ]

    for region in regions:
        region_indicators = [i for i in indicators if i.region_id == region.id]
        region_requests = [r for r in requests if r.region_id == region.id]
        region_investments = [inv for inv in investments if inv.region_id == region.id]

        for category in categories:
            ind = next((i for i in region_indicators if i.category.lower() == category.lower()), None)
            score, evidence, reasoning, action = scoring_engine.calculate_priority_score(
                region=region,
                indicator=ind,
                requests=region_requests,
                investments=region_investments,
                category=category
            )

            rec_id = f"REC-{region.country_code}-{len(recommendations)+1:03d}"
            recommendations.append(
                PriorityRecommendation(
                    id=rec_id,
                    region_id=region.id,
                    region_name=f"{region.district_city}, {region.country}",
                    category=category,
                    priority_score=score,
                    confidence=0.92,
                    evidence_card=evidence,
                    reasoning=reasoning,
                    expected_impact=f"Estimated impact across {region.population:,} residents",
                    recommended_action=action,
                    is_demo=True
                )
            )

    # Sort descending by priority score
    recommendations.sort(key=lambda x: x.priority_score, reverse=True)
    return recommendations


@router.post(
    "/ingest",
    response_model=CitizenRequest,
    summary="Ingest Multilingual Citizen Feedback",
    dependencies=[Depends(validate_request_size)]
)
async def ingest_citizen_request(payload: CitizenRequestIngestInput):
    ai_service = get_ai_service()
    ai_result = await ai_service.process_citizen_text(payload.raw_text, payload.language)

    regions = data_loader.get_regions()
    target_region = regions[0] if regions else None
    region_id = payload.region_id or (target_region.id if target_region else "REG-IND-MH-PUNE-01")

    new_request = CitizenRequest(
        id=f"REQ-USER-{uuid.uuid4().hex[:6].upper()}",
        region_id=region_id,
        source=payload.source,
        language=ai_result.get("detected_language", payload.language),
        original_text=payload.raw_text,
        translated_text=ai_result.get("translated_text", payload.raw_text),
        request_category=ai_result.get("category", "General Infrastructure"),
        extracted_entities=ExtractedEntities(
            location=ai_result.get("location", "Unspecified Landmark"),
            severity=ai_result.get("severity", "MEDIUM"),
            impacted_count=ai_result.get("impacted_count", 100),
            infrastructure_type=ai_result.get("category", "General Infrastructure")
        ),
        latitude=payload.latitude or (target_region.latitude if target_region else 18.5204),
        longitude=payload.longitude or (target_region.longitude if target_region else 73.8567),
        confidence=ai_result.get("confidence", 0.85),
        is_demo=False
    )
    return new_request


@router.post("/scenario/what-if", response_model=ScenarioWhatIfResult, summary="Execute What-If Policy Simulation")
async def scenario_what_if(payload: ScenarioWhatIfInput):
    regions = data_loader.get_regions()
    region = next((r for r in regions if r.id == payload.region_id), None)
    if not region:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Region not found")

    indicators = data_loader.get_infrastructure_indicators()
    ind = next((i for i in indicators if i.region_id == payload.region_id and i.category == payload.category), None)
    requests = data_loader.get_citizen_requests()
    investments = data_loader.get_investment_projects()

    orig_score, _, _, _ = scoring_engine.calculate_priority_score(
        region=region,
        indicator=ind,
        requests=requests,
        investments=investments,
        category=payload.category
    )

    # Simulate effect of budget allocation
    added_coverage_pct = min(40.0, (payload.budget_allocation_usd / 10_000_000.0) * 15.0)
    current_gap = ind.gap_score if ind else 0.60
    simulated_gap = max(0.10, current_gap - (added_coverage_pct / 100.0))

    simulated_ind = InfrastructureIndicator(
        id="SIM-IND",
        region_id=region.id,
        category=payload.category,
        current_capacity_pct=min(100.0, (ind.current_capacity_pct if ind else 40.0) + added_coverage_pct),
        demand_index=ind.demand_index if ind else 80.0,
        coverage_ratio_pct=min(100.0, (ind.coverage_ratio_pct if ind else 45.0) + added_coverage_pct),
        gap_score=simulated_gap,
        last_assessed="2026-SIMULATED",
        is_demo=True
    )

    sim_score, _, _, _ = scoring_engine.calculate_priority_score(
        region=region,
        indicator=simulated_ind,
        requests=requests,
        investments=investments,
        category=payload.category
    )

    score_delta = round(sim_score - orig_score, 1)
    beneficiaries = int(region.population * (added_coverage_pct / 100.0))

    return ScenarioWhatIfResult(
        original_priority_score=orig_score,
        simulated_priority_score=sim_score,
        score_delta=score_delta,
        projected_gap_score=round(simulated_gap, 2),
        expected_population_beneficiaries=beneficiaries,
        simulation_notes=(
            f"Allocating ${payload.budget_allocation_usd:,.0f} USD is projected to reduce the infrastructure gap "
            f"from {current_gap:.2f} to {simulated_gap:.2f}, benefiting ~{beneficiaries:,} citizens."
        )
    )
