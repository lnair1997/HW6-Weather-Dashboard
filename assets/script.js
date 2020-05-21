// Load HTML page
$(document).ready(function () {
    // Inital array to store cities in
    var citiesArray = [];
    var apiKey = "258635a5e9f4d564a966e4ce880b065d";
    $("#weatherBox").hide();

    //========================================================================================================

    // Create dynamic button for text entered
    function addCityBtn(city) {
        var liEle = $("<li>")
        var btnEle = $("<button>").text(city);
        btnEle.attr("class", "cityListBtn button is-rounded is-success");
        liEle.append(btnEle)
        $("ul").append(liEle);
    }

    //========================================================================================================

    // When city is clicked, it should activate the function to load display
    $(document).on("click", ".cityListBtn", function () {
        event.preventDefault();
        var cityClicked = $(this).text();

        searchWeather(cityClicked);
    })

    //========================================================================================================

    // SearchWeather
    function searchWeather(city) {
        var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
        var uvURL = "";

        $.ajax({
            url: weatherURL,
            method: "GET"
        }).then(function (response) {

            // Name and icon
            var icon = response.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/w/" + icon + ".png";
            $("#cityName").text(response.name);
            var imgDiv = $("<img>");
            imgDiv.attr("src", iconURL);
            var currentDate = moment().format("MM/DD/YYYY");
            var spanDate = $("<span>").text(" (" + currentDate + ")");
            $("#cityName").append(spanDate, imgDiv);

            // Temperature
            var tempF = (((response.main.temp - 273.15) * 1.80) + 32).toFixed(2);
            $("#temperature").text("Temperature: " + tempF + " °F");

            // Humidity and wind speed
            $("#humidity").text("Humidity: " + response.main.humidity + " %");
            $("#windSpeed").text("Wind Speed: " + response.wind.speed + " MPH");

            //======================================================================================
            
            // UV
            var lon = response.coord.lon;
            var lat = response.coord.lat;
            uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" +
                lon;

            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function (uvRating) {

                var uvNumber = uvRating.value;
                var spanEle = $("<span>").text(uvNumber);
                $("#UV").text("UV Index: ").append(spanEle);

                // UV index color
                if (uvNumber <= 2) {
                    spanEle.removeClass("low moderate high veryHigh").addClass("low");
                } else if (uvNumber > 2 && uvNumber < 5) {
                    spanEle.removeClass("low moderate high veryHigh").addClass("moderate");
                } else if (uvNumber > 5 && uvNumber <= 7) {
                    spanEle.removeClass("low moderate high veryHigh").addClass("high");
                } else {
                    spanEle.removeClass("low moderate high veryHigh").addClass("veryHigh");
                }

                $("#weatherBox").show();
            })

            //===============================================================================================

            // 5 Day Forecast
            var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;

            $("#forecast").text("5-Day Forecast: ");

            $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function (forecastData) {
                console.log(forecastData);

                $("#forecastBox").empty();

                for (var i = 0; i < forecastData.list.length; i++) {
                    // 5 Day forecast at 3pm
                    if (forecastData.list[i].dt_txt.indexOf("15:00:00") !== -1) {

                        var newCardDiv = $("<div>").addClass("box forecastCard");

                        var currentDate = moment(forecastData.list[i].dt_txt).format("MM/DD/YYYY");
                        var forecastDate = $("<h5>").text(currentDate);

                        var newIcon = forecastData.list[i].weather[0].icon;
                        var newIconURL = "http://openweathermap.org/img/w/" + newIcon + ".png";
                        var imgIcon = $("<img>").attr("src", newIconURL);

                        var tempFF = (forecastData.list[i].main.temp - 273.15) * 1.80 + 32;
                        tempFF = tempFF.toFixed(2);
                        var tempElement = $("<p>").text("Temp: " + tempFF + " °F");

                        var humElement = $("<p>").text("Humidity: " + forecastData.list[i].main.humidity + "%");

                        newCardDiv.append(forecastDate, imgIcon, tempElement, humElement);

                        $("#forecastBox").append(newCardDiv);
                    }
                }
            })
        })
    }

    //========================================================================================================

    // Search button is clicked, the input is stored so that the button is created, and pushed into the array
    $("#searchBtn").on("click", function () {
        event.preventDefault();

        var city = $("#userInput").val();
        $("#userInput").val("");
        if (city === "") {
            return
        };

        if (citiesArray.indexOf(city) === -1) {
            addCityBtn(city);
            citiesArray.push(city);
            localStorage.setItem("cityList", JSON.stringify(citiesArray));
        };

        searchWeather(city);
    })

    //========================================================================================================

    // Get history form localstorage
    function getHistory() {

        var history = localStorage.getItem("cityList");
        if (history) {
            citiesArray = JSON.parse(history);
            for (var i = 0; i < citiesArray.length; i++) {
                addCityBtn(citiesArray[i]);
            }
            searchWeather(citiesArray[citiesArray.length - 1]);
        }
    }
    getHistory();


});
