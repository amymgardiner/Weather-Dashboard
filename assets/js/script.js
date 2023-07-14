var apiKey = "66bf34535fb3ce4cc5102bab886f4c2b";
searchBtn = document.querySelector(".search-button");
var cityTitle = document.querySelector("#city-name");
var cityButtons = document.querySelector("#city-buttons");
var currentWeatherContainer = document.querySelector("#current-city");
var searchValue = document.getElementById('search-input');
var recentSearch = JSON.parse(localStorage.getItem("recentsearch"));

// function to get city's zip code from user
// the zip code is used to get the city's name for the HTML and used to get the latitude and longitude
// the lat and lon are used to call the next function
var getZipCode = function(event, zipCode) {
    event.preventDefault();
    zipCode = zipCode || document.querySelector(".form-control").value.trim();
    var zipApi = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode}&appid=${apiKey}`;  
   
    fetch(zipApi)
    .then(function(response) {
        if(response.ok){
            response.json().then(function(data){

                // get lat and lon for next function
                var lon = data.lon;
                var lat = data.lat;
                getWeather(lat, lon);
                fivedayForecast(lat, lon);

                currentWeatherContainer.classList = "border border-dark div-color"

                // get city name from api and display on screen in current weather section
                var cityName = data.name;
                cityTitle.innerHTML = cityName;

                localStorage.setItem("recentsearch", JSON.stringify(data));
                cityButtons.innerHTML += `<button type="button" class="btn cities" data-city='${JSON.stringify(data)}'>${data.name} + ${data.zip}</button>`;
            });
        } else {
            displayError();
        }
    });
};


// the weather app is finally called to get the rest of the html weather information using the lat and lon
var getWeather = function(lat, lon) {
    searchValue.value = ""
    var weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(weatherApi)
    .then(function(response) {
        if(response.ok){
            response.json().then(function(data){
            // get time zone and send to time zone function to display in current weather section
            var timeZone = data.timezone;
            var date = luxon.DateTime.now().setZone(`${timeZone}`).toFormat('MM-dd-yyyy');

            // display current weather icon and date from time zone in after current city name
            var currentIcon = data.current.weather[0].icon;
            cityTitle.innerHTML += "  " + `${date}` + `<img src="https://openweathermap.org/img/wn/${currentIcon}.png">`;

            // display current weather temp, wind, humidity, and index
            var temp = data.current.temp;
            var wind = data.current.wind_speed;
            var humidity = data.current.humidity;
            var uvIndex = data.current.uvi;
            
            var displayTemp = document.querySelector("#temp");
            displayTemp.innerHTML = "Temperature: " + temp + "°F";

            var displayWind = document.querySelector("#wind");
            displayWind.innerHTML = "Wind: " + wind + " MPH";

            var displayHumidity = document.querySelector("#humidity");
            displayHumidity.innerHTML = "Humidity: " + humidity + "%";

            var displayUV = document.querySelector("#uv");
            displayUV.innerHTML = "UV Index: " + uvIndex;
            
            uvIndexColor(uvIndex);
            });
        }  
    });
};

// function to display uv index level with color codes from bootstrap
var uvIndexColor = function(uvIndex) {
    var uvColor = document.querySelector("#uv");
    if(uvIndex < 3) {
        uvColor.classList = "bg-primary stats";
    } else if(uvIndex < 6) {
        uvColor.classList = "bg-success stats";
    } else if(uvIndex < 8) {
        uvColor.classList = "bg-warning stats";
    } else if(uvIndex < 11) {
        uvColor.classList = "bg-danger stats";
    } else {
        uvColor.classList = "bg-dark stats";
    }
};


// five day forecast function to fetch from weather api, loop through daily array, grab info from first five days
// displays on screen under current day's weather
var fivedayForecast = function (lat, lon) {
    var weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(weatherApi)
    .then(function(response) {
        if(response.ok){
            response.json().then(function(data){

                document.getElementById("forecast").textContent = "Five Day Forecast"
                document.getElementById("five-day-forecast").classList = "border border-dark div-colortwo"

                    document.getElementById("dayone").innerHTML = luxon.DateTime.fromMillis((data.daily[1].dt * 1000)).toFormat('MM-dd-yyyy')
                    document.getElementById("daytwo").innerHTML = luxon.DateTime.fromMillis((data.daily[2].dt * 1000)).toFormat('MM-dd-yyyy')
                    document.getElementById("daythree").innerHTML = luxon.DateTime.fromMillis((data.daily[3].dt * 1000)).toFormat('MM-dd-yyyy')
                    document.getElementById("dayfour").innerHTML = luxon.DateTime.fromMillis((data.daily[4].dt * 1000)).toFormat('MM-dd-yyyy')
                    document.getElementById("dayfive").innerHTML = luxon.DateTime.fromMillis((data.daily[5].dt * 1000)).toFormat('MM-dd-yyyy')

                    document.getElementById("dayone-icon").innerHTML = `<img src="https://openweathermap.org/img/wn/${data.daily[1].weather[0].icon}.png">`
                    document.getElementById("daytwo-icon").innerHTML = `<img src="https://openweathermap.org/img/wn/${data.daily[2].weather[0].icon}.png">`
                    document.getElementById("daythree-icon").innerHTML = `<img src="https://openweathermap.org/img/wn/${data.daily[3].weather[0].icon}.png">`
                    document.getElementById("dayfour-icon").innerHTML = `<img src="https://openweathermap.org/img/wn/${data.daily[4].weather[0].icon}.png">`
                    document.getElementById("dayfive-icon").innerHTML = `<img src="https://openweathermap.org/img/wn/${data.daily[5].weather[0].icon}.png">`

                    document.getElementById("dayone-temp").innerHTML = "Temp: " + data.daily[1].temp.day
                    document.getElementById("daytwo-temp").innerHTML = "Temp: " + data.daily[2].temp.day
                    document.getElementById("daythree-temp").innerHTML = "Temp: " + data.daily[3].temp.day
                    document.getElementById("dayfour-temp").innerHTML = "Temp: " + data.daily[4].temp.day
                    document.getElementById("dayfive-temp").innerHTML = "Temp: " + data.daily[5].temp.day

                    document.getElementById("dayone-wind").innerHTML = "Wind: " + data.daily[1].wind_speed
                    document.getElementById("daytwo-wind").innerHTML = "Wind: " + data.daily[2].wind_speed
                    document.getElementById("daythree-wind").innerHTML = "Wind: " + data.daily[3].wind_speed
                    document.getElementById("dayfour-wind").innerHTML = "Wind: " + data.daily[4].wind_speed
                    document.getElementById("dayfive-wind").innerHTML = "Wind: " + data.daily[5].wind_speed

                    document.getElementById("dayone-humidity").innerHTML = "Humidity: " + data.daily[1].humidity
                    document.getElementById("daytwo-humidity").innerHTML = "Humidity: " + data.daily[2].humidity
                    document.getElementById("daythree-humidity").innerHTML = "Humidity: " + data.daily[3].humidity
                    document.getElementById("dayfour-humidity").innerHTML = "Humidity: " + data.daily[4].humidity
                    document.getElementById("dayfive-humidity").innerHTML = "Humidity: " + data.daily[5].humidity
            });
        }
    });
};

// display alert if zip code is not entered correctly, then reload the page when alert is closed
var displayError = function() {
var errorAlert = document.querySelector("#current-city")
errorAlert.innerHTML = `<div class="alert alert-info alert-dismissible fade show" role="alert">
Please enter in a valid zip code.
<button type="button" class="close" data-dismiss="alert" aria-label="Close">
  <span aria-hidden="true">&times;</span>
</button>
</div>`;
closeButton = document.querySelector(".close");
closeButton.addEventListener("click", function closeButtonHandler() {
    location.reload();
})
}

// all functions run after user enters in a zip code and clicks the search button
searchBtn.addEventListener("click", getZipCode);

cityButtons.addEventListener("click", function(event) {
    var target = event.target;
    if (target.matches(".btn.cities")) {
      var cityData = JSON.parse(target.dataset.city);
      getZipCode(event, cityData.zip);
    }
});