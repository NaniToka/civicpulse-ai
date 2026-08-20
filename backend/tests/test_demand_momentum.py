from datetime import datetime, timezone

from app.models.schemas import CitizenRequest
from app.services.demand_momentum import demand_momentum_engine


def test_demand_momentum_increasing_trend():
    requests = [
        CitizenRequest(
            id=f"REQ-MOM-{i}",
            region_id="REG-1",
            source="web",
            language="hi",
            original_text="पानी नहीं आ रहा",
            category="water",
            timestamp=datetime(2026, 8, i + 1, tzinfo=timezone.utc),
        )
        for i in range(10)
    ]

    signal = demand_momentum_engine.calculate_momentum("REG-1", "water", requests)
    assert signal.region_id == "REG-1"
    assert signal.category == "water"
    assert signal.trend in ["INCREASING", "EMERGING", "STABLE"]
    assert signal.momentum_score >= 50.0


def test_demand_momentum_empty_requests():
    signal = demand_momentum_engine.calculate_momentum("REG-EMPTY", "healthcare", [])
    assert signal.trend == "STABLE"
    assert signal.percentage_change == 0.0
    assert signal.momentum_score == 50.0
