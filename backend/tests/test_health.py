from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "CivicPulse AI"
    assert data["status"] == "online"
    assert data["health"] == "/api/v1/health"


def test_health_check_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "CivicPulse AI" in data["service"]


def test_regions_endpoint():
    response = client.get("/api/v1/regions")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "country" in data[0]


def test_recommendations_endpoint():
    response = client.get("/api/v1/recommendations")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "priority_score" in data[0]
    # Check that recommendations are sorted descending
    scores = [r["priority_score"] for r in data]
    assert scores == sorted(scores, reverse=True)
