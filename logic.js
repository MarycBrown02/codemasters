
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
    $("#modalBody").text('Please fill out all required fields')
    $("#ModalLabel").text('Submission Error')
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
  $("#modalBody").text('Your data has been successfully added to our database. You will now recieve automatic text updates on the weather')
  $("#ModalLabel").text('Thanks for submitting!')
  $('#modalConf').modal('toggle')
});

$(document).on("click", "#un", function () {
  $('#modalUns').modal('toggle')
});

$(document).on("click", "#unSubmit", function (event) {
  event.preventDefault()
  var ph = $("#un-input").val().trim()
  firebase.database().ref().once('value').then(function (snap) {
    var user = snap.val()
    for (key in user) {
      if (user[key].phone === ph) {
        database.ref(key).remove()
      }
    }
  })
  $('#modalUns').modal('toggle')

  $("#modalBody").text("You will no longer recieve text updates from myBrella! We'll miss you! Come back any time")
  $("#ModalLabel").text('Successfully Unsubscibed')
  $('#modalConf').modal('toggle')
});

