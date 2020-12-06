$(document).ready(function() {
    var cityName = JSON.parse(localStorage.getItem("cityNameList")) || [];

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
    function buildQueryURL(city) {
        var apiKey = "de59edcad53b52bdb1763734853a531f";    
        var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
        var currentDate = moment().calendar();

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            console.log(response);              //FOR TESTING
        });
        // return queryURL + $.param(queryParams);
    }

     

    if (typeof cityName !== 'undefined' && cityName.length > 0) {
        cityHistory();
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
        buildQueryURL(city);                       
        showAll();
    });
})


/*Icons*/
//var icon= ["01d",]
//URL is http://openweathermap.org/img/wn/${icon}@2x.png
