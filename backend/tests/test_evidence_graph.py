from app.models.schemas import (
    CitizenRequest,
    InfrastructureIndicator,
    InvestmentProject,
    Region,
)
from app.services.recommendation_service import recommendation_service


def test_evidence_graph_assembly_and_chain_steps():
    region = Region(
        id="REG-EVD-01",
        country="India",
        country_code="IND",
        state_province="StateTest",
        district_city="CityTest",
        latitude=20.0,
        longitude=75.0,
        population=1500000,
        vulnerability_index=0.75,
        primary_language="hi",
        is_synthetic=True,
    )

    indicator = InfrastructureIndicator(
        id="IND-EVD-01",
        region_id="REG-EVD-01",
        category="healthcare",
        current_capacity_pct=25.0,
        demand_index=95.0,
        coverage_ratio_pct=30.0,
        gap_score=0.85,
        last_assessed="2026-Q2",
        is_synthetic=True,
    )

    requests = [
        CitizenRequest(
            id="REQ-EVD-1",
            region_id="REG-EVD-01",
            source="voice",
            language="hi",
            original_text="अस्पताल में डॉक्टर नहीं हैं",
            category="healthcare",
            request_category="Healthcare",
            urgency="CRITICAL",
            latitude=20.0,
            longitude=75.0,
        )
    ]

    investments: list[InvestmentProject] = []

    rec = recommendation_service.generate_recommendation(
        region=region,
        indicator=indicator,
        requests=requests,
        investments=investments,
        category="healthcare",
    )

    assert rec.id.startswith("REC-IND-")
    assert len(rec.evidence_items) >= 5
    assert len(rec.evidence_chain) == 6
    assert rec.evidence_chain[0].title == "Citizen Demand Voices"
    assert rec.evidence_chain[-1].title == "Priority Recommendation"
    assert rec.why_this_recommendation is not None
    assert rec.why_this_recommendation.overall_confidence > 0.0
