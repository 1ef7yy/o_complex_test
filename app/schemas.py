from pydantic import BaseModel


class WeatherData(BaseModel):
    """Данные о погоде"""

    temperature: list[float]
    wind_speed: list[float]
    relative_humidity: list[int]
    weather_code: list[int]


class Coordinates(BaseModel):
    name: str
    latitude: float
    longitude: float
