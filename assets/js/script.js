$(document).ready(function() {
    var cityName = JSON.parse(localStorage.getItem("cityNameList")) || [];


/*** Building the elements for the history ***/
function cityHistory() {
    $(".search-history").empty(); // To avoid repeated elements 
    // Looping through the array of cities
    for (var i = 0; i < cityName.length; i++) {
      var a = $("<div>");
      var name = $("<span>");

      // Adding a class, attribute and text
      a.addClass("city d-block bg-secondary p-2");
      a.attr("data-name", cityName[i]);
      name.text(cityName[i]);
      a.append(name)
      // Adding the new element to the HTML
      $(".search-history").append(a);
    }
}

function showAll() {
    $(".current").show();
    $(".forecast").show();
}

function hideAll() {
    $(".current").hide();
    $(".forecast").hide();
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
        console.log(response);
    });
   // return queryURL + $.param(queryParams);
}

     

    if (typeof cityName !== 'undefined' && cityName.length > 0) {
        cityHistory();
        showAll();
    } else hideAll();
       

    $("#add-city").on("click", function(event) {
        event.preventDefault();
        var city = $("input").val().trim();
        cityName.push(city);
        localStorage.setItem('cityNameList', JSON.stringify(cityName));
        showAll();
        // calling function to build element for each city
        cityHistory();
        $("input").val("")
    });

 // TO DO: Broken
    $(".search-history").on("click", "button", function(event) {
        event.preventDefault();
        var city = $(this).text();
        buildQueryURL(city);                       //TO DO: Add function to call API
        showAll();
    });
})


/*Icons*/
//var icon= ["01d",]
//URL is http://openweathermap.org/img/wn/${icon}@2x.png
