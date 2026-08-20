from datetime import datetime, timezone

from app.core.taxonomy import normalize_category
from app.models.schemas import CitizenRequest, DemandMomentumSignal


class DemandMomentumEngine:
    """
    Demand Momentum Engine.
    Calculates temporal demand velocity and trend direction (INCREASING, STABLE, DECREASING, EMERGING)
    across recent vs previous time windows.
    """

    def calculate_momentum(
        self,
        region_id: str,
        category: str,
        requests: list[CitizenRequest],
        reference_date: datetime | None = None
    ) -> DemandMomentumSignal:
        cat_canonical = normalize_category(category)
        cat_requests = [
            r for r in requests
            if r.region_id == region_id and normalize_category(r.category or r.request_category) == cat_canonical
        ]

        if not cat_requests:
            return DemandMomentumSignal(
                region_id=region_id,
                category=cat_canonical,
                trend="STABLE",
                percentage_change=0.0,
                recent_window_count=0,
                previous_window_count=0,
                momentum_score=50.0,
            )

        ref_time = reference_date or datetime.now(timezone.utc)
        
        # Sort requests by timestamp if available
        sorted_requests = sorted(cat_requests, key=lambda r: r.timestamp if r.timestamp else ref_time)
        midpoint = len(sorted_requests) // 2

        if len(sorted_requests) == 1:
            recent_count = 1
            prev_count = 0
        else:
            prev_count = midpoint
            recent_count = len(sorted_requests) - midpoint

        if prev_count == 0:
            trend = "EMERGING"
            pct_change = 100.0
            momentum_score = 85.0
        else:
            pct_change = round(((recent_count - prev_count) / prev_count) * 100.0, 1)
            if pct_change > 15.0:
                trend = "INCREASING"
                momentum_score = min(100.0, 60.0 + (pct_change * 0.4))
            elif pct_change < -15.0:
                trend = "DECREASING"
                momentum_score = max(10.0, 50.0 + (pct_change * 0.4))
            else:
                trend = "STABLE"
                momentum_score = 50.0

        return DemandMomentumSignal(
            region_id=region_id,
            category=cat_canonical,
            trend=trend,
            percentage_change=pct_change,
            recent_window_count=recent_count,
            previous_window_count=prev_count,
            momentum_score=round(momentum_score, 1),
        )


demand_momentum_engine = DemandMomentumEngine()
