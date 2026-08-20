from app.models.schemas import (
    CitizenRequest,
    ExtractedEntities,
    InfrastructureIndicator,
    Region,
)
from app.services.hotspot_engine import hotspot_engine


def test_hotspot_engine_per_capita_normalization():
    # Region A: High population, low per-capita demand density
    region_a = Region(
        id="REG-LARGE",
        country="India",
        country_code="IND",
        state_province="State A",
        district_city="City Large",
        latitude=20.0,
        longitude=75.0,
        population=2000000,
        vulnerability_index=0.50,
        primary_language="hi",
        is_synthetic=True,
    )

    # Region B: Smaller population, high per-capita demand density
    region_b = Region(
        id="REG-SMALL",
        country="India",
        country_code="IND",
        state_province="State B",
        district_city="City Small",
        latitude=21.0,
        longitude=76.0,
        population=50000,
        vulnerability_index=0.85,
        primary_language="hi",
        is_synthetic=True,
    )

    # Region A has 10 requests
    requests_a = [
        CitizenRequest(
            id=f"REQ-A-{i}",
            region_id="REG-LARGE",
            source="web",
            language="hi",
            original_text="अस्पताल नहीं है",
            category="healthcare",
            request_category="Healthcare",
            urgency="CRITICAL",
            extracted_entities=ExtractedEntities(severity="CRITICAL"),
            latitude=20.0,
            longitude=75.0,
        )
        for i in range(10)
    ]

    # Region B has 8 requests (smaller pop = much higher per-capita signal)
    requests_b = [
        CitizenRequest(
            id=f"REQ-B-{i}",
            region_id="REG-SMALL",
            source="web",
            language="hi",
            original_text="अस्पताल की जरूरत है",
            category="healthcare",
            request_category="Healthcare",
            urgency="CRITICAL",
            extracted_entities=ExtractedEntities(severity="CRITICAL"),
            latitude=21.0,
            longitude=76.0,
        )
        for i in range(8)
    ]

    indicators = [
        InfrastructureIndicator(
            id="IND-A",
            region_id="REG-LARGE",
            category="healthcare",
            current_capacity_pct=40.0,
            demand_index=60.0,
            coverage_ratio_pct=50.0,
            gap_score=0.60,
            last_assessed="2026-Q2",
        ),
        InfrastructureIndicator(
            id="IND-B",
            region_id="REG-SMALL",
            category="healthcare",
            current_capacity_pct=20.0,
            demand_index=90.0,
            coverage_ratio_pct=25.0,
            gap_score=0.85,
            last_assessed="2026-Q2",
        ),
    ]

    hotspots = hotspot_engine.detect_hotspots(
        regions=[region_a, region_b],
        requests=requests_a + requests_b,
        indicators=indicators,
        category_filter="healthcare",
    )

    assert len(hotspots) == 2
    # Region B should rank higher due to per-capita normalization and higher deficit
    assert hotspots[0].region_id == "REG-SMALL"
    assert hotspots[0].per_capita_demand_per_100k > hotspots[1].per_capita_demand_per_100k
