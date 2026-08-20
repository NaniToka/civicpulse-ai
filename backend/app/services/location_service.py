import math

from app.models.schemas import Region


class LocationService:
    """
    Location Intelligence Service.
    Resolves location text or geographic coordinates to normalized BRICS target regions.
    Designed for 100% offline operation using seeded region data, with an extensible
    interface for future geocoding API integrations.
    """

    def resolve_region_by_coordinates(
        self, lat: float, lon: float, regions: list[Region]
    ) -> Region | None:
        """
        Finds nearest seeded region based on Haversine geographic distance.
        """
        if not regions:
            return None

        best_region = None
        min_distance = float("inf")

        for region in regions:
            dist = self._haversine_distance(lat, lon, region.latitude, region.longitude)
            if dist < min_distance:
                min_distance = dist
                best_region = region

        return best_region

    def resolve_region_by_text(
        self, location_text: str | None, regions: list[Region]
    ) -> Region | None:
        """
        Resolves location text string to a matching seeded region by district, city,
        state, or country match.
        """
        if not location_text or not regions:
            return regions[0] if regions else None

        text_lower = location_text.lower().strip()

        # 1. Exact or substring match on district/city
        for region in regions:
            if region.district_city.lower() in text_lower or text_lower in region.district_city.lower():
                return region

        # 2. State / Province match
        for region in regions:
            if region.state_province.lower() in text_lower or text_lower in region.state_province.lower():
                return region

        # 3. Country match
        for region in regions:
            if region.country.lower() in text_lower or region.country_code.lower() == text_lower:
                return region

        # Default fallback to first available region
        return regions[0]

    def _haversine_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculates distance between two lat/lon coordinates in km."""
        r = 6371.0  # Earth radius in km
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)

        a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return r * c


location_service = LocationService()
