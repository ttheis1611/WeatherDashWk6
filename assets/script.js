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

// Check storage for parameters
if (JSON.parse(localStorage.getItem("searchHistory")) === null) {
    console.log("searchHistory not found")
} else {
    console.log("searchHistory loaded into searchHistoryArr");
    renderSearchHistory();
}

// Search button function
searchBtn.on("click", function (e) {
    e.preventDefault();
    if (searchInput.val() === "") {
        alert("Please input City name");
        return;
    }
    getWeather(searchInput.val());
});
// Use history for button
$(document).on("click", ".historyEntry", function () {
    var thisElement = $(this);
    getWeather(thisElement.text());
})
// show the history item on page
function renderSearchHistory(cityName) {
    searchHistoryEl.empty();
    var searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));
    for (var i = 0; i < searchHistoryArr.length; i++) {
        var newListItem = $(`<li class="historyEntry list-group-item text-dark"></li>`);
        newListItem.text(searchHistoryArr[i]);
        searchHistoryEl.prepend(newListItem);
    }
}
// Weather data elements
function renderWeatherData(cityName, cityTemp, cityHumidity, cityWindSpeed, cityWindDirect, cityWeatherIcon, uvVal) {
    cityNameEl.text(cityName);
    currentDateEl.text(`${today}`)
    tempEl.text(`Temperature: ${cityTemp} °F`);
    humidityEl.text(`Humidity: ${cityHumidity}%`);
    windSpeedEl.text(`Wind Speed: ${cityWindSpeed} MPH`);
    windDirectEl.text(`Wind From: ${cityWindDirect} deg`);
    uvIndexEl.text(`UV Index: ${uvVal}`);
    weatherIconEl.attr("src", cityWeatherIcon);
}
// Use openWeather to get data and create city object
function getWeather(desiredCity) {
    var queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${desiredCity}&APPID=${apiKey}&units=imperial`;
    $.ajax({
        url: queryUrl,
        method: "GET"
    })
        .then(function (weatherData) {
            var cityObj = {
                cityName: weatherData.name,
                cityTemp: weatherData.main.temp,
                cityHumidity: weatherData.main.humidity,
                cityWindSpeed: weatherData.wind.speed,
                cityWindDirect: weatherData.wind.deg,
                cityUVIndex: weatherData.coord,
                cityWeatherIconName: weatherData.weather[0].icon
            }
            var queryUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityObj.cityUVIndex.lat}&lon=${cityObj.cityUVIndex.lon}&APPID=${apiKey}&units=imperial`
            $.ajax({
                url: queryUrl,
                method: "GET"
            })
                .then(function (uvData) {
                    if (JSON.parse(localStorage.getItem("searchHistory")) == null) {
                        var searchHistoryArr = [];
                        if (searchHistoryArr.indexOf(cityObj.cityName) === -1) {
                            searchHistoryArr.push(cityObj.cityName);
                            localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
                            var renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                            renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, cityObj.cityWindDirect, renderedWeatherIcon, uvData.value);
                            renderSearchHistory(cityObj.cityName);
                        } else {
                            console.log("City already in searchHistory. Not adding to history list")
                            var renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                            renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, cityObj.cityWindDirect, renderedWeatherIcon, uvData.value);
                        }
                    } else {
                        var searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));
                        if (searchHistoryArr.indexOf(cityObj.cityName) === -1) {
                            searchHistoryArr.push(cityObj.cityName);
                            localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
                            var renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                            renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, cityObj.cityWindDirect, renderedWeatherIcon, uvData.value);
                            renderSearchHistory(cityObj.cityName);
                        } else {
                            console.log("City already in searchHistory. Not adding to history list")
                            var renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                            renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, cityObj.cityWindDirect, renderedWeatherIcon, uvData.value);
                        }
                    }
                })

        });
    getFiveDayForecast();

    function getFiveDayForecast() {
        cardRow.empty();
        var queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${desiredCity}&APPID=${apiKey}&units=imperial`;
        $.ajax({
            url: queryUrl,
            method: "GET"
        })
            .then(function (fiveDayReponse) {
                for (var i = 0; i != fiveDayReponse.list.length; i += 8) {
                    var cityObj = {
                        date: fiveDayReponse.list[i].dt_txt,
                        icon: fiveDayReponse.list[i].weather[0].icon,
                        temp: fiveDayReponse.list[i].main.temp,
                        humidity: fiveDayReponse.list[i].main.humidity
                    }
                    var dateStr = cityObj.date;
                    var trimmedDate = dateStr.substring(0, 10);
                    var weatherIco = `https:///openweathermap.org/img/w/${cityObj.icon}.png`;
                    createForecastCard(trimmedDate, weatherIco, cityObj.temp, cityObj.humidity);
                }
            })
    }
}





function createForecastCard(date, icon, temp, humidity) {

    // HTML elements we will create to later
    var fiveDayCardEl = $("<div>").attr("class", "five-day-card");
    var cardDate = $("<h4>").attr("class", "card-text");
    var cardIcon = $("<img>").attr("class", "weatherIcon");
    var cardTemp = $("<p>").attr("class", "card-text");
    var cardHumidity = $("<p>").attr("class", "card-text");

    cardRow.append(fiveDayCardEl);
    cardDate.text(date);
    cardIcon.attr("src", icon);
    cardTemp.text(`Temp: ${temp} °F`);
    cardHumidity.text(`Humidity: ${humidity}%`);
    fiveDayCardEl.append(cardDate, cardIcon, cardTemp, cardHumidity);
}