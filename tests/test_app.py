import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_read_main():
    response = client.get("/")
    assert response.status_code == 404


def test_read_weather():
    response = client.get("/api/weather/london")
    assert response.status_code == 200


def test_read_weather_invalid_city():
    response = client.get("/api/weather/ invalid_city")
    assert response.status_code == 404
    assert response.json() == {"detail": "Not Found"}


def test_read_weather_empty_city():
    response = client.get("/api/weather/")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_weather_data():
    from app.weather import get_weather_data

    data = await get_weather_data("london")
    assert data is not None


@pytest.mark.asyncio
async def test_get_weather_data_invalid_city():
    from app.weather import get_weather_data

    data = await get_weather_data(" invalid_city")
    assert data is None


@pytest.mark.asyncio
async def test_geocode():
    from app.weather import geocode

    coords = await geocode("london")
    assert coords is not None


@pytest.mark.asyncio
async def test_geocode_invalid_city():
    from app.weather import geocode

    coords = await geocode(" invalid_city")
    assert coords is None
