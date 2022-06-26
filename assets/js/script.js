var apiKey = "66bf34535fb3ce4cc5102bab886f4c2b";
searchBtn = document.querySelector(".search-button");


// function to get city's zip code from user - then that zip code is saved and used to call the next function
var getZipCode = function(event) {
    event.preventDefault();
    var zipCode = document.querySelector(".form-control").value.trim();
    getLatLon(zipCode);
};


// the zip code from the precious code is used to get the city's name for the HTML and used to get the latitude and longitude
// the lat and lon are used to call the next function
var getLatLon = function(zipCode) {
    var zipApi = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode}&appid=${apiKey}`

    fetch(zipApi)
    .then(function(response) {
        if(response.ok){
            response.json().then(function(data){
                // get lat and lon for next function
                var lon = data.lon
                var lat = data.lat
                getWeather(lat, lon);

                // get city name from api and display on screen
                var cityName = data.name
                var cityTitle = document.querySelector("#city-name")
                cityTitle.innerHTML = cityName;
            })
        }
    });
};


// function to use timezone from weather api to display today's date after the current city is displayed
var todayDate = function(timeZone) {
    var date = luxon.DateTime.now().setZone(`${timeZone}`).toFormat('MM-dd-yyyy')
    var cityTitle = document.querySelector("#city-name")
    cityTitle.innerHTML += "  " + `${date}`;
};


// the weather app is finally called to get the rest of the html weather information using the lat and lon
var getWeather = function(lat, lon) {
    var weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(weatherApi)
    .then(function(response) {
        if(response.ok){
            response.json().then(function(data){
            var timeZone = data.timezone
            todayDate(timeZone);

            var temp = data.current.temp
            var wind = data.current.wind_speed
            var humidity = data.current.humidity
            var uvIndex = data.current.uvi
            
            var displayTemp = document.querySelector("#temp")
            displayTemp.innerHTML = "Temperature: " + temp + "°F"

            var displayWind = document.querySelector("#wind")
            displayWind.innerHTML = "Wind: " + wind + " MPH"

            var displayHumidity = document.querySelector("#humidity")
            displayHumidity.innerHTML = "Humidity: " + humidity + "%"

            var displayUV = document.querySelector("#uv")
            displayUV.innerHTML = "UV Index: " + uvIndex
            })
        }  
    });
};


// all functions run after user enters in a zip code and clicks the search button
searchBtn.addEventListener("click", getZipCode);