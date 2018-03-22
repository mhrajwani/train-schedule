// Initialize Firebase
var config = {
  apiKey: "AIzaSyBarOr4zFiu0g5oLX9K1lINIBUnksKw44Q",
  authDomain: "train-1ec86.firebaseapp.com",
  databaseURL: "https://train-1ec86.firebaseio.com",
  projectId: "train-1ec86",
  storageBucket: "",
  messagingSenderId: "719972826320"
};
firebase.initializeApp(config);
   
   var database = firebase.database();

   $("#submit").on("click", function(event) {
      event.preventDefault();
   
      //Train Name
      var name = $("#tName").val().trim();
      //Train Destination
      var destination = $("#destination").val().trim();
      //First Train Time
      var fTrain = $("#fTrain").val().trim();
      //Frequency
      var frequency = $("#frequency").val().trim();
      //Converting first train time to a year ago, so current is always ahead.
      var fTrainC =  moment(fTrain, "HH:mm").subtract(1, "years");
      //Time difference in 1st train time and current tim
      var tD = moment().diff(moment(fTrainC), "minutes");
      //Finding minutes from last time
      var tRemainder = tD % frequency;
      //Calculate next train time in minutes
      var tAway = frequency - tRemainder;
      //Time to next Train
      var nextTrain = moment().add(tAway, "minutes").format("hh:mm a");
   
   
      database.ref().push({
          name: name,
          destination: destination,
          fTrain: fTrain,
          frequency: frequency,
          nextTrain: nextTrain,
          tAway: tAway,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        
        $("#tName").val("");
        $("#destination").val("");
        $("#fTrain").val("");
        $("#frequency").val("");
   });
   
   database.ref().on("child_added", function(snapshot) {
      var newRow = $("<tr>");
      var tableName = $("<td>").text(snapshot.val().name);
      var tableDestination = $("<td>").text(snapshot.val().destination);
      var tableFrequency = $("<td>").text(snapshot.val().frequency);
      var tableNextTrain = $("<td>").text(snapshot.val().nextTrain);
      var tableMinsAway = $("<td>").text(snapshot.val().tAway);
   
      newRow.append(tableName).append(tableDestination).append(tableFrequency).append(tableNextTrain).append(tableMinsAway);
   
      $("#trainTable").append(newRow);
   
   }, function(errorObject) {
   
      console.log("Errors handled: " + errorObject.code);
   
   });