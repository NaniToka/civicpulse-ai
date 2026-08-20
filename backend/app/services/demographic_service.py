from app.core.taxonomy import normalize_category
from app.models.schemas import Region


class DemographicRelevanceEngine:
    """
    Demographic Need Relevance Engine.
    Calculates transparent, category-specific demographic vulnerability scores
    based on census indicators (elderly %, youth %, digital access rate, vulnerability index).
    """

    def calculate_demographic_need(self, region: Region, category: str) -> tuple[float, str]:
        cat_canonical = normalize_category(category)

        vulnerability = region.vulnerability_index * 100.0
        elderly = region.elderly_percentage or 12.0
        youth = region.youth_percentage or 30.0
        digital_gap = 100.0 - (region.digital_access_rate or 50.0)
        density = min(100.0, (region.population_density or 2000.0) / 100.0)

        if cat_canonical == "healthcare":
            # Healthcare demand is elevated by elderly and vulnerable populations
            score = (0.50 * vulnerability) + (0.35 * (elderly * 4.0)) + (0.15 * (youth * 1.5))
            explanation = (
                f"Elevated healthcare vulnerability: {elderly:.1f}% elderly population, "
                f"vulnerability index {region.vulnerability_index:.2f}."
            )

        elif cat_canonical == "education":
            # Education demand is elevated by youth population ratio
            score = (0.60 * (youth * 2.5)) + (0.40 * vulnerability)
            explanation = (
                f"High youth demographic concentration: {youth:.1f}% youth population."
            )

        elif cat_canonical == "digital_connectivity":
            # Digital demand is elevated by digital access gap and student/youth ratio
            score = (0.60 * digital_gap) + (0.40 * (youth * 2.0))
            explanation = (
                f"Digital divide indicator: {digital_gap:.1f}% unserved broadband gap, "
                f"{youth:.1f}% student/youth population."
            )

        elif cat_canonical in ["transportation", "roads"]:
            # Transit demand is elevated by population density and urban footprint
            score = (0.50 * density) + (0.50 * vulnerability)
            explanation = (
                f"Urban transit density factor: {region.population_density or 0:,.0f} residents/km²."
            )

        elif cat_canonical in ["water", "sanitation"]:
            # Water & Sanitation demand is elevated by household count and vulnerability
            score = (0.70 * vulnerability) + (0.30 * min(100.0, region.population / 40000.0))
            explanation = (
                f"Basic sanitation vulnerability index {region.vulnerability_index:.2f} "
                f"across {region.household_count or 0:,} households."
            )

        else:
            # Default baseline vulnerability
            score = vulnerability
            explanation = f"General demographic vulnerability index {region.vulnerability_index:.2f}."

        final_score = round(min(100.0, max(0.0, score)), 1)
        return final_score, explanation


demographic_relevance_engine = DemographicRelevanceEngine()
