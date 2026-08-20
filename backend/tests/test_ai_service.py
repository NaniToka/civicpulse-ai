import pytest
from app.services.ai_service import FallbackAIService


@pytest.mark.asyncio
async def test_fallback_ai_service_multilingual_understanding():
    service = FallbackAIService()
    
    # Test Hindi input
    result_hi = await service.process_citizen_text("बिजली कट गई है 6 घंटे से", "hi")
    assert result_hi["category"] == "Clean Energy & Grid Resilience"
    assert result_hi["detected_language"] == "hi"

    # Test Portuguese input
    result_pt = await service.process_citizen_text("Sem esgoto encanado no bairro", "pt")
    assert result_pt["category"] == "Clean Water & Sanitation"
    assert result_pt["detected_language"] == "pt"

    # Test Reasoning generation
    reasoning = await service.generate_recommendation_reasoning(
        region_name="Pune",
        category="Clean Water & Sanitation",
        priority_score=85.4,
        evidence_summary="5,000 households without water"
    )
    assert "Pune" in reasoning
    assert "85.4" in reasoning
