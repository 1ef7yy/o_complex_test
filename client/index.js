// Сохраняем историю поиска в localStorage
let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

// Загружаем историю при старте
document.addEventListener('DOMContentLoaded', function() {
    updateHistoryDisplay();

    // Если есть последний запрошенный город, показываем его
    if(searchHistory.length > 0) {
        document.getElementById('cityInput').value = searchHistory[0].city;
        getWeather();
    }
});

// Функция для получения погоды
async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if(!city) return;

    const weatherResult = document.getElementById('weatherResult');
    weatherResult.innerHTML = '<div class="loading"><div class="spinner"></div><p>Загрузка...</p></div>';

    try {
        const response = await fetch(`http://localhost/api/weather/${encodeURIComponent(city)}`);

        if(!response.ok) {
            throw new Error(response.status === 404 ? 'Город не найден' : 'Ошибка сервера');
        }

        const data = await response.json();

        addToHistory(city);

        displayWeather(data);
    } catch(error) {
        weatherResult.innerHTML = `<div class="error">Ошибка: ${error.message}</div>`;
    }
}

// Отображение данных о погоде
function displayWeather(data) {
    const weatherResult = document.getElementById('weatherResult');

    weatherResult.innerHTML = `
        <div class="weather-card">
            <h2>Погода в ${data.city}</h2>
            <div class="weather-info">
                <div class="weather-item">
                    <span>Температура:</span>
                    <strong>${data.temperature} °C</strong>
                </div>
                <div class="weather-item">
                    <span>Влажность:</span>
                    <strong>${data.humidity}%</strong>
                </div>
                <div class="weather-item">
                    <span>Скорость ветра:</span>
                    <strong>${data.wind_speed} км/ч</strong>
                </div>
                <div class="weather-item">
                    <span>Описание:</span>
                    <strong>${data.description}</strong>
                </div>
            </div>
        </div>
    `;
}

// Добавление города в историю
function addToHistory(city) {
    // Удаляем город из истории, если он уже есть
    searchHistory = searchHistory.filter(item => item.city.toLowerCase() !== city.toLowerCase());

    // Добавляем город в начало истории
    searchHistory.unshift({
        city: city,
        timestamp: new Date().toLocaleString()
    });

    // Сохраняем только последние 5 запросов
    if(searchHistory.length > 5) {
        searchHistory.pop();
    }

    // Сохраняем в localStorage
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));

    // Обновляем отображение истории
    updateHistoryDisplay();
}

// Обновление отображения истории
function updateHistoryDisplay() {
    const historyElement = document.getElementById('searchHistory');

    if(searchHistory.length === 0) {
        historyElement.innerHTML = '<p>История запросов пуста</p>';
        return;
    }

    historyElement.innerHTML = searchHistory.map(item => `
        <div class="history-item" onclick="loadFromHistory('${item.city}')">
            <span>${item.city}</span>
            <small>${item.timestamp}</small>
        </div>
    `).join('');
}

// Загрузка города из истории
function loadFromHistory(city) {
    document.getElementById('cityInput').value = city;
    getWeather();
}

// Поиск при нажатии Enter
document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if(e.key === 'Enter') {
        getWeather();
    }
});
