from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .weather import get_weather_data
from .schemas import WeatherData


app = FastAPI(title="Weather app", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development only)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.get("/api/weather/{city}")
async def getWeather(city: str) -> WeatherData:
    data = await get_weather_data(city)
    if data is None:
        raise HTTPException(status_code=404)

    return data


@app.get("/test")
async def test_route():
    return {"code": 401}
