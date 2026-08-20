import math
from typing import List, Optional, Tuple
from app.models.schemas import (
    Region,
    InfrastructureIndicator,
    InvestmentProject,
    CitizenRequest,
    PriorityRecommendation,
    EvidenceCard
)


class ScoringEngine:
    """
    Deterministic Infrastructure Prioritization & Decision Engine.
    Formula: Priority Score = clamp(0, 100, Base Score - Risk Penalties)
    """

    def calculate_priority_score(
        self,
        region: Region,
        indicator: Optional[InfrastructureIndicator],
        requests: List[CitizenRequest],
        investments: List[InvestmentProject],
        category: str
    ) -> Tuple[float, EvidenceCard, str, str]:
        # 1. Citizen Demand Signal Volume Score (0 - 100)
        category_requests = [r for r in requests if r.request_category.lower() == category.lower()]
        total_requests = len(category_requests)
        
        # Calculate severity-weighted demand volume
        severity_map = {"LOW": 1.0, "MEDIUM": 2.0, "HIGH": 3.5, "CRITICAL": 5.0}
        weighted_signal = sum(severity_map.get(r.extracted_entities.severity, 2.0) for r in category_requests)
        demand_score = min(100.0, weighted_signal * 12.5)

        # 2. Infrastructure Deficit Score (0 - 100)
        gap_score_val = indicator.gap_score if indicator else 0.50
        infrastructure_deficit_score = gap_score_val * 100.0

        # 3. Population Impact Multiplier (0 - 100)
        # Log-scaled population mapping
        pop = max(10000, region.population)
        pop_score = min(100.0, (math.log10(pop) - 4.0) * 33.3)

        # 4. Demographic Need / Vulnerability Index (0 - 100)
        vulnerability_score = region.vulnerability_index * 100.0

        # 5. Urgency Score (0 - 100)
        critical_count = sum(1 for r in category_requests if r.extracted_entities.severity == "CRITICAL")
        urgency_score = 90.0 if critical_count > 0 else (60.0 if total_requests > 0 else 30.0)

        # Positive Weighted Base Score
        # Weights: Demand (0.30), Deficit (0.25), Population (0.15), Vulnerability (0.15), Urgency (0.15)
        base_score = (
            (0.30 * demand_score) +
            (0.25 * infrastructure_deficit_score) +
            (0.15 * pop_score) +
            (0.15 * vulnerability_score) +
            (0.15 * urgency_score)
        )

        # 6. Risk Penalties
        # Existing Coverage Penalty (up to -25 pts if coverage > 75%)
        coverage_pct = indicator.coverage_ratio_pct if indicator else 50.0
        coverage_penalty = 0.25 * coverage_pct if coverage_pct > 70.0 else 0.0

        # Duplicate Investment Risk (deduct pts if active investment exists for category in region)
        cat_investments = [inv for inv in investments if inv.category.lower() == category.lower()]
        duplicate_penalty = 0.0
        active_inv_summary = "No active capital projects currently funded in this sector."
        if any(inv.status in ["IN_PROGRESS", "APPROVED"] for inv in cat_investments):
            duplicate_penalty = 20.0
            active_inv_summary = f"Active capital commitment detected ({len(cat_investments)} ongoing projects)."

        total_penalty = coverage_penalty + duplicate_penalty

        # Final Clamped Priority Score
        raw_final_score = base_score - total_penalty
        final_score = round(max(0.0, min(100.0, raw_final_score)), 1)

        # Build Explainable Evidence Card
        evidence_card = EvidenceCard(
            demand_signal_summary=f"{total_requests} verified citizen requests logged ({critical_count} critical urgency).",
            infrastructure_deficit_summary=f"Current capacity deficit score: {gap_score_val:.2f} (Coverage: {coverage_pct:.1f}%).",
            demographic_impact_summary=f"Region population: {region.population:,} (Vulnerability Index: {region.vulnerability_index:.2f}).",
            investment_status_summary=active_inv_summary,
            data_sources=["Multilingual Citizen Feedback", "Census Demographic Data", "National Investment Plans"]
        )

        reasoning = (
            f"Prioritized for '{category}' in {region.district_city} due to high citizen demand signal "
            f"({total_requests} entries) combined with an infrastructure deficit score of {gap_score_val:.2f} "
            f"and a regional vulnerability index of {region.vulnerability_index:.2f}."
        )

        recommended_action = (
            f"Initiate fast-track capital allocation for a {category} expansion in {region.district_city} "
            f"targeting {int(region.population * 0.25):,} residents."
        )

        expected_impact = (
            f"Reduces infrastructure deficit gap by ~{(gap_score_val * 0.35):.2f} and resolves "
            f"{total_requests} logged citizen complaints within 180 days."
        )

        return final_score, evidence_card, reasoning, recommended_action


scoring_engine = ScoringEngine()
