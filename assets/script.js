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






getFiveDayForecast();

    function getFiveDayForecast() {
        cardRow.empty();
        var queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${desiredCity}&APPID=${apiKey}&units=imperial`;
        $.ajax({
            url: queryUrl,
            method: "GET"
        })
        .then(function(fiveDayReponse) {
            for (var i = 0; i != fiveDayReponse.list.length; i+=8 ) {
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

