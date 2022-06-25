var apiKey = "66bf34535fb3ce4cc5102bab886f4c2b";
searchBtn = document.querySelector(".search-button");


var getWeather = function(lat, lon) {
    var weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(weatherApi)
    .then(function(response) {
        if(response.ok){
            response.json().then(function(data){
            var temp = data.current.temp
            var wind = data.current.wind_speed
            var humidity = data.current.humidity
            var uvIndex = data.current.uvi
            console.log(uvIndex)
            var displayTemp = document.querySelector("#temp")
            displayTemp.innerHTML = temp

            var displayWind = document.querySelector("#wind")
            displayWind.innerHTML = wind
            
            var displayHumidity = document.querySelector("#humidity")
            displayHumidity.innerHTML = humidity
            })
        }  
    });
};

var getLatLon = function(zipCode) {
    var zipApi = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode}&appid=${apiKey}`

    fetch(zipApi)
    .then(function(response) {
        if(response.ok){
            response.json().then(function(data){
                var lon = data.lon
                var lat = data.lat
                var cityName = data.name
                getWeather(lat, lon);
                var cityTitle = document.querySelector("#city-name")
                cityTitle.innerHTML = cityName;
            })
        }
    });
};

var getZipCode = function(event) {
    event.preventDefault();
    var zipCode = document.querySelector(".form-control").value.trim();
    getLatLon(zipCode);
};

searchBtn.addEventListener("click", getZipCode);