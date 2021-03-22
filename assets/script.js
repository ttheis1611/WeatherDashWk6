//Current Dates from moment
var currentDate = $("#currentDay").text(moment().format('LLLL'));
var apiKey = "3ac0d8db34de82819d13a9167239acc1";
var searchBtn = $(".searchBtn");
var searchInput = $(".searchInput");
var cityNameEl = $(".cityName");
var currentDateEl = $(".currentDate");
var weatherIconEl = $(".weatherIcon");
var searchHistoryEl = $(".historyItems");
var tempEl = $(".temp");
var humidityEl = $(".humidity");
var windSpeedEl = $(".windSpeed");
var windDirectEl = $(".windDirect");
var uvIndexEl = $(".uvIndex");
var cardRow = $(".card-row");
var today = (moment().format('L'));

// Use clear all tasks button
function clearCity() {
    localStorage.clear();
    location.reload();
};



function getWeather(desiredCity) {
    var queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${desiredCity}&APPID=${apiKey}&units=imperial`;
    $.ajax({
        url: queryUrl,
        method: "GET"
    })
    .then(function(weatherData) {
        var cityObj = {
            cityName: weatherData.name,
            cityTemp: weatherData.main.temp,
            cityHumidity: weatherData.main.humidity,
            cityWindSpeed: weatherData.wind.speed,
            cityWindDirect: weatherData.wind.deg,
            cityUVIndex: weatherData.coord,
            cityWeatherIconName: weatherData.weather[0].icon
        }
