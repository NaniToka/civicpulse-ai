from app.models.schemas import (
    CitizenRequest,
    ExtractedEntities,
    InfrastructureIndicator,
    InvestmentProject,
    Region,
)
from app.services.scoring_engine import scoring_engine


def test_priority_scoring_formula_reproducibility_and_explainability():
    region = Region(
        id="REG-TEST-01",
        country="India",
        country_code="IND",
        state_province="StateTest",
        district_city="CityTest",
        latitude=20.0,
        longitude=75.0,
        population=1000000,
        vulnerability_index=0.80,
        primary_language="hi",
        is_synthetic=True,
    )

    indicator = InfrastructureIndicator(
        id="INF-TEST",
        region_id="REG-TEST-01",
        category="water",
        current_capacity_pct=30.0,
        demand_index=90.0,
        coverage_ratio_pct=35.0,
        gap_score=0.85,
        last_assessed="2026-01-01",
        is_synthetic=True,
    )

    requests = [
        CitizenRequest(
            id="REQ-1",
            region_id="REG-TEST-01",
            source="web",
            language="hi",
            original_text="पानी नहीं है",
            translated_text="No water supply",
            category="water",
            request_category="Clean Water",
            extracted_entities=ExtractedEntities(severity="CRITICAL", impacted_count=5000),
            latitude=20.0,
            longitude=75.0,
            confidence=0.95,
        )
    ]

    investments = []

    score, evidence, reasoning, _action, explanation_details = scoring_engine.calculate_priority_score(
        region=region,
        indicator=indicator,
        requests=requests,
        investments=investments,
        category="water",
    )

    assert 0.0 <= score <= 100.0
    assert score > 50.0
    assert evidence.data_sources is not None
    assert "Clean Water" in reasoning or "water" in reasoning.lower()

    # Explainability details assertion
    assert explanation_details.priority_score == score
    assert len(explanation_details.factors) == 6
    assert any(f.name == "Citizen Demand Signal" for f in explanation_details.factors)


def test_investment_risk_penalty():
    region = Region(
        id="REG-TEST-02",
        country="Brazil",
        country_code="BRA",
        state_province="SP",
        district_city="São Paulo East",
        latitude=-23.5,
        longitude=-46.6,
        population=2000000,
        vulnerability_index=0.60,
        primary_language="pt",
        is_synthetic=True,
    )

    indicator = InfrastructureIndicator(
        id="INF-SAN",
        region_id="REG-TEST-02",
        category="sanitation",
        current_capacity_pct=40.0,
        demand_index=80.0,
        coverage_ratio_pct=45.0,
        gap_score=0.70,
        last_assessed="2026-01-01",
        is_synthetic=True,
    )

    requests = []

    # Scenario without active investment
    score_no_inv, _, _, _, _ = scoring_engine.calculate_priority_score(
        region=region,
        indicator=indicator,
        requests=requests,
        investments=[],
        category="sanitation",
    )

    # Scenario with active investment
    active_inv = InvestmentProject(
        id="INV-ACTIVE",
        project_name="Sewage Project",
        region_id="REG-TEST-02",
        category="sanitation",
        budget_usd=10000000.0,
        status="active",
        planned_start="2025-01-01",
        is_synthetic=True,
    )

    score_with_inv, _, _, _, explanation_with_inv = scoring_engine.calculate_priority_score(
        region=region,
        indicator=indicator,
        requests=requests,
        investments=[active_inv],
        category="sanitation",
    )

    assert score_with_inv < score_no_inv
    assert len(explanation_with_inv.risks) > 0
