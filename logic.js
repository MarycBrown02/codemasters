
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

// Capture Button Click
$(document).on("click", "#submit-input", function (event) {
  // Don't refresh the page!
  event.preventDefault();

  name = $("#name-input").val().trim();
  zip = $("#zip-input").val().trim();
  phone = $("#phone-input").val().trim();
  time = $("#textTime-input").val().trim();

  timeconvert()
  function timeconvert() {


    timeArr = time.split(':')
    hour = timeArr[0]
    minute = timeArr[1]
    minute = parseInt(minute) / 60
    time = parseInt(hour) + minute
    console.log(time)
  }

  console.log(name);
  console.log(zip);
  console.log(phone);
  console.log(time);

  database.ref().push({
    name: name,
    phone: phone,
    zip: zip,
    time: time,

  });
});
