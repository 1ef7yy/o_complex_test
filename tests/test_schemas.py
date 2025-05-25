import pytest
from app.schemas import WeatherData, Coordinates


@pytest.mark.filterwarnings
def test_weather_data():
    data = WeatherData(
        temperature=[10, 20, 30],
        wind_speed=[5.1, 2, 3.5],
        relative_humidity=[5, 2, 3],
        weather_code=[0, 1, 5],
    )
    assert isinstance(data, WeatherData)
    assert data.temperature == [10, 20, 30]
    assert data.wind_speed == [5.1, 2, 3.5]
    assert data.relative_humidity == [5, 2, 3]
    assert data.weather_code == [0, 1, 5]


@pytest.mark.filterwarnings
def test_coordinates():
    coords = Coordinates(name="London", latitude=51.5074, longitude=-0.1278)
    assert isinstance(coords, Coordinates)
    assert coords.name == "London"
    assert coords.latitude == 51.5074
    assert coords.longitude == -0.1278
