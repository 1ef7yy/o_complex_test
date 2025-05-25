from pydantic import BaseModel


class WeatherData(BaseModel):
    """Данные о погоде"""

    temperature: list[float]
    description: str


class Coordinates(BaseModel):
    name: str
    latitude: float
    longitude: float
