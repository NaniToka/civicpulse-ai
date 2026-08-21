import json
import os
from typing import Any

from app.models.schemas import (
    CitizenRequest,
    ExtractedEntities,
    InfrastructureIndicator,
    InvestmentProject,
    Region,
)


class DataLoader:
    """Utility class to read synthetic seed datasets and maintain in-memory append-only state for demo signals."""

    def __init__(self, seed_dir: str | None = None):
        if seed_dir is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            self.seed_dir = os.path.join(base_dir, "..", "data", "seed")
        else:
            self.seed_dir = seed_dir
        self._in_memory_requests: list[CitizenRequest] = []

    def _load_json(self, filename: str) -> list[dict[str, Any]]:
        file_path = os.path.abspath(os.path.join(self.seed_dir, filename))
        if not os.path.exists(file_path):
            return []
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:  # noqa: BLE001
            return []

    def get_regions(self) -> list[Region]:
        data = self._load_json("regions.json")
        return [Region(**item) for item in data]

    def get_infrastructure_indicators(self) -> list[InfrastructureIndicator]:
        data = self._load_json("infrastructure_indicators.json")
        indicators = [InfrastructureIndicator(**item) for item in data]
        existing_keys = {(i.region_id, i.category.lower()) for i in indicators}
        categories = ["healthcare", "water", "electricity", "transportation", "digital_connectivity", "sanitation"]

        for region in self.get_regions():
            for cat in categories:
                if (region.id, cat) not in existing_keys:
                    seed_offset = (abs(hash(region.id + cat)) % 35) / 100.0
                    gap_score = round(min(0.92, max(0.25, (region.vulnerability_index * 0.75) + seed_offset - 0.1)), 2)
                    cov_pct = round((1.0 - gap_score) * 100, 1)
                    indicators.append(
                        InfrastructureIndicator(
                            id=f"IND-{region.country_code}-{cat[:4].upper()}-{region.id[-2:]}",
                            region_id=region.id,
                            category=cat,
                            current_capacity_pct=cov_pct,
                            demand_index=round(gap_score * 100, 1),
                            coverage_ratio_pct=cov_pct,
                            gap_score=gap_score,
                            category_specific_metrics={
                                "coverage_pct": cov_pct,
                                "gap_score": gap_score,
                            },
                            last_assessed="2026-Q2",
                            is_synthetic=True,
                            is_demo=True,
                        )
                    )
        return indicators

    def get_investment_projects(self) -> list[InvestmentProject]:
        data = self._load_json("investment_projects.json")
        investments = [InvestmentProject(**item) for item in data]
        existing_regions = {inv.region_id for inv in investments}

        # Seed key investment projects for select additional regions
        for idx, region in enumerate(self.get_regions()):
            if region.id not in existing_regions and idx % 3 == 0:
                investments.append(
                    InvestmentProject(
                        id=f"INV-{region.country_code}-{idx:03d}",
                        region_id=region.id,
                        project_name=f"{region.district_city} Infrastructure Modernization",
                        category="water" if idx % 2 == 0 else "healthcare",
                        budget_usd=12500000 + (idx * 500000),
                        status="ACTIVE",
                        planned_start="2026-06-01",
                        planned_completion="2027-12-31",
                        expected_capacity_addition="+15.0% capacity addition",
                        coverage_area=f"{region.district_city} Metropolitan Area",
                        is_synthetic=True,
                        is_demo=True,
                    )
                )
        return investments

    def get_citizen_requests(self) -> list[CitizenRequest]:
        seed_data = self._load_json("citizen_requests.json")
        requests = [CitizenRequest(**item) for item in seed_data]
        existing_regions = {r.region_id for r in requests}

        # Seed baseline demands for all 35 regions so every district has live citizen feedback
        for idx, region in enumerate(self.get_regions()):
            if region.id not in existing_regions:
                cat = ["healthcare", "water", "electricity", "transportation", "sanitation", "digital_connectivity"][idx % 6]
                urgency = "CRITICAL" if region.vulnerability_index > 0.78 else "HIGH" if region.vulnerability_index > 0.68 else "MEDIUM"
                requests.append(
                    CitizenRequest(
                        id=f"REQ-{region.country_code}-{idx:03d}",
                        region_id=region.id,
                        source="voice" if idx % 2 == 0 else "text",
                        language=region.primary_language,
                        original_text=f"Urgent infrastructure request logged in {region.district_city} for {cat} capacity enhancement.",
                        normalized_text=f"Urgent infrastructure request in {region.district_city} regarding {cat} deficit.",
                        translated_text=f"Urgent infrastructure request in {region.district_city} regarding {cat} deficit.",
                        category=cat,
                        request_category=cat.replace("_", " ").title(),
                        subcategory=f"{cat.title()} Access Deficit",
                        urgency=urgency,
                        processing_status="PROCESSED",
                        extracted_entities=ExtractedEntities(
                            location=f"{region.district_city} Sector Ward",
                            severity=urgency,
                            impacted_count=round(region.population * 0.005),
                            infrastructure_type=cat.title(),
                        ),
                        latitude=region.latitude,
                        longitude=region.longitude,
                        timestamp="2026-08-21T12:00:00Z",
                        confidence=0.94,
                        is_synthetic=True,
                        is_demo=True,
                    )
                )
        return self._in_memory_requests + requests

    def add_citizen_request(self, request: CitizenRequest) -> None:
        """Appends new citizen request to in-memory demo state statelessly."""
        self._in_memory_requests.insert(0, request)

    def reset_demo_state(self) -> int:
        """Resets in-memory demo signals back to initial seed dataset state."""
        count = len(self._in_memory_requests)
        self._in_memory_requests.clear()
        return count


data_loader = DataLoader()
