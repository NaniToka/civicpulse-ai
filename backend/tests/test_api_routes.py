from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_categories_endpoint():
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    categories = response.json()
    assert len(categories) >= 15
    keys = [c["key"] for c in categories]
    assert "healthcare" in keys
    assert "water" in keys


def test_regions_endpoint():
    response = client.get("/api/v1/regions")
    assert response.status_code == 200
    regions = response.json()
    assert len(regions) >= 4
    assert regions[0]["id"] is not None


def test_demand_summary_endpoint():
    response = client.get("/api/v1/demand/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_requests" in data
    assert "category_distribution" in data


def test_demand_hotspots_endpoint():
    response = client.get("/api/v1/demand/hotspots")
    assert response.status_code == 200
    hotspots = response.json()
    assert len(hotspots) > 0
    assert "hotspot_score" in hotspots[0]
    assert "per_capita_demand_per_100k" in hotspots[0]


def test_recommendations_endpoint():
    response = client.get("/api/v1/recommendations")
    assert response.status_code == 200
    recs = response.json()
    assert len(recs) > 0
    assert recs[0]["priority_score"] >= recs[-1]["priority_score"]

    rec_id = recs[0]["id"]
    explanation_res = client.get(f"/api/v1/recommendations/{rec_id}/explanation")
    assert explanation_res.status_code == 200
    exp = explanation_res.json()
    assert exp["recommendation_id"] == rec_id
    assert len(exp["factors"]) == 6


def test_citizen_request_ingest_endpoint():
    payload = {
        "source": "web",
        "language": "hi",
        "raw_text": "हमारे इलाके में पानी नहीं आ रहा है पिण्याच्या पाण्याची समस्या",
        "region_id": "REG-IND-UP-KANP-02",
    }
    response = client.post("/api/v1/citizen-requests", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["category"] == "water"
    assert data["id"].startswith("REQ-USER-")


def test_scenario_what_if_endpoint():
    payload = {
        "region_id": "REG-IND-UP-KANP-02",
        "category": "healthcare",
        "budget_allocation_usd": 15000000.0,
    }
    response = client.post("/api/v1/scenario/what-if", json=payload)
    assert response.status_code == 200
    result = response.json()
    assert "original_priority_score" in result
    assert "simulated_priority_score" in result
    assert result["expected_population_beneficiaries"] > 0
