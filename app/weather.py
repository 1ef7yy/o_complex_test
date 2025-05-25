import httpx
from .schemas import WeatherData, Coordinates

GEOCODING_API_URL = "https://nominatim.openstreetmap.org"
WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast"


async def get_weather_data(city: str) -> WeatherData:
    coords = await geocode(city)
    if coords is None:
        return None
    async with httpx.AsyncClient() as client:
        params = {
            "latitude": coords.latitude,
            "longitude": coords.longitude,
            "hourly": "temperature_2m,relative_humidity_2m,wind_speed_10m,\
weather_code",
        }
        response = await client.get(f"{WEATHER_API_URL}", params=params)

        print(response.url)
        if response.status_code == 200 and response.json():
            data = response.json()
            return WeatherData(
                temperature=data["hourly"]["temperature_2m"],
                relative_humidity=data["hourly"]["relative_humidity_2m"],
                wind_speed=data["hourly"]["wind_speed_10m"],
                weather_code=data["hourly"]["weather_code"],
            )
        print(response.status_code)

        return None


async def geocode(city: str) -> Coordinates:
    async with httpx.AsyncClient() as client:
        params = {"city": city, "format": "json"}
        response = await client.get(f"{GEOCODING_API_URL}/search", params=params)

        if response.status_code == 200 and response.json():
            data = response.json()[0]
            print(data)
            return Coordinates(
                name=data["name"], latitude=data["lat"], longitude=data["lon"]
            )
        return None
