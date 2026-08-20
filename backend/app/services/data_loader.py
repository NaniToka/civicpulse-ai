import json
import os
from typing import List, Dict, Any, Optional
from app.models.schemas import Region, InfrastructureIndicator, InvestmentProject, CitizenRequest


class DataLoader:
    """Utility class to read seed datasets from data/seed/."""

    def __init__(self, seed_dir: Optional[str] = None):
        if seed_dir is None:
            # Default to ../../../data/seed relative to this file
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            self.seed_dir = os.path.join(base_dir, "..", "data", "seed")
        else:
            self.seed_dir = seed_dir

    def _load_json(self, filename: str) -> List[Dict[str, Any]]:
        file_path = os.path.abspath(os.path.join(self.seed_dir, filename))
        if not os.path.exists(file_path):
            return []
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def get_regions(self) -> List[Region]:
        data = self._load_json("regions.json")
        return [Region(**item) for item in data]

    def get_infrastructure_indicators(self) -> List[InfrastructureIndicator]:
        data = self._load_json("infrastructure_indicators.json")
        return [InfrastructureIndicator(**item) for item in data]

    def get_investment_projects(self) -> List[InvestmentProject]:
        data = self._load_json("investment_projects.json")
        return [InvestmentProject(**item) for item in data]

    def get_citizen_requests(self) -> List[CitizenRequest]:
        data = self._load_json("citizen_requests.json")
        return [CitizenRequest(**item) for item in data]


data_loader = DataLoader()
