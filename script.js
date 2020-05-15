
$(document).ready(function () {

    var cityArray = [];
    var apiKey = "142462495358e6d87c39046a6d5502cf";


    // Ajax call to Open Weather
    function searchWeather() {
        var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

        $.ajax({url: weatherURL, method: "GET"})
        .then(function (response) {
            console.log(response);
        })
    }
})