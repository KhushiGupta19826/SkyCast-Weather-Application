let API_KEY = "29c2b524b950dbc23b18ed9c922276b4";
let currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// DOM Elements
let searchInput = document.getElementById("cityname");
let searchButton = document.getElementById("searchBtn");
let darkMode = document.getElementById("darkmode");
let lightMode = document.getElementById("lightmode");

// Dark Mode
darkMode.addEventListener("click", () => {
    document.body.classList.add("dark-mode");
});

// Light Mode
lightMode.addEventListener("click", () => {
    document.body.classList.remove("dark-mode");
});

// ✅ Fetch Forecast (5 days)
let fetchForecast = async (lat, lon) => {
    let forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    let response = await fetch(forecastApiUrl);
    let data = await response.json();
    console.log(data);

    let forecastContainer = document.querySelector(".forecastCards");
    forecastContainer.innerHTML = "";

    for (let i = 0; i < 5; i++) {
        let dayData = data.list[i * 8]; // pick one reading per day
        let temp = Math.round(dayData.main.temp);
        let description = dayData.weather[0].description;
        let iconCode = dayData.weather[0].icon;
        let dayName = new Date(dayData.dt * 1000).toLocaleDateString("en-US", {
            weekday: "long",
        });

        forecastContainer.innerHTML += `
        <div class="forecast-card">
            <h4>${dayName}</h4>
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="WeatherIcon" class="weatherIcon">
            <p>${temp}°C</p>
            <p>${description}</p>
        </div>
        `;
    }
};

// ✅ Fetch Current Weather
async function fetchWeather(city) {
    let response = await fetch(currentWeatherUrl + city + `&appid=${API_KEY}`);
    let data = await response.json();

    if (data.cod !== 200) {
        alert("City not found!");
        return;
    }

    document.querySelector(".cityName").innerHTML = data.name;
    let temperature_value = Math.round(data.main.temp);
    document.querySelector(".tempDisplay").innerHTML = `${temperature_value}°C`;
    document.querySelector(".condition").innerHTML = data.weather[0].description;

    let weatherImg = document.querySelector(".WeatherIcon");
    let iconCode = data.weather[0].icon;
    weatherImg.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Apply theme dynamically
    applyWeatherTheme(data.weather[0].main);

    // Converter
    document.getElementById("degreeCelcius").addEventListener("click", () => {
        document.querySelector(".tempDisplay").innerHTML = `${temperature_value}°C`;
    });

    document.getElementById("degreeFahrenheit").addEventListener("click", () => {
        let temperature_fahrenheit = (temperature_value * 1.8) + 32;
        document.querySelector(".tempDisplay").innerHTML = `${temperature_fahrenheit.toFixed(2)}°F`;
    });

    // Fetch forecast
    await fetchForecast(data.coord.lat, data.coord.lon);
}

// ✅ Themes based on weather condition
function applyWeatherTheme(condition) {
    document.body.classList.remove("sunny-theme", "rainy-theme", "foggy-theme", "snowy-theme", "cloudy-theme");

    switch (condition.toLowerCase()) {
        case "clear":
            document.body.classList.add("sunny-theme");
            break;
        case "rain":
        case "drizzle":
        case "thunderstorm":
            document.body.classList.add("rainy-theme");
            break;
        case "clouds":
            document.body.classList.add("cloudy-theme");
            break;
        case "snow":
            document.body.classList.add("snowy-theme");
            break;
        case "mist":
        case "fog":
        case "haze":
            document.body.classList.add("foggy-theme");
            break;
        default:
            document.body.classList.add("light-mode");
    }
}

// ✅ Search Button
searchButton.addEventListener("click", async (e) => {
    e.preventDefault();
    let city = searchInput.value; // FIXED
    if (city) {
        await fetchWeather(city);
    } else {
        alert("Please enter a city name");
    }
});
