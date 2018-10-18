jQuery.ajaxPrefilter(function (options) {
  if (options.crossDomain && jQuery.support.cors) {
    options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
  }
});

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCTG_sjsd2MlTMPRR4bb-pB1fThi8Q-s_8",
  authDomain: "weatherproject-a6096.firebaseapp.com",
  databaseURL: "https://weatherproject-a6096.firebaseio.com",
  projectId: "weatherproject-a6096",
  storageBucket: "weatherproject-a6096.appspot.com",
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Handle submit button click
$(document).on("click", "#submit-input", function (event) {
  // Don't refresh the page!
  event.preventDefault();

  var name = "";
  var zip = "";
  var phone = "";
  var time = "";
  var convertedTime = 0;
  var optArray = [];

  // Get form entries
  name = $("#name-input").val().trim();
  zip = $("#zip-input").val().trim();
  phone = $("#phone-input").val().trim();
  time = $("#textTime-input").val().trim();
  $("input[name=weatherOption]:checked").each(function () {
    optArray.push($(this).val());
  });

  // Validate form entries
  if (name === '' || zip === '' || phone === '' || time === '' || optArray.length === 0) {
    $("#modalBody").text('Please fill out all required fields')
    $("#ModalLabel").text('Submission Error')
    $('#modalConf').modal('toggle')
    return
  }

  convertedTime = timeconvert(time);

  console.log(name);
  console.log(zip);
  console.log(phone);
  console.log(time);
  console.log(convertedTime);
  console.log(optArray);
  
  
  // Save subscription to the database
  database.ref().push({
    name: name,
    phone: phone,
    zip: zip,
    time: convertedTime,
    options: optArray
  });

  // Display subscription details
  $('#name-display').html("Member Name: " + name);
  $('#time-display').html("Text Time: " + time);
  $('#weatherCard').css('display', 'block')


  // Set city name based on zip
  zipAPI(zip);
    
  // Hide/initialize all carousel images (in case of multiple form submissions).
  $('carousel.carousel-inner').removeClass('carousel-item').removeClass('active').addClass('d-none');

  // Show carousel images for each selected weather condition. If Daily is chosen show them all.
  if (optArray.indexOf("rain") > -1 || optArray.indexOf("daily") > -1) 
    $('#image-rain').removeClass('d-none').addClass('carousel-item');

  if (optArray.indexOf("storms") > -1 || optArray.indexOf("daily") > -1) 
    $('#image-storms').removeClass('d-none').addClass('carousel-item');

  if (optArray.indexOf("cold") > -1 || optArray.indexOf("daily") > -1) 
    $('#image-cold').removeClass('d-none').addClass('carousel-item');

  if (optArray.indexOf("warm") > -1 || optArray.indexOf("daily") > -1) 
    $('#image-warm').removeClass('d-none').addClass('carousel-item');
  
  // Restart the carousel with the updated images
  $(document).ready(function(){  
    $('.carousel-item').removeClass('active');
    $('.carousel-item').first().addClass('active');
    $('carousel').carousel({interval: 1000, cycle: true});
  });
    
  // Display subscription success message
  $("#modalBody").text('Your data has been successfully added to our database. You will now recieve automatic text updates on the weather');
  $("#ModalLabel").text('Thanks for submitting!');
  $('#modalConf').modal('toggle');

});

// Handle unsubscribe modal button click
$(document).on("click", "#un", function () {
  $('#modalUns').modal('toggle');
});

// Handle unsubscribe button click
$(document).on("click", "#unSubmit", function (event) {
  event.preventDefault()
  var ph = $("#un-input").val().trim()
  firebase.database().ref().once('value').then(function (snap) {
    var user = snap.val()
    for (key in user) {
      if (user[key].phone === ph) {
        database.ref(key).remove();
      }
    }
  })
  $('#modalUns').modal('toggle');
  $("#modalBody").text("You will no longer recieve text updates from myBrella! We'll miss you! Come back any time");
  $("#ModalLabel").text('Successfully Unsubscibed');
  $('#modalConf').modal('toggle');
});

// Convert time string to decimal format
function timeconvert(time) {
  timeArr = time.split(':');
  hour = timeArr[0];
  minute = timeArr[1];
  minute = parseInt(minute) / 60;
  convertedTime = parseInt(hour) + minute;
  return convertedTime;
}

function convertKelvinToFahrenheit(temp) {
  k = parseFloat(temp);
  return ((k - 273.15) * 1.8) + 32;
}

// Get current weather conditions based on zip code
function weatherAPI(zipCode) {
  var messages_url = "http://api.openweathermap.org/data/2.5/weather?zip=" + zipCode + ",us&APPID=0b257507206cea6fd76be1daffae66bc"

  $.ajax({
    url: messages_url,
    method: "GET"
  }).then(function (response) {
    currentCondition = response["weather"][0].main;
    currentTempK = response["main"].temp;
    currentTempF = Math.round(convertKelvinToFahrenheit(currentTempK));
    
    // display current weather conditions here, if wanted.
    console.log(currentCondition);
    console.log(currentTempK + " K");
    console.log(currentTempF + "° F");
    $('#currWeath').html('Current weather in ' + cityName + ': ' + currentTempF + ' degrees Fahrenheit, ' + currentCondition)
  });
}

// Get city name based on zip code
function zipAPI(zipCode) {
  var messages_url = 'https://www.zipcodeapi.com/rest/O4aFekqq6dcgipPqWHeDvpzBfyTrBYgZf9SKxkCSw2k9rMN1GXimPxKOT27qYCij/info.json/' + zipCode + '/degrees'

  $.ajax({
    url: messages_url,
    method: "GET",
  }).then(function (response) {
    console.log(response.city);
    cityName = response.city
    $('#city-display').html("City: " + response.city);
    weatherAPI(zipCode)

  })
}