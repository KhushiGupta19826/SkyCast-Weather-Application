let API_KEY = "29c2b524b950dbc23b18ed9c922276b4";
let apiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";


let searchInput = document.getElementById("cityname");
let searchButton = document.getElementById("searchBtn");
let darkMode = document.getElementById("darkmode");
let lightMode = document.getElementById("lightmode");

darkMode.addEventListener("click" , ()=>{
    document.body.classList.add("dark-mode");
});
lightMode.addEventListener("click" , () =>{
    document.body.classList.remove("dark-mode");
});

let weatherData = async (lat, lon) =>{
    let forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    let response = await fetch(forecastApiUrl);
    let data = response.json();
    console.log(data);

    let forecastConatiner = document.querySelector(".forecastCards");
    forecastConatiner.innerHTML = "";

    for(let i = 0;i<5;i++){
        let dayData = data.list[i*8];
        let temp = Math.round(dayData.main.temp);
        let description = dayData.weather[0].description;
        let iconCode = dayData.weather[0].icon;
        let dayName = new Date(dayData.dt*1000).toLocaleDateString("en-US", {
           weekday : "long", 
        });

        forecastConatiner.innerHTML += `
        <div class = "forecast-card">
        <h4>${dayName}</h4>
        <img src = "https://openweathermap.org/img/wn/${iconCode}@2px.png" alt = "WeatherIcon" class = "weatherIcon">
        <p>${temp}C</p>
        <p>${description}</p>
        </div>
        `;
    }
};

