from app.core.taxonomy import (
    get_all_categories,
    get_category_display_name,
    normalize_category,
)


def test_taxonomy_centralization():
    categories = get_all_categories()
    assert len(categories) >= 15
    keys = [c.key for c in categories]
    assert "healthcare" in keys
    assert "water" in keys
    assert "electricity" in keys
    assert "roads" in keys
    assert "digital_connectivity" in keys


def test_category_normalization_and_aliases():
    # Exact key
    assert normalize_category("healthcare") == "healthcare"

    # Display name
    assert normalize_category("Clean Water") == "water"

    # Legacy strings
    assert normalize_category("Clean Water & Sanitation") == "water"
    assert normalize_category("Clean Energy & Grid Resilience") == "electricity"
    assert normalize_category("Healthcare & Sanitation") == "healthcare"
    assert normalize_category("Public Transit & Roads") == "transportation"
    assert normalize_category("Digital Infrastructure") == "digital_connectivity"

    # Native language substring heuristics
    assert normalize_category("पानी पाइपलाइन समस्या") == "water"
    assert normalize_category("अस्पताल में बेड नहीं") == "healthcare"

    # Fallback to 'other'
    assert normalize_category("random unrecognized string") == "other"


def test_category_display_names():
    assert get_category_display_name("water") == "Clean Water"
    assert get_category_display_name("Clean Water & Sanitation") == "Clean Water"
    assert get_category_display_name("healthcare") == "Healthcare"
