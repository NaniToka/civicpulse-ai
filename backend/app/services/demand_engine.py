from collections import Counter

from app.core.taxonomy import normalize_category
from app.models.schemas import CitizenRequest, DemandAggregationSummary


class DemandAggregationService:
    """
    Deterministic Demand Aggregation Engine.
    Calculates summary statistics across citizen requests without relying on LLM inference.
    """

    def aggregate_demand(
        self, requests: list[CitizenRequest], region_id: str | None = None
    ) -> DemandAggregationSummary:
        filtered_requests = requests
        if region_id:
            filtered_requests = [r for r in requests if r.region_id == region_id]

        total_requests = len(filtered_requests)
        unique_sources = len({r.source for r in filtered_requests})

        category_counts: Counter = Counter()
        urgency_counts: Counter = Counter()
        region_counts: Counter = Counter()
        language_counts: Counter = Counter()

        for req in filtered_requests:
            cat = normalize_category(req.category or req.request_category)
            category_counts[cat] += 1
            urgency_counts[req.urgency or req.extracted_entities.severity] += 1
            region_counts[req.region_id] += 1
            language_counts[req.language] += 1

        return DemandAggregationSummary(
            total_requests=total_requests,
            unique_sources=unique_sources,
            category_distribution=dict(category_counts),
            urgency_distribution=dict(urgency_counts),
            regional_demand=dict(region_counts),
            language_distribution=dict(language_counts),
        )


demand_aggregation_service = DemandAggregationService()
