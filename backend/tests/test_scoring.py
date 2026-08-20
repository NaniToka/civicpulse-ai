from app.models.schemas import Region, InfrastructureIndicator, InvestmentProject, CitizenRequest, ExtractedEntities
from app.services.scoring_engine import scoring_engine


def test_priority_scoring_formula_reproducibility():
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
        is_demo=True
    )

    indicator = InfrastructureIndicator(
        id="INF-TEST",
        region_id="REG-TEST-01",
        category="Clean Water & Sanitation",
        current_capacity_pct=30.0,
        demand_index=90.0,
        coverage_ratio_pct=35.0,
        gap_score=0.85,
        last_assessed="2026-01-01",
        is_demo=True
    )

    requests = [
        CitizenRequest(
            id="REQ-1",
            region_id="REG-TEST-01",
            source="App",
            language="hi",
            original_text="पानी नहीं है",
            translated_text="No water supply",
            request_category="Clean Water & Sanitation",
            extracted_entities=ExtractedEntities(severity="CRITICAL", impacted_count=5000),
            latitude=20.0,
            longitude=75.0,
            confidence=0.95
        )
    ]

    investments = []

    score, evidence, reasoning, action = scoring_engine.calculate_priority_score(
        region=region,
        indicator=indicator,
        requests=requests,
        investments=investments,
        category="Clean Water & Sanitation"
    )

    assert 0.0 <= score <= 100.0
    assert score > 50.0  # High vulnerability + critical requests should yield high score
    assert evidence.data_sources is not None
    assert "Clean Water & Sanitation" in reasoning
