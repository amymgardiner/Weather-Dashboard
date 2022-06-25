var apiKey = "66bf34535fb3ce4cc5102bab886f4c2b";


var getWeather = function(lat, lon) {
    var weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(weatherApi)
    .then(function(response) {
        console.log(response);
        response.json().then(function(data) {
            console.log(data);
        });

    });

};

var getLatLon = function (zipCode) {
    var zipApi = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode}&appid=${apiKey}`

    fetch(zipApi)
    .then(function(response) {
        if(response.ok){
            response.json().then(function(data){
                var lon = data.lon
                var lat = data.lat
                getWeather(lat, lon);
            })
        }
    });
};

getLatLon("63139");

