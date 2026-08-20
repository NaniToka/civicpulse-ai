from app.core.taxonomy import normalize_category
from app.models.schemas import (
    CitizenRequest,
    InfrastructureIndicator,
    InvestmentProject,
    PriorityRecommendation,
    Region,
)
from app.services.evidence_service import civic_evidence_graph_service
from app.services.scoring_engine import scoring_engine


class RecommendationService:
    """
    Recommendation Intelligence Service.
    Assembles deterministic priority recommendations backed by the Civic Evidence Graph,
    ordered evidence trails, and optional LLM-generated policymaker summaries.
    """

    def generate_recommendation(
        self,
        region: Region,
        indicator: InfrastructureIndicator | None,
        requests: list[CitizenRequest],
        investments: list[InvestmentProject],
        category: str,
    ) -> PriorityRecommendation:
        cat_canonical = normalize_category(category)

        (
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
        ) = scoring_engine.calculate_priority_score(
            region=region,
            indicator=indicator,
            requests=requests,
            investments=investments,
            category=cat_canonical,
        )

        evidence_items, chain, why_this_recommendation = civic_evidence_graph_service.build_evidence_graph(
            region=region,
            category=cat_canonical,
            requests=requests,
            indicator=indicator,
            momentum=momentum,
            overlap=overlap,
            demographic_score=demographic_score,
            demographic_explanation=demographic_explanation,
            factors=factors,
            final_score=final_score,
            priority_level=explanation_details.priority_level,
            risks=risks,
        )

        rec_id = f"REC-{region.country_code}-{cat_canonical.upper()[:4]}"

        return PriorityRecommendation(
            id=rec_id,
            region_id=region.id,
            region_name=f"{region.district_city}, {region.country}",
            category=cat_canonical,
            priority_score=final_score,
            priority_level=explanation_details.priority_level,
            confidence=0.92,
            evidence_card=evidence_card,
            explanation_details=explanation_details,
            evidence_items=evidence_items,
            demand_momentum=momentum,
            investment_overlap=overlap,
            evidence_chain=chain,
            why_this_recommendation=why_this_recommendation,
            reasoning=reasoning,
            expected_impact=f"Estimated impact across ~{int(region.population * 0.25):,} residents in {region.district_city}",
            recommended_action=recommended_action,
            is_synthetic=True,
            is_demo=True,
        )

    def generate_all_ranked_recommendations(
        self,
        regions: list[Region],
        indicators: list[InfrastructureIndicator],
        requests: list[CitizenRequest],
        investments: list[InvestmentProject],
    ) -> list[PriorityRecommendation]:
        recommendations: list[PriorityRecommendation] = []
        all_cat_keys = list({normalize_category(i.category) for i in indicators})
        if not all_cat_keys:
            all_cat_keys = ["healthcare", "water", "electricity", "transportation", "digital_connectivity", "sanitation"]

        for region in regions:
            region_indicators = [i for i in indicators if i.region_id == region.id]
            region_requests = [r for r in requests if r.region_id == region.id]
            region_investments = [inv for inv in investments if inv.region_id == region.id]

            for cat_key in all_cat_keys:
                ind = next((i for i in region_indicators if normalize_category(i.category) == cat_key), None)
                rec = self.generate_recommendation(
                    region=region,
                    indicator=ind,
                    requests=region_requests,
                    investments=region_investments,
                    category=cat_key,
                )
                recommendations.append(rec)

        recommendations.sort(key=lambda x: x.priority_score, reverse=True)
        return recommendations


recommendation_service = RecommendationService()
