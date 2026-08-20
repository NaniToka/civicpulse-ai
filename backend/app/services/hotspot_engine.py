
from app.core.taxonomy import normalize_category
from app.models.schemas import (
    CitizenRequest,
    DemandHotspot,
    InfrastructureIndicator,
    Region,
)


class DemandHotspotEngine:
    """
    Demand Hotspot Engine.
    Identifies geographic demand hotspots by combining per-capita request density,
    infrastructure capacity deficits, demographic vulnerability, and urgency weighting.
    """

    def detect_hotspots(
        self,
        regions: list[Region],
        requests: list[CitizenRequest],
        indicators: list[InfrastructureIndicator],
        category_filter: str | None = None
    ) -> list[DemandHotspot]:
        hotspots: list[DemandHotspot] = []

        severity_weights = {"LOW": 1.0, "MEDIUM": 2.0, "HIGH": 3.5, "CRITICAL": 5.0}

        categories_to_check = (
            [normalize_category(category_filter)]
            if category_filter
            else list({normalize_category(i.category) for i in indicators})
        )

        for region in regions:
            region_requests = [r for r in requests if r.region_id == region.id]
            region_indicators = [i for i in indicators if i.region_id == region.id]

            for cat in categories_to_check:
                cat_requests = [
                    r for r in region_requests
                    if normalize_category(r.category or r.request_category) == cat
                ]
                ind = next(
                    (i for i in region_indicators if normalize_category(i.category) == cat),
                    None
                )

                raw_count = len(cat_requests)
                weighted_demand = sum(
                    severity_weights.get(r.urgency or r.extracted_entities.severity, 2.0)
                    for r in cat_requests
                )

                pop = max(1, region.population)
                per_capita = (weighted_demand / pop) * 100000.0
                normalized_per_capita = min(100.0, per_capita * 5.0)

                gap_score_val = ind.gap_score if ind else 0.50
                deficit_score = gap_score_val * 100.0

                critical_count = sum(
                    1 for r in cat_requests
                    if (r.urgency or r.extracted_entities.severity) == "CRITICAL"
                )
                urgency_score = 90.0 if critical_count > 0 else (60.0 if raw_count > 0 else 20.0)
                vulnerability_score = region.vulnerability_index * 100.0

                raw_hotspot_score = (
                    (0.40 * normalized_per_capita) +
                    (0.30 * deficit_score) +
                    (0.15 * urgency_score) +
                    (0.15 * vulnerability_score)
                )
                hotspot_score = round(min(100.0, max(0.0, raw_hotspot_score)), 1)

                hotspots.append(
                    DemandHotspot(
                        region_id=region.id,
                        region_name=f"{region.district_city}, {region.state_province}",
                        country=region.country,
                        category=cat,
                        raw_request_count=raw_count,
                        weighted_demand_signal=round(weighted_demand, 1),
                        per_capita_demand_per_100k=round(per_capita, 2),
                        population=region.population,
                        infrastructure_gap_score=round(gap_score_val, 2),
                        vulnerability_index=round(region.vulnerability_index, 2),
                        hotspot_score=hotspot_score,
                    )
                )

        hotspots.sort(key=lambda h: h.hotspot_score, reverse=True)
        return hotspots


hotspot_engine = DemandHotspotEngine()
