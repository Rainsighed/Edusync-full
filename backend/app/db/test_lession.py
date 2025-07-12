from fastapi.testclient import TestClient
from ..main import app

client = TestClient(app)

def test_analyze_lesson():
    response = client.post("/api/v1/lessons/analyze", json={"content": "Sample lesson content"})
    assert response.status_code == 200
    assert "analysis" in response.json()