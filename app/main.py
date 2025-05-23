from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse
from .weather import get_weather_data
from .schemas import WeatherData


app = FastAPI(title="Weather app", version="1.0.0")


app.mount("/static", StaticFiles(directory="static"), name="static")


templates = Jinja2Templates(directory="templates")


@app.get("/api/weather/{city}", response_class=JSONResponse)
async def getWeather(city: str) -> WeatherData:
    data = await get_weather_data(city)
    if not data:
        return HTTPException(status_code=404)

    return data


@app.get("/test")
async def test_route():
    return {"code": 401}
