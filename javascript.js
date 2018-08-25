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
  var counter = 0;
  var counter1 = 0;
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
          fTrain: fTrain,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        
        $("#tName").val("");
        $("#destination").val("");
        $("#fTrain").val("");
        $("#frequency").val("");
   });
   
   database.ref().on("child_added", function(snapshot) {
      var newRow = $("<tr>");
      //$(newRow).attr("id","a"+counter);
      //counter++
      var tableName = $("<td>").text(snapshot.val().name);
      var tableDestination = $("<td>").text(snapshot.val().destination);
      var tableFrequency = $("<td>").text(snapshot.val().frequency);
      var tableNextTrain = $("<td>").text(snapshot.val().nextTrain);
      $(tableNextTrain).attr("id","b"+counter);
      var tableMinsAway = $("<td>").text(snapshot.val().tAway);
      $(tableMinsAway).attr("id","a"+counter);
      tableMinsAway.addClass("aClass");
      var button1 = $("<button>").html("Remove");
      var button2 = $("<button>").html("Refresh");
      $(button1).attr("id", snapshot.key);
      counter++
      newRow.html(tableName).append(tableDestination).append(tableFrequency).append(tableNextTrain).append(tableMinsAway).append(button2).append(button1);
   
      $("#trainTable").append(newRow);

      console.log(snapshot.key);
      
      $(button1).on("click", function(event) {
        $(this).closest ('tr').remove ();
        var key = this.id;
        console.log(key);
        //$(this).parents('tr').first().remove();
        database.ref().child(key).remove();
      });

      $(button2).on("click", function(event) {
        location.reload();
        
      });

      

      //var myVar = setInterval(myTimer, 10000);
      //function myTimer() {
      var ffTrain = snapshot.val().fTrain;
      var ffrequency = snapshot.val().frequency;
      var ffTrainC =  moment(ffTrain, "HH:mm").subtract(1, "years");
      var ttD = moment().diff(moment(ffTrainC), "minutes");
      var ttRemainder = ttD % ffrequency;
      var ttAway = ffrequency - ttRemainder;
      var nnextTrain = moment().add(ttAway, "minutes").format("hh:mm a");
      console.log("Minutes Away: " + ttAway);
      console.log("Next Train: " + nnextTrain);
      var ta = "#a"+counter1;
      var tl = "#b"+counter1;
      $(ta).html(ttAway);
      $(tl).html(nnextTrain);
      counter1++;
      
   
   }, function(errorObject) {
   
      console.log("Errors handled: " + errorObject.code);
   
   });
   