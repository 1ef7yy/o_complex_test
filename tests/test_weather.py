import pytest
from app.weather import get_weather_data, geocode
from app.schemas import WeatherData, Coordinates


@pytest.mark.asyncio
async def test_get_weather_data_integration():
    data = await get_weather_data("london")
    assert data is not None
    assert isinstance(data, WeatherData)
    assert data.temperature is not None
    assert data.description is not None


@pytest.mark.asyncio
async def test_geocode_integration():
    coords = await geocode("london")
    assert coords is not None
    assert isinstance(coords, Coordinates)
    assert coords.name is not None
    assert coords.latitude is not None
    assert coords.longitude is not None
