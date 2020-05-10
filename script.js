// Only major issue is I did not prevent duplicate cities from showing up in history list
var storedcities = [];

storedcities = JSON.parse(localStorage.getItem("storedcities"));
if (storedcities == null) {
    storedcities = [];
};
var i = storedcities.length
var search = $(".searchtext").val();

function renderstoredcities() {
    $(".searchsectionbuttons").empty();
// could not figure out how to add a <br /> after each button somewhere in here
    var loopcities = null
    for (var n = 0; n < storedcities.length; n++) {
        loopcities = storedcities[n].city;
        var history = $("<button>", {
            class: "btn btn-secondary",
            text: loopcities,
            id: loopcities
        });
        $(".searchsectionbuttons").prepend(history);

    };
    $(".searchsectionbuttons").prepend("Search History:" + "<br />")
};

renderstoredcities();

function dothesearch() {
    $(".CityDeets").empty();
    $(".temp").empty();
    $(".humid").empty();
    $(".windspeed").empty();
    $("#uvindexcolor").empty();
    search = $(".searchtext").val();
    var currenturl = "http://api.openweathermap.org/data/2.5/weather?q=" + search + "&appid=7e04a75507a0f21fe7909a921ee2e3e3&units=imperial"
    var forcasturl = "http://api.openweathermap.org/data/2.5/forecast?q=" + search + "&appid=7e04a75507a0f21fe7909a921ee2e3e3&units=imperial"
    var inputsearch = { city: null };
    inputsearch.city = search;
    storedcities.push(inputsearch);
    localStorage.setItem("storedcities", JSON.stringify(storedcities))
    i++;
    renderstoredcities();
// Current Days Weather Call
    $.ajax({
        method: "Get",
        url: currenturl,
        dataType: "jsonp",
    }).then(function (response) {
        var city = response.name;
        var currentdate = "(" + moment().format("M/D/YYYY") + ")";

        var iconresponsearray = response;
        var iconresponse = iconresponsearray.weather[0].icon;
        var weathericonurl = "http://openweathermap.org/img/wn/" + iconresponse + ".png"
        var weathericon = $("<img>");
        weathericon.attr("src", weathericonurl);
        var tempvar = "Tempurature: " + iconresponsearray.main.temp + " \xB0F"
        var humidityvar = "Humidity: " + iconresponsearray.main.humidity + "%"
        var windvar = "Wind Speed: " + iconresponsearray.wind.speed + " MPH"
        //API doesn't have UV index here
        var citydeets = $("<h2>")

        citydeets.append(city);
        citydeets.append(currentdate);
        citydeets.append(weathericon);
        $(".CityDeets").append(citydeets);
        $(".temp").append(tempvar);
        $(".humid").append(humidityvar);
        $(".windspeed").append(windvar);
// Second API call because first doesn't have UV Index
        var latitude = iconresponsearray.coord.lat;
        var longitude = iconresponsearray.coord.lon;
        var secondcallurl = "http://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=7e04a75507a0f21fe7909a921ee2e3e3&units=imperial";
        console.log(secondcallurl);
        $.ajax({
            method: "Get",
            url: secondcallurl,

        }).then(function (response) {
            var uvindex = response.current.uvi;
            var uvindexvar = "UV Index:";
            var uvindexcolor = uvindex;
            if ($(".uvindex").text() !== "UV Index:") {
                $(".uvindex").prepend(uvindexvar);
            };
            $("#uvindexcolor").append(uvindexcolor);
            if (uvindexcolor < 3) {
                $("#uvindexcolor").attr("style", "background-color:green");
            } else if (uvindexcolor >= 3 && uvindexcolor < 6) {
                $("#uvindexcolor").attr("style", "background-color:yellow");
            } else if (uvindexcolor >= 6 && uvindexcolor < 8) {
                $("#uvindexcolor").attr("style", "background-color:orange");
            } else {
                $("#uvindexcolor").attr("style", "background-color:red");
            };
        });
    });
// 5 Day Forcast Call
    $.ajax({
        method: "Get",
        url: forcasturl,
        dataType: "jsonp",
    }).then(function (response) {
        $(".5DayForecast").append("5-Day Forecast:");
        $(".day1").empty();
        $(".day2").empty();
        $(".day3").empty();
        $(".day4").empty();
        $(".day5").empty();
        $(".day1").css({
            "background-color": "#4285F4",
            "margin": "10px",
            "color": "white"
        });
        $(".day2").css({
            "background-color": "#4285F4",
            "margin": "10px",
            "color": "white"
        });
        $(".day3").css({
            "background-color": "#4285F4",
            "margin": "10px",
            "color": "white"
        });
        $(".day4").css({
            "background-color": "#4285F4",
            "margin": "10px",
            "color": "white"
        });
        $(".day5").css({
            "background-color": "#4285F4",
            "margin": "10px",
            "color": "white"
        });
// Date for each day
        var daydate1 = response.list[7].dt;
        var dateString = moment.unix(daydate1).format("MM/DD/YYYY ");
        var daydate2 = response.list[15].dt;
        var dateString2 = moment.unix(daydate2).format("MM/DD/YYYY");
        var daydate3 = response.list[23].dt;
        var dateString3 = moment.unix(daydate3).format("MM/DD/YYYY");
        var daydate4 = response.list[31].dt;
        var dateString4 = moment.unix(daydate4).format("MM/DD/YYYY");
        var daydate5 = response.list[39].dt;
        var dateString5 = moment.unix(daydate5).format("MM/DD/YYYY");
        $(".day1").append(dateString);
        $(".day2").append(dateString2);
        $(".day3").append(dateString3);
        $(".day4").append(dateString4);
        $(".day5").append(dateString5);
// Weather image for each day
        var weatherimage = response.list[7].weather[0].icon
        var weathericonurl = "http://openweathermap.org/img/wn/" + weatherimage + ".png"
        var weathericon = $("<img>");
        weathericon.attr("src", weathericonurl);
        $(".day1").append(weathericon);
        var weatherimage2 = response.list[15].weather[0].icon
        var weathericonurl2 = "http://openweathermap.org/img/wn/" + weatherimage2 + ".png"
        var weathericon2 = $("<img>");
        weathericon2.attr("src", weathericonurl2);
        $(".day2").append(weathericon2);
        var weatherimage3 = response.list[23].weather[0].icon
        var weathericonurl3 = "http://openweathermap.org/img/wn/" + weatherimage3 + ".png"
        var weathericon3 = $("<img>");
        weathericon3.attr("src", weathericonurl3);
        $(".day3").append(weathericon3);
        var weatherimage4 = response.list[31].weather[0].icon
        var weathericonurl4 = "http://openweathermap.org/img/wn/" + weatherimage4 + ".png"
        var weathericon4 = $("<img>");
        weathericon4.attr("src", weathericonurl4);
        $(".day4").append(weathericon4);
        var weatherimage5 = response.list[39].weather[0].icon
        var weathericonurl5 = "http://openweathermap.org/img/wn/" + weatherimage5 + ".png"
        var weathericon5 = $("<img>");
        weathericon5.attr("src", weathericonurl5);
        $(".day5").append(weathericon5);
//   Temperature for each day
        var daytemp1 = response.list[7].main.temp
        var daytemp2 = response.list[15].main.temp
        var daytemp3 = response.list[23].main.temp
        var daytemp4 = response.list[31].main.temp
        var daytemp5 = response.list[39].main.temp
        $(".day1").append("Temp:" + daytemp1 + "\xB0F ");
        $(".day2").append("Temp:" + daytemp2 + "\xB0F ");
        $(".day3").append("Temp:" + daytemp3 + "\xB0F ");
        $(".day4").append("Temp:" + daytemp4 + "\xB0F ");
        $(".day5").append("Temp:" + daytemp5 + "\xB0F ");
//   Humidity for each day
        var dayhumidity1 = response.list[7].main.humidity
        var dayhumidity2 = response.list[15].main.humidity
        var dayhumidity3 = response.list[23].main.humidity
        var dayhumidity4 = response.list[31].main.humidity
        var dayhumidity5 = response.list[39].main.humidity
        $(".day1").append("Humidity:" + dayhumidity1 + "%");
        $(".day2").append("Humidity:" + dayhumidity2 + "%");
        $(".day3").append("Humidity:" + dayhumidity3 + "%");
        $(".day4").append("Humidity:" + dayhumidity4 + "%");
        $(".day5").append("Humidity:" + dayhumidity5 + "%");
    });
};

// On Click events
$(document).on("click", "#searchbutton", function () {
    event.preventDefault();
    dothesearch();
});

$(document).on("click", ".searchsectionbuttons", function (event) {
    event.preventDefault();
    var mybuttonname = event.target.id;
    $(".searchtext").val(mybuttonname);
    dothesearch();
});