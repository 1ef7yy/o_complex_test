const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const cityName = document.getElementById('cityName');
const currentTemp = document.getElementById('currentTemp');
const weatherIcon = document.getElementById('weatherIcon');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const weatherCondition = document.getElementById('weatherCondition');
const historyList = document.getElementById('historyList');

let temperatureChart, windChart, humidityChart;

const weatherCodes = {
    0: '☀️',  // Clear sky
    1: '🌤️',  // Mainly clear
    2: '⛅',  // Partly cloudy
    3: '☁️',  // Overcast
    45: '🌫️', // Fog
    48: '🌫️', // Depositing rime fog
    51: '🌧️', // Light drizzle
    53: '🌧️', // Moderate drizzle
    55: '🌧️', // Dense drizzle
    56: '🌧️❄️', // Light freezing drizzle
    57: '🌧️❄️', // Dense freezing drizzle
    61: '🌧️', // Slight rain
    63: '🌧️', // Moderate rain
    65: '🌧️', // Heavy rain
    66: '🌧️❄️', // Light freezing rain
    67: '🌧️❄️', // Heavy freezing rain
    71: '❄️',  // Slight snow fall
    73: '❄️',  // Moderate snow fall
    75: '❄️',  // Heavy snow fall
    77: '❄️',  // Snow grains
    80: '🌦️', // Slight rain showers
    81: '🌦️', // Moderate rain showers
    82: '🌦️', // Violent rain showers
    85: '🌨️', // Slight snow showers
    86: '🌨️', // Heavy snow showers
    95: '⛈️',  // Thunderstorm
    96: '⛈️',  // Thunderstorm with slight hail
    99: '⛈️'   // Thunderstorm with heavy hail
};

const weatherDescriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Fog with rime",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail"
};

document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    storage = JSON.parse(localStorage.getItem("weatherHistory"));
    console.log(storage[0]);
    if (storage.length != 0) {
        cityInput.value = storage[0];
    }

    searchBtn.addEventListener('click', fetchWeather);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') fetchWeather();
    });
});

async function fetchWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    try {
        const response = await fetch(`http://localhost/api/weather/${encodeURIComponent(city)}`);

        if (!response.ok) {
            throw new Error(response.status === 404 ? 'City not found' : 'Weather data unavailable');
        }

        const data = await response.json();
        displayWeather(city, data);
        addToHistory(city);
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}

function displayWeather(city, data) {
    cityName.textContent = city;
    currentTemp.textContent = `${data.temperature[0].toFixed(1)}°C`;
    humidity.textContent = `${data.relative_humidity[0]}%`;
    windSpeed.textContent = `${data.wind_speed[0].toFixed(1)} km/h`;

    const currentCode = data.weather_code[0];
    weatherIcon.textContent = weatherCodes[currentCode] || '🌈';
    weatherCondition.textContent = weatherDescriptions[currentCode] || 'Unknown';

    updateCharts(data);
}

function updateCharts(data) {
    const hours = Array.from({length: data.temperature.length}, (_, i) => i);

    if (temperatureChart) temperatureChart.destroy();
    temperatureChart = new Chart(
        document.getElementById('temperatureChart'),
        {
            type: 'line',
            data: {
                labels: hours,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: data.temperature,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Temperature Forecast'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Hours'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '°C'
                        }
                    }
                }
            }
        }
    );

    if (windChart) windChart.destroy();
    windChart = new Chart(
        document.getElementById('windChart'),
        {
            type: 'line',
            data: {
                labels: hours,
                datasets: [{
                    label: 'Wind Speed (km/h)',
                    data: data.wind_speed,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Wind Speed Forecast'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Hours'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'km/h'
                        }
                    }
                }
            }
        }
    );

    if (humidityChart) humidityChart.destroy();
    humidityChart = new Chart(
        document.getElementById('humidityChart'),
        {
            type: 'line',
            data: {
                labels: hours,
                datasets: [{
                    label: 'Humidity (%)',
                    data: data.relative_humidity,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Humidity Forecast'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Hours'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '%'
                        },
                        min: 0,
                        max: 100
                    }
                }
            }
        }
    );
}

function addToHistory(city) {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    // remove if already exists
    history = history.filter(item => item.toLowerCase() !== city.toLowerCase());

    history.unshift(city);

    if (history.length > 5) {
        history.pop();
    }

    localStorage.setItem('weatherHistory', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    historyList.innerHTML = history.map(city =>
        `<div class="history-item" onclick="searchFromHistory('${city}')">${city}</div>`
    ).join('');
}

function searchFromHistory(city) {
    cityInput.value = city;
    fetchWeather();
}
