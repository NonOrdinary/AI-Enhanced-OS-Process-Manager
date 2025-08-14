import pytest
from httpx import AsyncClient
from backend.app.main import app # <-- Corrected import

pytestmark = pytest.mark.asyncio

async def test_optimize_route_success():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
          "locations": [
            {"name": "Warehouse", "x": 0, "y": 0},
            {"name": "Customer A", "x": 5, "y": 5}
          ]
        }
        response = await ac.post("/optimize-route", json=payload)
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data["ordered_route"]) == 2