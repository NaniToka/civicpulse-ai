from app.core.taxonomy import normalize_category
from app.models.schemas import InvestmentOverlapDetail, InvestmentProject


class InvestmentOverlapEngine:
    """
    Investment Overlap Engine.
    Detects public capital investment overlap with citizen demand signals and evaluates
    project statuses (active, planned, delayed, completed, proposed).
    """

    def evaluate_investment_overlap(
        self, region_id: str, category: str, investments: list[InvestmentProject]
    ) -> InvestmentOverlapDetail:
        cat_canonical = normalize_category(category)

        cat_investments = [
            inv for inv in investments
            if inv.region_id == region_id and normalize_category(inv.category) == cat_canonical
        ]

        if not cat_investments:
            return InvestmentOverlapDetail(
                has_overlap=False,
                overlap_type="NONE",
                explanation="No active or planned public capital projects detected in sector for this region."
            )

        # Check for active projects
        active_inv = next(
            (inv for inv in cat_investments if inv.status.lower() in ["active", "approved", "in_progress"]),
            None
        )
        if active_inv:
            return InvestmentOverlapDetail(
                has_overlap=True,
                overlap_type="ACTIVE_PROJECT",
                project_id=active_inv.id,
                project_name=active_inv.project_name,
                project_status=active_inv.status,
                budget_usd=active_inv.budget_usd,
                explanation=(
                    f"Active capital project '{active_inv.project_name}' (${active_inv.budget_usd:,.0f} USD) is "
                    f"currently underway. Priorities should target remaining unaddressed coverage gaps."
                )
            )

        # Check for delayed projects
        delayed_inv = next(
            (inv for inv in cat_investments if inv.status.lower() in ["delayed"]),
            None
        )
        if delayed_inv:
            return InvestmentOverlapDetail(
                has_overlap=True,
                overlap_type="DELAYED_PROJECT",
                project_id=delayed_inv.id,
                project_name=delayed_inv.project_name,
                project_status=delayed_inv.status,
                budget_usd=delayed_inv.budget_usd,
                explanation=(
                    f"Project '{delayed_inv.project_name}' is DELAYED. Heightened policy intervention required "
                    f"to expedite execution and satisfy mounting citizen demand."
                )
            )

        # Check for planned projects
        planned_inv = next(
            (inv for inv in cat_investments if inv.status.lower() in ["planned", "proposed"]),
            None
        )
        if planned_inv:
            return InvestmentOverlapDetail(
                has_overlap=True,
                overlap_type="PLANNED_PROJECT",
                project_id=planned_inv.id,
                project_name=planned_inv.project_name,
                project_status=planned_inv.status,
                budget_usd=planned_inv.budget_usd,
                explanation=(
                    f"Capital project '{planned_inv.project_name}' is planned for start in {planned_inv.planned_start}."
                )
            )

        # Completed or default fallback
        inv_first = cat_investments[0]
        return InvestmentOverlapDetail(
            has_overlap=True,
            overlap_type="COMPLETED_PROJECT",
            project_id=inv_first.id,
            project_name=inv_first.project_name,
            project_status=inv_first.status,
            budget_usd=inv_first.budget_usd,
            explanation=f"Prior project '{inv_first.project_name}' recorded in sector."
        )


investment_overlap_engine = InvestmentOverlapEngine()
