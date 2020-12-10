$(document).ready(function () {
    var apiKey = "de59edcad53b52bdb1763734853a531f";
    var cityList = JSON.parse(localStorage.getItem("cityNameList")) || [];
    var currentObj, forecastObj, cityData = {};


    $("#details").removeClass("hidden");
    $("#loader").addClass("hidden");


    /*** Functions to control the display of weather data ***/
    function showAll() {
        $(".current").show();
        $(".forecast").show();
    }

    function hideAll() {
        $(".current").hide();
        $(".forecast").hide();
    }

    /*** Building the elements for the history ***/
    function cityHistory() {
        $(".search-history").empty(); // To avoid repeated elements 
        // Looping through the array of cities
        for (let i = 0; i < cityList.length; i++) {
            var cityEl = $("<div>");
            var name = $("<span>");
            // Adding a class, attribute and text
            cityEl.addClass("city d-block border p-2 text-truncate");
            cityEl.attr("data-name", cityList[i].cityName);
            cityEl.attr("data-lat", cityList[i].lat);
            cityEl.attr("data-lon", cityList[i].lon);
            name.addClass("city-text");
            name.text(cityList[i].cityName);
            cityEl.append(name);
            // Adding the new element to the HTML
            $(".search-history").append(cityEl);
        }
    }

    /*** Calling current weather API and getting the information ***/
    function getQueryURL(city) {
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
        $(".current").empty(); // Empty previous weather

        // Getting the current weather from API
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            currentObj = response;
            cityData = {
                cityName: response.name,
                lat: response.coord.lat,
                lon: response.coord.lon
            }
            displayCurrent();
            displayUV(cityData.lat, cityData.lon);
        });
    }

    /*** Populate current weather ***/
    function displayCurrent() {
        // Calculating the current time locally by converting UTC time and using the timezone
        let unixTimestamp = currentObj.dt + currentObj.timezone;
        let milliseconds = unixTimestamp * 1000;  // converting to millisecond
        let dateObject = new Date(milliseconds);
        let utc = dateObject.toUTCString("en-US"); // Wed, 09 Dec 22:42:01 GMT

        // converting format to MM/DD/YYYY
        let month = (new Date(utc).getMonth() + 1);
        let day = JSON.stringify(utc).slice(6, 8);
        let year = new Date(utc).getFullYear();
        let currentDate = month + "/" + day + "/" + year;

        // Create main element
        $(".current").append(`<div class="col-12"><div class="card bg-light text-dark rounded"><div class="card-body">
        <h3 id="current-city"></h3>
        <p class="text">Temperature: <span id="current-temp"></span>&#176F</p>
        <p>Humidity: <span id="current-humi"></span>%</p>
        <p>Wind Speed: <span id="current-wind"></span>MPH</p>
        <p>UV Index: <span class="text-white py-1 px-2" id="current-uv"></span></p>
        </div></div></div>`)
        $("#current-city").text(`${currentObj.name} (${currentDate}) `);
        $("#current-city").append($(`<img src= "http://openweathermap.org/img/wn/${currentObj.weather[0].icon}@2x.png" 
            alt="${currentObj.weather[0].description}"/>`));
        $("#current-temp").text(currentObj.main.temp);
        $("#current-humi").text(currentObj.main.humidity);
        $("#current-wind").text(currentObj.wind.speed);
    }

    /*** Populate UX data and color background ***/
    function displayUV(lat, lon) {
        var queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        var uvIndex;

        // Getting the UV index from API
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            uvIndex = response.value
            $("#current-uv").text(uvIndex);
            // Change the color based on uvIndex severity
            // above 3 but less than 6, the UV level is considered as moderate. Anything below is favorable and above is severe
            if (uvIndex < 3) {
                $("#current-uv").removeClass("btn-warning bg-danger").addClass("btn-success");
            } else if (uvIndex > 6) {
                $("#current-uv").removeClass("btn-success btn-warning").addClass("bg-danger");
            } else $("#current-uv").removeClass("btn-success bg-danger").addClass("btn-warning");
        });
    }

    /*** Calling One Call API and getting the information ***/
    function getQueryURL5(lat, lon) {
        var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;
        $("#5-day").empty(); // Empty previous previsions

        // Getting the forecast weather from API
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            forecastObj = response;
            // Building the 5-day cards           
            for (i = 1; i < forecastObj.daily.length - 2; i++) {
                let unixTimestamp = forecastObj.daily[i].dt + forecastObj.timezone_offset;
                let milliseconds = unixTimestamp * 1000;  // converting to millisecond
                let dateObject = new Date(milliseconds);
                let utc = dateObject.toUTCString("en-US");
                let month = (new Date(utc).getMonth() + 1);
                let day = JSON.stringify(utc).slice(6, 8);
                let year = new Date(utc).getFullYear();
                let fullDate = month + "/" + day + "/" + year;
                displayForecast(fullDate, i);
            }
        });
    }

    /*** Populate 5-day weather ***/
    function displayForecast(date, nb) {
        // Create main element  
        $("#5-day").append(`<div class="col-xs-2 m-2"><div class="card bg-primary text-white">
            <div class="card-body">
            <h6 class="card-title"></h6>
            <p class="icon text-center"></p>
            <p class="card-text">Temp: <span class="temp"></span>&#176F</p>
            <p class="card-text">Humidity: <span class="humi"></span>%</p>
            </div></div>`);
        // Populating with data
        let listObj = forecastObj.daily[nb];
        $(`.card-title:eq(${nb - 1})`).text(date);
        $(`.icon:eq(${nb - 1})`).append($(`<img src= "http://openweathermap.org/img/wn/${listObj.weather[0].icon}.png" 
                alt="${listObj.weather[0].description}" style="height: 60px; width: 60px"/>`));
        $(`.temp:eq(${nb - 1})`).text(listObj.temp.day);
        $(`.humi:eq(${nb - 1})`).text(listObj.humidity);
    }


    // Clearing previously search cities 
    $("#clear").on("click", function (event) {
        event.preventDefault();
        cityList = [];
        localStorage.clear();
        /* Disable btn once used */
        $(this).disabled = "true";
        $(".search-history").empty()
    });

    // Look for history and display last
    if (typeof cityList !== 'undefined' && cityList.length > 0) {
        cityHistory();
        cityData = cityList[cityList.length - 1];
        // calling function to build element for each city
        getQueryURL(cityData.cityName);
        getQueryURL5(cityData.lat, cityData.lon);
        showAll();
    } else hideAll();

    // Storing searched item
    $("#search-city").on("click", function (event) {
        event.preventDefault();
        let userCity = $("input").val().trim();

        if (userCity === "") {
            $('#error-modal').modal("toggle");
        } else {
            //Check for spelling and return error modal if bad
            var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&units=imperial&appid=${apiKey}`;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                cityData = {
                    cityName: response.name,
                    lat: response.coord.lat,
                    lon: response.coord.lon,
                }
                cityList.push(cityData);    // Push correct spelling only
                localStorage.setItem('cityNameList', JSON.stringify(cityList));
                getQueryURL(cityData.cityName); // calling function to build element for each city
                getQueryURL5(cityData.lat, cityData.lon); // calling function to build element for each city
                showAll();
                cityHistory();
                $("input").val("");
            }).catch(function () { $('#error-modal').modal("toggle"); })  // Check for API answer when wrong spelling
        };
    });


    // when clicking on a city in the history
    $(document).on("click", ".city", function (event) {
        event.preventDefault();
        cityData = {
            cityName: $(this).data('name'),
            lat: $(this).data('lat'),
            lon: $(this).data('lon')
        }
        getQueryURL(cityData.cityName);
        getQueryURL5(cityData.lat, cityData.lon);
        showAll();
    });
})

