let apiLat = 52.520008;
let apiLon = 13.404954;

let cityInput = document.getElementById("city-input");
let cityOutput = document.getElementById("city");
let tempOutput = document.getElementById("temperature");
let timeOutput = document.getElementById("time");
let dateOutput = document.getElementById("date");
let minTemp = document.getElementById("min-temp");
let maxTemp = document.getElementById("max-temp");
let sunriseOutput = document.getElementById("sunrise");
let sunsetOutput = document.getElementById("sunset");
let windOutput = document.getElementById("wind");
let cloudOutput = document.getElementById("cloud");
let pressureOutput = document.getElementById("pressure");
let humidityOutput = document.getElementById("humidity");
let sunriseIcon = document.getElementById("sunrise-icon");
let sunsetIcon = document.getElementById("sunset-icon");
let windIcon = document.getElementById("wind-icon");
let cloudIcon = document.getElementById("cloud-icon");
let pressureIcon = document.getElementById("pressure-icon");
let humidityIcon = document.getElementById("humidity-icon");
let button1 = document.querySelector("button");

let sunMoon = document.getElementById("sun-moon");
let lightDark = document.getElementById("background-pic");
let rainSnowMist = document.getElementById("rain-snow-mist");
let skyClouds = document.getElementById("sky-clouds");

let cityName = "Berlin";
//text-input on type search for cities starting with typed

button1.addEventListener(`click`, (event) => {
    event.preventDefault();

    cityName = cityInput.value;

    fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=4173aa10ec56577132130b02982fd329`
    )
        .then((response) => response.json())
        .then((data1) => {
            cityOutput.innerHTML =
                "<span style = 'color:rgb(183, 51, 51)'>undefined city</span>";
            if (typeof data1[0] !== "undefined") {
                cityOutput.innerHTML = cityName;
            }
            apiLat = data1[0].lat;
            apiLon = data1[0].lon;
            console.log(data1[0].lat);
            calcLocation();
        });
});
setInterval(calcLocation, 60000);
calcLocation();
function calcLocation() {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${apiLat}&lon=${apiLon}&appid={APIkey}`
    )
        .then((response) => response.json())
        .then((data) => {
            let dateTime = new Date(data.dt * 1000);
            let toUtc =
                dateTime.getTime() + dateTime.getTimezoneOffset() * 60000;
            let currentLocalTime = toUtc + 1000 * data.timezone;
            const localTime = new Date(currentLocalTime);
            const sunrise = new Date((data.sys.sunrise + data.timezone) * 1000);
            const sunset = new Date((data.sys.sunset + data.timezone) * 1000);
            const wind = data.wind.speed;
            const windDirection = data.wind.deg;
            const windDirectionPosition = windDirectionDeg(windDirection);
            const cloudData = data.weather[0].description;
            let iconTag = data.weather[0].icon;
            const pressureData = data.main.pressure;
            const humidityData = data.main.humidity;
            console.log(iconTag.slice(0, 2));

            if (iconTag.slice(-1) == "d") {
                lightDark.src = "./assets/img/clear_sky.png";
                sunMoon.src = "./assets/img/sun.png";
            } else {
                lightDark.src = "./assets/img/clear_night.png";
                sunMoon.src = "./assets/img/moon.png";
            }
            if (iconTag.slice(0, 2) == "01") {
                skyClouds.style.visibility = "hidden";
                rainSnowMist.style.visibility = "hidden";
            } else if (iconTag.slice(0, 2) == "02") {
                skyClouds.src = "./assets/img/few_clouds.png";
                skyClouds.style.visibility = "visible";
                rainSnowMist.style.visibility = "hidden";
            } else if (iconTag.slice(0, 2) == "03") {
                skyClouds.src = "./assets/img/shattered_clouds.png";
                skyClouds.style.visibility = "visible";
                rainSnowMist.style.visibility = "hidden";
            } else if (iconTag.slice(0, 2) == "04") {
                skyClouds.src = "./assets/img/broken_clouds.png";
                skyClouds.style.visibility = "visible";
                rainSnowMist.style.visibility = "hidden";
            } else if (iconTag.slice(0, 2) == "09") {
                skyClouds.src = "./assets/img/broken_clouds.png";
                skyClouds.style.visibility = "visible";
                rainSnowMist.src = "./assets/img/rain.png";
                rainSnowMist.style.visibility = "visible";
            } else if (iconTag.slice(0, 2) == "10") {
                skyClouds.src = "./assets/img/shattered_clouds.png";
                skyClouds.style.visibility = "visible";
                rainSnowMist.src = "./assets/img/rain.png";
                rainSnowMist.style.visibility = "visible";
            } else if (iconTag.slice(0, 2) == "11") {
                skyClouds.src = "./assets/img/thunder.png";
                skyClouds.style.visibility = "visible";
                rainSnowMist.src = "./assets/img/rain.png";
                rainSnowMist.style.visibility = "visible";
            } else if (iconTag.slice(0, 2) == "13") {
                skyClouds.src = "./assets/img/broken_clouds.png";
                skyClouds.style.visibility = "visible";
                rainSnowMist.src = "./assets/img/snow.png";
                rainSnowMist.style.visibility = "visible";
            } else if (iconTag.slice(0, 2) == "50") {
                skyClouds.src = "./assets/img/broken_clouds.png";
                skyClouds.style.visibility = "visible";
                rainSnowMist.src = "./assets/img/mist.png";
                rainSnowMist.style.visibility = "visible";
                console.log(rainSnowMist.src);
            }

            timeOutput.innerText = `${String(localTime.getHours()).padStart(
                2,
                "0"
            )}:${String(localTime.getMinutes()).padStart(2, "0")}`;
            tempOutput.innerText = `${Math.round(data.main.temp - 273.15)} C°`;
            dateOutput.innerText = `${weekDay(
                localTime
            )}, ${localTime.toLocaleDateString()}`;

            sunriseOutput.innerText = sunrise.toLocaleTimeString();
            sunsetOutput.innerText = sunset.toLocaleTimeString();
            windOutput.innerHTML = `${windDirectionPosition} (${windDirection}) <br>${wind} m/s`;
            cloudOutput.innerText = cloudData;
            cloudIcon.src = `http://openweathermap.org/img/wn/${iconTag}@2x.png`;
            windIcon.setAttribute(
                `style`,
                `transform:rotate(${windDirection}deg)`
            );
            pressureOutput.innerText = `${pressureData} hpa`;
            humidityOutput.innerText = `${humidityData} %`;
            console.log(data);
            console.log(data.weather[0].description);
        });
}

function windDirectionDeg(windDirection) {
    if (windDirection <= 22.5 || windDirection > 337.5) {
        return `N`;
    } else if (22.5 < windDirection || windDirection >= 67.5) {
        return `NE`;
    } else if (67.5 < windDirection || windDirection >= 112.5) {
        return `E`;
    } else if (112.5 < windDirection || windDirection >= 157.5) {
        return `SE`;
    } else if (157.5 < windDirection || windDirection >= 202.5) {
        return `S`;
    } else if (202.5 < windDirection || windDirection >= 237.5) {
        return `SW`;
    } else if (237.5 < windDirection || windDirection >= 282.5) {
        return `W`;
    } else if (282.5 < windDirection || windDirection >= 337.5) {
        return `NW`;
    }
}

function weekDay(a, locale = "en-US") {
    return a.toLocaleDateString(locale, { weekday: `short` });
}
