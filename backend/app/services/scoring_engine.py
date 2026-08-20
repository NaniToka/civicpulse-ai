import math

from app.core.taxonomy import get_category_display_name, normalize_category
from app.models.schemas import (
    CitizenRequest,
    EvidenceCard,
    ExplanationDetails,
    FactorContribution,
    InfrastructureIndicator,
    InvestmentProject,
    Region,
)


class ScoringEngine:
    """
    Deterministic Infrastructure Prioritization & Explainability Engine.
    Formula: Priority Score = clamp(0, 100, Base Weighted Score - Risk Penalties)
    """

    def __init__(self, weights: dict[str, float] | None = None):
        self.weights = weights or {
            "demand": 0.25,
            "gap": 0.25,
            "population": 0.15,
            "vulnerability": 0.15,
            "urgency": 0.10,
            "alignment": 0.10,
        }

    def calculate_priority_score(
        self,
        region: Region,
        indicator: InfrastructureIndicator | None,
        requests: list[CitizenRequest],
        investments: list[InvestmentProject],
        category: str
    ) -> tuple[float, EvidenceCard, str, str, ExplanationDetails]:
        cat_canonical = normalize_category(category)
        cat_display = get_category_display_name(cat_canonical)

        category_requests = [
            r for r in requests
            if normalize_category(r.category or r.request_category) == cat_canonical
        ]
        total_requests = len(category_requests)
        severity_map = {"LOW": 1.0, "MEDIUM": 2.0, "HIGH": 3.5, "CRITICAL": 5.0}
        weighted_signal = sum(
            severity_map.get(r.urgency or r.extracted_entities.severity, 2.0)
            for r in category_requests
        )
        demand_score = min(100.0, weighted_signal * 12.5)

        gap_score_val = indicator.gap_score if indicator else 0.50
        deficit_score = gap_score_val * 100.0

        pop = max(10000, region.population)
        pop_score = min(100.0, (math.log10(pop) - 4.0) * 33.3)

        vulnerability_score = region.vulnerability_index * 100.0

        critical_count = sum(
            1 for r in category_requests
            if (r.urgency or r.extracted_entities.severity) == "CRITICAL"
        )
        urgency_score = 90.0 if critical_count > 0 else (60.0 if total_requests > 0 else 30.0)

        cat_investments = [
            inv for inv in investments
            if normalize_category(inv.category) == cat_canonical
        ]
        has_active_investment = any(
            inv.status.lower() in ["active", "approved", "in_progress"]
            for inv in cat_investments
        )
        alignment_score = 10.0 if has_active_investment else 90.0

        w = self.weights
        base_score = (
            (w["demand"] * demand_score) +
            (w["gap"] * deficit_score) +
            (w["population"] * pop_score) +
            (w["vulnerability"] * vulnerability_score) +
            (w["urgency"] * urgency_score) +
            (w["alignment"] * alignment_score)
        )

        coverage_pct = indicator.coverage_ratio_pct if indicator else 50.0
        coverage_penalty = 0.20 * coverage_pct if coverage_pct > 75.0 else 0.0

        duplicate_penalty = 0.0
        risks = []
        if has_active_investment:
            duplicate_penalty = 15.0
            risks.append("Existing active public capital commitment in sector.")
        if coverage_pct > 75.0:
            risks.append("High baseline coverage ratio (>75%).")

        total_penalty = coverage_penalty + duplicate_penalty

        raw_final_score = base_score - total_penalty
        final_score = round(max(0.0, min(100.0, raw_final_score)), 1)

        if final_score >= 80.0:
            priority_level = "CRITICAL"
        elif final_score >= 65.0:
            priority_level = "HIGH"
        elif final_score >= 45.0:
            priority_level = "MEDIUM"
        else:
            priority_level = "LOW"

        factors = [
            FactorContribution(
                name="Citizen Demand Signal",
                raw_value=round(demand_score, 1),
                weight=w["demand"],
                contribution=round(w["demand"] * demand_score, 1),
                explanation=f"{total_requests} verified citizen feedback entries ({critical_count} critical urgency).",
            ),
            FactorContribution(
                name="Infrastructure Deficit Gap",
                raw_value=round(deficit_score, 1),
                weight=w["gap"],
                contribution=round(w["gap"] * deficit_score, 1),
                explanation=f"Measured infrastructure gap score of {gap_score_val:.2f} (Coverage: {coverage_pct:.1f}%).",
            ),
            FactorContribution(
                name="Population Scale Impact",
                raw_value=round(pop_score, 1),
                weight=w["population"],
                contribution=round(w["population"] * pop_score, 1),
                explanation=f"Regional population of {region.population:,} residents.",
            ),
            FactorContribution(
                name="Demographic Vulnerability",
                raw_value=round(vulnerability_score, 1),
                weight=w["vulnerability"],
                contribution=round(w["vulnerability"] * vulnerability_score, 1),
                explanation=f"Demographic vulnerability index of {region.vulnerability_index:.2f}.",
            ),
            FactorContribution(
                name="Urgency Signal",
                raw_value=round(urgency_score, 1),
                weight=w["urgency"],
                contribution=round(w["urgency"] * urgency_score, 1),
                explanation="Derived urgency score based on NLP severity tags.",
            ),
            FactorContribution(
                name="Investment Alignment",
                raw_value=round(alignment_score, 1),
                weight=w["alignment"],
                contribution=round(w["alignment"] * alignment_score, 1),
                explanation="Evaluates presence of active capital investments in the sector.",
            ),
        ]

        active_inv_summary = (
            f"Active capital project underway ({len(cat_investments)} projects)."
            if has_active_investment
            else "No overlapping active capital commitment detected in sector."
        )

        evidence_card = EvidenceCard(
            demand_signal_summary=f"{total_requests} verified citizen requests logged ({critical_count} critical urgency).",
            infrastructure_deficit_summary=f"Current capacity deficit score: {gap_score_val:.2f} (Coverage: {coverage_pct:.1f}%).",
            demographic_impact_summary=f"Region population: {region.population:,} (Vulnerability Index: {region.vulnerability_index:.2f}).",
            investment_status_summary=active_inv_summary,
            data_sources=["Multilingual Citizen Signals", "Demographic Census", "National Capital Budget Records"],
        )

        reasoning = (
            f"Prioritized for '{cat_display}' in {region.district_city} due to high demand signal "
            f"({total_requests} entries) combined with an infrastructure deficit score of {gap_score_val:.2f} "
            f"and a regional vulnerability index of {region.vulnerability_index:.2f}."
        )

        recommended_action = (
            f"Initiate fast-track capital allocation for a {cat_display} expansion in {region.district_city} "
            f"benefiting ~{int(region.population * 0.25):,} residents."
        )

        explanation_details = ExplanationDetails(
            recommendation_id=f"REC-{region.country_code}-{cat_canonical.upper()[:4]}",
            region_id=region.id,
            region_name=f"{region.district_city}, {region.country}",
            category=cat_canonical,
            priority_score=final_score,
            priority_level=priority_level,
            factors=factors,
            risks=risks,
            existing_investment_context=active_inv_summary,
            estimated_population_impact=int(region.population * 0.25),
            recommended_action=recommended_action,
        )

        return final_score, evidence_card, reasoning, recommended_action, explanation_details


scoring_engine = ScoringEngine()
