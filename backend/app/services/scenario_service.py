from app.core.taxonomy import normalize_category
from app.models.schemas import (
    CitizenRequest,
    InfrastructureIndicator,
    InvestmentProject,
    Region,
    ScenarioWhatIfInput,
    ScenarioWhatIfResult,
)
from app.services.scoring_engine import scoring_engine


class ScenarioSimulationService:
    """
    Scenario What-If Simulation Engine.
    Simulates the impact of hypothetical capital investments and policy interventions
    on infrastructure deficit scores and priority ranks.
    """

    def simulate_scenario(
        self,
        payload: ScenarioWhatIfInput,
        region: Region,
        indicator: InfrastructureIndicator | None,
        requests: list[CitizenRequest],
        investments: list[InvestmentProject],
    ) -> ScenarioWhatIfResult:
        category = normalize_category(payload.category)

        # 1. Calculate baseline priority score
        orig_res = scoring_engine.calculate_priority_score(
            region=region,
            indicator=indicator,
            requests=requests,
            investments=investments,
            category=category,
        )
        orig_score = orig_res[0]

        # 2. Estimate coverage addition based on budget allocation
        added_coverage_pct = min(40.0, (payload.budget_allocation_usd / 10_000_000.0) * 15.0)
        current_gap = indicator.gap_score if indicator else 0.60
        simulated_gap = max(0.05, current_gap - (added_coverage_pct / 100.0))

        simulated_ind = InfrastructureIndicator(
            id="SIM-IND",
            region_id=region.id,
            category=category,
            current_capacity_pct=min(100.0, (indicator.current_capacity_pct if indicator else 40.0) + added_coverage_pct),
            demand_index=indicator.demand_index if indicator else 80.0,
            coverage_ratio_pct=min(100.0, (indicator.coverage_ratio_pct if indicator else 45.0) + added_coverage_pct),
            gap_score=simulated_gap,
            last_assessed="2026-SIMULATED",
            is_synthetic=True,
            is_demo=True,
        )

        # 3. Simulate post-intervention priority score
        sim_res = scoring_engine.calculate_priority_score(
            region=region,
            indicator=simulated_ind,
            requests=requests,
            investments=investments,
            category=category,
        )
        sim_score = sim_res[0]

        score_delta = round(sim_score - orig_score, 1)
        beneficiaries = int(region.population * (added_coverage_pct / 100.0))

        return ScenarioWhatIfResult(
            original_priority_score=orig_score,
            simulated_priority_score=sim_score,
            score_delta=score_delta,
            projected_gap_score=round(simulated_gap, 2),
            expected_population_beneficiaries=beneficiaries,
            simulation_notes=(
                f"Allocating ${payload.budget_allocation_usd:,.0f} USD is projected to reduce the infrastructure gap "
                f"from {current_gap:.2f} to {simulated_gap:.2f}, benefiting ~{beneficiaries:,} citizens in {region.district_city}."
            ),
        )


scenario_simulation_service = ScenarioSimulationService()
