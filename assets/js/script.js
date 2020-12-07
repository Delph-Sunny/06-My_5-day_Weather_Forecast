$(document).ready(function() {
    var apiKey = "de59edcad53b52bdb1763734853a531f"; 
    var cityName = JSON.parse(localStorage.getItem("cityNameList")) || [];
    var currentObj, forecastObj = {};
    var hrInterval; 

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
        for (var i = 0; i < cityName.length; i++) {
            var a = $("<div>");
            var name = $("<span>");
            // Adding a class, attribute and text
            a.addClass("city d-block border p-2");
            a.attr("data-name", cityName[i]);
            name.addClass("city-text")
            name.text(cityName[i]);
            a.append(name)
            // Adding the new element to the HTML
            $(".search-history").append(a);
        }
    }


    /*** Calling API and getting the information */
    function getQueryURL(city) {
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`; 
   
        // Gettting the current weather from API
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
          console.log(response);       //FOR TESTING
           currentObj = response;             
           displayCurrent();
           displayUV();        
        }); 
        
}

    function getQueryURL5(city) {
        var queryURL5 = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;
        
        $("#5-day").empty(); // Empty previous previsions
        
        // Getting the forecast weather from API
        $.ajax({
            url: queryURL5,
            method: "GET"
        }).then(function(response){
            forecastObj = response; 
            console.log(forecastObj)        //FOR TESTING
            hrInterval = 1;           
            for (let i = 1; i < 6; i++) {           
                displayForecast(i);
                console.log(i)
            }       
        });
    }

    function displayCurrent(){
        var currentDate = moment().format("L");                
            
       $("#current-city").text(`${currentObj.name} (${currentDate}) `);
       $("#current-city").append($(`<img src= "http://openweathermap.org/img/wn/${currentObj.weather[0].icon}@2x.png"/> `));           
       $("#current-temp").text(currentObj.main.temp);
       $("#current-humi").text(currentObj.main.humidity);
       $("#current-wind").text(currentObj.wind.speed);
    }
     
    function displayUV(){
        var queryURLuv = `https://api.openweathermap.org/data/2.5/uvi?lat=${currentObj.coord.lat}&lon=${currentObj.coord.lon}&appid=${apiKey}`;
        var uvIndex;
        // Getting the UV index from API
        $.ajax({
            url: queryURLuv,
            method: "GET"
        }).then(function(response){
          //  console.log(response);          //FOR TESTING
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

    function displayForecast(nb){
        var date = moment().add(nb, 'day').format("L"); 
        hrInterval += 7;                                 // TO FIX: REVIEW METHOD 
        // Create main element  
        $("#5-day").append(`<div class="card bg-primary text-white col-2 mx-2 px-1">
        <div class="card-body px-0">
            <h5 class="card-title" index="${nb}"></h5>
            <p class="icon" index="${nb}"></p>
            <p class="card-text">Temp: <span class="temp" index="${nb}"></span>&#176F</p>
            <p class="card-text">Humidity: <span class="humi" index="${nb}"></span>%</p>
        </div>`)
        console.log("hrInterval " + hrInterval)

        var iconcode = forecastObj.list[hrInterval]
        console.log(iconcode)                 //FOR TESTING
        $(`.card-title:eq(${nb-1})`).text(date);       
        $(`.icon:eq(${nb-1})`).append($(`<img src= "http://openweathermap.org/img/wn/${iconcode.weather[0].icon}.png" style="height: 60px; width: 60px"/>`));           
        $(`.temp:eq(${nb-1})`).text(forecastObj.list[0].main.temp);
        $(`.humi:eq(${nb-1})`).text(forecastObj.list[0].humidity);
    }


    if (typeof cityName !== 'undefined' && cityName.length > 0) {
        cityHistory();
        getQueryURL(cityName[cityName.length-1]);
        getQueryURL5(cityName[cityName.length-1]); 
        showAll();
    } else hideAll();
       
// Storing search item
    $("#add-city").on("click", function(event) {
        event.preventDefault();
        let city = $("input").val().trim();
        
        //TO DO: Check for spelling
        
        if(city === "" ){            
            $('#error-modal').modal("toggle");           
        } else {
            cityName.push(city);
            localStorage.setItem('cityNameList', JSON.stringify(cityName));
            getQueryURL(city);
            getQueryURL5(city); 
            showAll();
            // calling function to build element for each city
            cityHistory();
            $("input").val("")
        }
    });


 // when clicking on a city in the history
    $(document).on("click", ".city", function(event) {
        event.preventDefault();
        let city = $(this).data('name');        
        console.log(city)                   //FOR TESTING
        getQueryURL(city);
        getQueryURL5(city);                      
        showAll();
    });
})

