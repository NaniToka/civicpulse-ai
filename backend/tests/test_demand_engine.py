from app.models.schemas import CitizenRequest, ExtractedEntities
from app.services.demand_engine import demand_aggregation_service


def test_demand_aggregation_service():
    requests = [
        CitizenRequest(
            id="REQ-1",
            region_id="REG-A",
            source="voice",
            language="hi",
            original_text="हमारे इलाके में अस्पताल नहीं है",
            category="healthcare",
            request_category="Healthcare",
            urgency="CRITICAL",
            extracted_entities=ExtractedEntities(severity="CRITICAL"),
            latitude=26.0,
            longitude=80.0,
        ),
        CitizenRequest(
            id="REQ-2",
            region_id="REG-A",
            source="text",
            language="hi",
            original_text="बिजली कटौती",
            category="electricity",
            request_category="Electricity & Power",
            urgency="HIGH",
            extracted_entities=ExtractedEntities(severity="HIGH"),
            latitude=26.0,
            longitude=80.0,
        ),
        CitizenRequest(
            id="REQ-3",
            region_id="REG-B",
            source="voice",
            language="pt",
            original_text="Sem água",
            category="water",
            request_category="Clean Water",
            urgency="HIGH",
            extracted_entities=ExtractedEntities(severity="HIGH"),
            latitude=-23.0,
            longitude=-46.0,
        ),
    ]

    summary_all = demand_aggregation_service.aggregate_demand(requests)
    assert summary_all.total_requests == 3
    assert summary_all.unique_sources == 2
    assert summary_all.category_distribution.get("healthcare") == 1
    assert summary_all.category_distribution.get("water") == 1
    assert summary_all.urgency_distribution.get("CRITICAL") == 1

    summary_reg_a = demand_aggregation_service.aggregate_demand(requests, region_id="REG-A")
    assert summary_reg_a.total_requests == 2
    assert summary_reg_a.regional_demand.get("REG-A") == 2
