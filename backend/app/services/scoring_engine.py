import math

from app.core.taxonomy import get_category_display_name, normalize_category
from app.models.schemas import (
    CitizenRequest,
    DemandMomentumSignal,
    EvidenceCard,
    ExplanationDetails,
    FactorContribution,
    InfrastructureIndicator,
    InvestmentOverlapDetail,
    InvestmentProject,
    Region,
)
from app.services.demand_momentum import demand_momentum_engine
from app.services.demographic_service import demographic_relevance_engine
from app.services.investment_service import investment_overlap_engine


class ScoringEngineV2:
    """
    Deterministic Infrastructure Prioritization & Decision Engine V2.
    Evaluates 8 weighted factors against risk penalties:
    - Citizen Demand (0.20)
    - Demand Velocity Momentum (0.10)
    - Infrastructure Gap (0.20)
    - Population Scale Impact (0.15)
    - Demographic Need Context (0.15)
    - Urgency Signal (0.10)
    - Investment Alignment (0.05)
    - Evidence Quality Confidence (0.05)
    """

    def __init__(self, weights: dict[str, float] | None = None):
        self.weights = weights or {
            "demand": 0.20,
            "momentum": 0.10,
            "gap": 0.20,
            "population": 0.15,
            "demographic": 0.15,
            "urgency": 0.10,
            "alignment": 0.05,
            "evidence_quality": 0.05,
        }

    def calculate_priority_score(
        self,
        region: Region,
        indicator: InfrastructureIndicator | None,
        requests: list[CitizenRequest],
        investments: list[InvestmentProject],
        category: str
    ) -> tuple[float, EvidenceCard, str, str, ExplanationDetails, DemandMomentumSignal, InvestmentOverlapDetail, float, str, list[FactorContribution], list[str]]:
        cat_canonical = normalize_category(category)
        cat_display = get_category_display_name(cat_canonical)

        # 1. Citizen Demand Signal (0-100)
        category_requests = [
            r for r in requests
            if r.region_id == region.id and normalize_category(r.category or r.request_category) == cat_canonical
        ]
        total_requests = len(category_requests)
        severity_map = {"LOW": 1.0, "MEDIUM": 2.0, "HIGH": 3.5, "CRITICAL": 5.0}
        weighted_signal = sum(
            severity_map.get(r.urgency or r.extracted_entities.severity, 2.0)
            for r in category_requests
        )
        demand_score = min(100.0, weighted_signal * 12.5)

        # 2. Demand Velocity Momentum (0-100)
        momentum = demand_momentum_engine.calculate_momentum(region.id, cat_canonical, requests)
        momentum_score = momentum.momentum_score

        # 3. Infrastructure Gap Score (0-100)
        gap_score_val = indicator.gap_score if indicator else 0.50
        deficit_score = gap_score_val * 100.0

        # 4. Population Impact Multiplier (0-100)
        pop = max(10000, region.population)
        pop_score = min(100.0, (math.log10(pop) - 4.0) * 33.3)

        # 5. Demographic Need Context (0-100)
        demographic_score, demographic_explanation = demographic_relevance_engine.calculate_demographic_need(region, cat_canonical)

        # 6. Urgency Signal (0-100)
        critical_count = sum(
            1 for r in category_requests
            if (r.urgency or r.extracted_entities.severity) == "CRITICAL"
        )
        urgency_score = 90.0 if critical_count > 0 else (60.0 if total_requests > 0 else 30.0)

        # 7. Investment Overlap & Alignment (0-100)
        overlap = investment_overlap_engine.evaluate_investment_overlap(region.id, cat_canonical, investments)
        if overlap.has_overlap and overlap.overlap_type == "ACTIVE_PROJECT":
            alignment_score = 15.0
        elif overlap.has_overlap and overlap.overlap_type == "DELAYED_PROJECT":
            alignment_score = 85.0  # Heightened urgency for delayed project
        else:
            alignment_score = 90.0

        # 8. Evidence Quality Confidence (0-100)
        data_quality_score = 92.0 if (total_requests > 0 and indicator is not None) else 75.0

        # Positive Weighted Base Score
        w = self.weights
        base_score = (
            (w["demand"] * demand_score) +
            (w["momentum"] * momentum_score) +
            (w["gap"] * deficit_score) +
            (w["population"] * pop_score) +
            (w["demographic"] * demographic_score) +
            (w["urgency"] * urgency_score) +
            (w["alignment"] * alignment_score) +
            (w["evidence_quality"] * data_quality_score)
        )

        # Risk Penalties
        coverage_pct = indicator.coverage_ratio_pct if indicator else 50.0
        coverage_penalty = 0.20 * coverage_pct if coverage_pct > 75.0 else 0.0

        duplicate_penalty = 0.0
        risks = []
        if overlap.has_overlap and overlap.overlap_type == "ACTIVE_PROJECT":
            duplicate_penalty = 15.0
            risks.append("Active capital project underway in sector (Duplicate Investment Risk).")
        elif overlap.has_overlap and overlap.overlap_type == "DELAYED_PROJECT":
            risks.append("SPECIAL ATTENTION: Existing capital project is DELAYED.")

        if coverage_pct > 75.0:
            risks.append("High baseline coverage ratio (>75%).")

        total_penalty = coverage_penalty + duplicate_penalty
        raw_final_score = base_score - total_penalty
        final_score = round(max(0.0, min(100.0, raw_final_score)), 1)

        # Deterministic Priority Level
        if final_score >= 80.0:
            priority_level = "CRITICAL"
        elif final_score >= 65.0:
            priority_level = "HIGH"
        elif final_score >= 45.0:
            priority_level = "MEDIUM"
        else:
            priority_level = "LOW"

        # Factor Contributions Breakdown
        factors = [
            FactorContribution(
                name="Citizen Demand Signal",
                raw_value=round(demand_score, 1),
                weight=w["demand"],
                contribution=round(w["demand"] * demand_score, 1),
                explanation=f"{total_requests} verified citizen requests ({critical_count} critical).",
            ),
            FactorContribution(
                name="Demand Velocity Momentum",
                raw_value=round(momentum_score, 1),
                weight=w["momentum"],
                contribution=round(w["momentum"] * momentum_score, 1),
                explanation=f"Demand velocity is {momentum.trend} ({momentum.percentage_change:+.1f}% change).",
            ),
            FactorContribution(
                name="Infrastructure Deficit Gap",
                raw_value=round(deficit_score, 1),
                weight=w["gap"],
                contribution=round(w["gap"] * deficit_score, 1),
                explanation=f"Operational capacity gap score of {gap_score_val:.2f} (Coverage: {coverage_pct:.1f}%).",
            ),
            FactorContribution(
                name="Population Scale Impact",
                raw_value=round(pop_score, 1),
                weight=w["population"],
                contribution=round(w["population"] * pop_score, 1),
                explanation=f"Regional population of {region.population:,} residents.",
            ),
            FactorContribution(
                name="Demographic Need Context",
                raw_value=round(demographic_score, 1),
                weight=w["demographic"],
                contribution=round(w["demographic"] * demographic_score, 1),
                explanation=demographic_explanation,
            ),
            FactorContribution(
                name="Urgency Signal",
                raw_value=round(urgency_score, 1),
                weight=w["urgency"],
                contribution=round(w["urgency"] * urgency_score, 1),
                explanation="Derived urgency score from NLP emergency tags.",
            ),
            FactorContribution(
                name="Investment Alignment",
                raw_value=round(alignment_score, 1),
                weight=w["alignment"],
                contribution=round(w["alignment"] * alignment_score, 1),
                explanation=overlap.explanation,
            ),
            FactorContribution(
                name="Evidence Quality Confidence",
                raw_value=round(data_quality_score, 1),
                weight=w["evidence_quality"],
                contribution=round(w["evidence_quality"] * data_quality_score, 1),
                explanation="Statistical confidence based on data completeness.",
            ),
        ]

        evidence_card = EvidenceCard(
            demand_signal_summary=f"{total_requests} verified citizen requests logged ({critical_count} critical urgency).",
            infrastructure_deficit_summary=f"Current capacity deficit score: {gap_score_val:.2f} (Coverage: {coverage_pct:.1f}%).",
            demographic_impact_summary=f"Region population: {region.population:,} ({demographic_explanation}).",
            investment_status_summary=overlap.explanation,
            data_sources=["Multilingual Citizen Signals", "Demographic Census", "National Capital Budget Records"],
        )

        reasoning = (
            f"Prioritized for '{cat_display}' in {region.district_city} due to high citizen demand signal "
            f"({total_requests} entries, {momentum.trend} trend) combined with an infrastructure deficit score of {gap_score_val:.2f} "
            f"and regional demographic vulnerability ({demographic_explanation})."
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
            existing_investment_context=overlap.explanation,
            estimated_population_impact=int(region.population * 0.25),
            recommended_action=recommended_action,
        )

        return (
            final_score,
            evidence_card,
            reasoning,
            recommended_action,
            explanation_details,
            momentum,
            overlap,
            demographic_score,
            demographic_explanation,
            factors,
            risks,
        )


scoring_engine = ScoringEngineV2()
