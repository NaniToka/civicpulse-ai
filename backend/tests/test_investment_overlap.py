from app.models.schemas import InvestmentProject
from app.services.investment_service import investment_overlap_engine


def test_active_investment_overlap():
    active_inv = InvestmentProject(
        id="INV-ACTIVE",
        project_name="Water Main Extension",
        region_id="REG-1",
        category="water",
        budget_usd=5000000.0,
        status="active",
        planned_start="2025-01-01",
        is_synthetic=True,
    )

    detail = investment_overlap_engine.evaluate_investment_overlap("REG-1", "water", [active_inv])
    assert detail.has_overlap is True
    assert detail.overlap_type == "ACTIVE_PROJECT"
    assert detail.project_id == "INV-ACTIVE"
    assert "underway" in detail.explanation.lower()


def test_delayed_investment_overlap():
    delayed_inv = InvestmentProject(
        id="INV-DELAYED",
        project_name="Hospital Construction",
        region_id="REG-1",
        category="healthcare",
        budget_usd=12000000.0,
        status="delayed",
        planned_start="2024-01-01",
        is_synthetic=True,
    )

    detail = investment_overlap_engine.evaluate_investment_overlap("REG-1", "healthcare", [delayed_inv])
    assert detail.has_overlap is True
    assert detail.overlap_type == "DELAYED_PROJECT"
    assert "delayed" in detail.explanation.lower()


def test_no_investment_overlap():
    detail = investment_overlap_engine.evaluate_investment_overlap("REG-1", "electricity", [])
    assert detail.has_overlap is False
    assert detail.overlap_type == "NONE"
