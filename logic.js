
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


var name = "";
var zip = "";
var phone = "";
var time = "";
var optArray = [];

// Capture Button Click
$(document).on("click", "#submit-input", function (event) {

  // Don't refresh the page!
  event.preventDefault();

  name = $("#name-input").val().trim();
  zip = $("#zip-input").val().trim();
  phone = $("#phone-input").val().trim();
  time = $("#textTime-input").val().trim();


  $("input[name=weatherOption]:checked").each(
    function () {
      optArray.push($(this).val());
    }
  );

  if (name === '' || zip === '' || phone === '' || time === '' || optArray.length === 0) {
    $(".modal-body").text('Please fill out all required fields')
    $(".modal-title").text('Submission Error')
    $('#modalConf').modal('toggle')
    return
  }
  timeconvert()

  function timeconvert() {
    timeArr = time.split(':')
    hour = timeArr[0]
    minute = timeArr[1]
    minute = parseInt(minute) / 60
    time = parseInt(hour) + minute
  }

  console.log(name);
  console.log(zip);
  console.log(phone);
  console.log(time);
  console.log(optArray);

  database.ref().push({
    name: name,
    phone: phone,
    zip: zip,
    time: time,
    options: optArray
  });
  optArray = []
  $(".modal-body").text('Your data has been successfully added to our database. You will now recieve automatic text updates on the weather')
  $(".modal-title").text('Thanks for submitting!')
  $('#modalConf').modal('toggle')
});

