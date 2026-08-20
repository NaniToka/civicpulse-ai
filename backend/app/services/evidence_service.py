from app.core.taxonomy import get_category_display_name, normalize_category
from app.models.schemas import (
    CitizenRequest,
    DemandMomentumSignal,
    EvidenceChainStep,
    EvidenceItem,
    FactorContribution,
    InfrastructureIndicator,
    InvestmentOverlapDetail,
    Region,
    WhyThisRecommendation,
)


class CivicEvidenceGraphService:
    """
    Civic Evidence Graph Service.
    Assembles relational evidence items and generates the ordered 6-step Evidence Trail
    (CITIZEN SIGNAL → DEMAND MOMENTUM → INFRASTRUCTURE GAP → DEMOGRAPHIC CONTEXT → INVESTMENT ALIGNMENT → PRIORITY RECOMMENDATION).
    """

    def build_evidence_graph(
        self,
        region: Region,
        category: str,
        requests: list[CitizenRequest],
        indicator: InfrastructureIndicator | None,
        momentum: DemandMomentumSignal,
        overlap: InvestmentOverlapDetail,
        demographic_score: float,
        demographic_explanation: str,
        factors: list[FactorContribution],
        final_score: float,
        priority_level: str,
        risks: list[str]
    ) -> tuple[list[EvidenceItem], list[EvidenceChainStep], WhyThisRecommendation]:
        cat_canonical = normalize_category(category)
        cat_display = get_category_display_name(cat_canonical)
        reg_name = f"{region.district_city}, {region.country}"

        cat_requests = [
            r for r in requests
            if r.region_id == region.id and normalize_category(r.category or r.request_category) == cat_canonical
        ]
        total_reqs = len(cat_requests)
        critical_count = sum(1 for r in cat_requests if (r.urgency or r.extracted_entities.severity) == "CRITICAL")
        gap_score_val = indicator.gap_score if indicator else 0.50
        coverage_pct = indicator.coverage_ratio_pct if indicator else 50.0

        evidence_items: list[EvidenceItem] = []

        # 1. Citizen Demand Evidence Item
        item_demand = EvidenceItem(
            id=f"EVD-{region.country_code}-DEMAND-{cat_canonical.upper()[:4]}",
            type="citizen_demand",
            source="Multilingual Citizen Feedback",
            region_id=region.id,
            category=cat_canonical,
            metric="Verified Citizen Request Count",
            value=float(total_reqs),
            normalized_value=min(100.0, total_reqs * 15.0),
            contribution=next((f.contribution for f in factors if f.name == "Citizen Demand Signal"), 20.0),
            confidence=0.94,
            explanation=f"{total_reqs} verified citizen requests logged ({critical_count} critical urgency signals).",
            is_synthetic=True
        )
        evidence_items.append(item_demand)

        # 2. Demand Momentum Evidence Item
        item_momentum = EvidenceItem(
            id=f"EVD-{region.country_code}-MOMENTUM-{cat_canonical.upper()[:4]}",
            type="demand_momentum",
            source="Temporal Velocity Signal",
            region_id=region.id,
            category=cat_canonical,
            metric="30-Day Demand Trend",
            value=momentum.percentage_change,
            normalized_value=momentum.momentum_score,
            contribution=next((f.contribution for f in factors if f.name == "Demand Velocity Momentum"), 8.0),
            confidence=0.88,
            explanation=f"Demand velocity is {momentum.trend} ({momentum.percentage_change:+.1f}% change vs previous period).",
            is_synthetic=True
        )
        evidence_items.append(item_momentum)

        # 3. Infrastructure Gap Evidence Item
        item_gap = EvidenceItem(
            id=f"EVD-{region.country_code}-GAP-{cat_canonical.upper()[:4]}",
            type="infrastructure_gap",
            source="Municipal Sector Audit",
            region_id=region.id,
            category=cat_canonical,
            metric="Infrastructure Deficit Score",
            value=gap_score_val,
            normalized_value=gap_score_val * 100.0,
            contribution=next((f.contribution for f in factors if f.name == "Infrastructure Deficit Gap"), 18.0),
            confidence=0.92,
            explanation=f"Operational capacity gap score of {gap_score_val:.2f} (Current coverage: {coverage_pct:.1f}%).",
            is_synthetic=True
        )
        evidence_items.append(item_gap)

        # 4. Demographic Need Evidence Item
        item_demo = EvidenceItem(
            id=f"EVD-{region.country_code}-DEMO-{cat_canonical.upper()[:4]}",
            type="demographic_need",
            source="National Demographic Census",
            region_id=region.id,
            category=cat_canonical,
            metric="Category Demographic Vulnerability",
            value=demographic_score,
            normalized_value=demographic_score,
            contribution=next((f.contribution for f in factors if f.name == "Demographic Need Context"), 12.0),
            confidence=0.90,
            explanation=demographic_explanation,
            is_synthetic=True
        )
        evidence_items.append(item_demo)

        # 5. Investment Context Evidence Item
        item_inv = EvidenceItem(
            id=f"EVD-{region.country_code}-INV-{cat_canonical.upper()[:4]}",
            type="investment_context",
            source="National Capital Budget Records",
            region_id=region.id,
            category=cat_canonical,
            metric="Existing Capital Alignment",
            value=float(overlap.budget_usd or 0.0),
            normalized_value=10.0 if overlap.has_overlap and overlap.overlap_type == "ACTIVE_PROJECT" else 90.0,
            contribution=next((f.contribution for f in factors if f.name == "Investment Alignment"), 4.0),
            confidence=0.95,
            explanation=overlap.explanation,
            is_synthetic=True
        )
        evidence_items.append(item_inv)

        # Build Ordered 6-Step Evidence Trail
        chain: list[EvidenceChainStep] = [
            EvidenceChainStep(
                step=1,
                title="Citizen Demand Voices",
                finding=f"{total_reqs} verified citizen complaints in {reg_name}",
                value=f"{total_reqs} requests ({critical_count} critical)",
                contribution=f"+{item_demand.contribution:.1f} pts",
                evidence_item_id=item_demand.id
            ),
            EvidenceChainStep(
                step=2,
                title="Demand Velocity Momentum",
                finding=f"Demand velocity is {momentum.trend} in {reg_name}",
                value=f"{momentum.percentage_change:+.1f}% trend",
                contribution=f"+{item_momentum.contribution:.1f} pts",
                evidence_item_id=item_momentum.id
            ),
            EvidenceChainStep(
                step=3,
                title="Infrastructure Baseline Deficit",
                finding=f"Capacity gap score of {gap_score_val:.2f} (Coverage: {coverage_pct:.1f}%)",
                value=f"{gap_score_val:.2f} deficit",
                contribution=f"+{item_gap.contribution:.1f} pts",
                evidence_item_id=item_gap.id
            ),
            EvidenceChainStep(
                step=4,
                title="Demographic Target Need",
                finding=demographic_explanation,
                value=f"{demographic_score:.1f}/100 vulnerability",
                contribution=f"+{item_demo.contribution:.1f} pts",
                evidence_item_id=item_demo.id
            ),
            EvidenceChainStep(
                step=5,
                title="Public Capital Investment Overlap",
                finding=overlap.explanation,
                value=overlap.overlap_type,
                contribution=f"{item_inv.contribution:+.1f} pts",
                evidence_item_id=item_inv.id
            ),
            EvidenceChainStep(
                step=6,
                title="Priority Recommendation",
                finding=f"Final Priority Score {final_score:.1f}/100 ({priority_level} Priority)",
                value=f"{final_score:.1f}/100",
                contribution="Final Score",
                evidence_item_id=None
            )
        ]

        summary = (
            f"Recommended '{cat_display}' project in {reg_name} (Priority Score: {final_score:.1f}/100, {priority_level}). "
            f"Traceable through {len(evidence_items)} evidence items: {total_reqs} citizen complaints ({momentum.trend} trend), "
            f"deficit score {gap_score_val:.2f}, and vulnerability index {region.vulnerability_index:.2f}."
        )

        why_this_recommendation = WhyThisRecommendation(
            recommendation_id=f"REC-{region.country_code}-{cat_canonical.upper()[:4]}",
            summary=summary,
            overall_confidence=0.92,
            evidence_chain=chain,
            factors=factors,
            risks=risks
        )

        return evidence_items, chain, why_this_recommendation


civic_evidence_graph_service = CivicEvidenceGraphService()
