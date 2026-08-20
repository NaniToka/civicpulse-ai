import json
import os
from typing import Any

from app.models.schemas import (
    CitizenRequest,
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
        return [InfrastructureIndicator(**item) for item in data]

    def get_investment_projects(self) -> list[InvestmentProject]:
        data = self._load_json("investment_projects.json")
        return [InvestmentProject(**item) for item in data]

    def get_citizen_requests(self) -> list[CitizenRequest]:
        seed_data = self._load_json("citizen_requests.json")
        requests = [CitizenRequest(**item) for item in seed_data]
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
