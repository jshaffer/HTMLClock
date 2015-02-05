$(function(){
	getTime();
    getTemp();
})

function showAlarmPopup() {
    $("#mask").removeClass("hide")
    $("#popup").removeClass("hide")
}   

function hideAlarmPopup() {
    $("#mask").addClass("hide")
    $("#popup").addClass("hide")
}

function insertAlarm(hours, mins, ampm, alarmName) {
    var newDiv = $("<div>")
    newDiv.addClass("flexable")
    newDiv.append("<div class='name'>" +  alarmName + "</div><div class='time'>" + hours + ":" + mins + " " + ampm + "</div>")
    $("#alarms").append(newDiv)
}

function addAlarm() {
    var hours = $("#hours option:selected").val()
    var mins = $("#mins option:selected").val()
    var ampm = $("#ampm option:selected").val()
    var alarmName = $("#alarmName").val() + "&nbsp;"

    insertAlarm(hours, mins, ampm, alarmName);
    hideAlarmPopup();

}

function getTime() {
	var d = new Date();
	$("#date").html(d.toLocaleTimeString());
	setTimeout(getTime, 1000);
}


function getTemp() {
    var aUrl = "https://api.forecast.io/forecast/58b9dcb3e551aee51b50af8e62af81d9/35.300399,-120.662362?callback=?";

    $.getJSON(aUrl) 
        .success(function(data) {
            var summary = data.daily.summary;
            $("#forecastLabel").html(summary);

            var forecastIcon = "img/" + data.daily.icon + ".png";
            $("#forecastIcon").attr("src", forecastIcon);

            var temp = Math.round(data.daily.data[0].temperatureMax);

            if (temp < 60) {
                $("body").addClass("cold");
            } else if(temp < 70) {
                $("body").addClass("chilly");
            } else if(temp < 80) {
                $("body").addClass("nice");
            } else if(temp < 90) {
                $("body").addClass("warm");
            } else {
                $("body").addClass("hot");
            }
        });
}

