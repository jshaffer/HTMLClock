var alarms = {}

$(function(){
	getTime();
    getTemp();
    getAllAlarms();
})

function getAllAlarms() {
    Parse.initialize("EXmf1XEREwS4IvIcVpuN9lStvNu0zTyXLR64gzSS", "JWiHJBZvOoBmKLZzyAjpZSBDCw8nen03OHoJ9AbC");
    var AlarmObject = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmObject);
    query.find({
        success: function(results) {
          for (var i = 0; i < results.length; i++) { 
            var timeStr = results[i].get("time");
            var hours = timeStr.split(":")[0]; 
            var mins = timeStr.split(" ")[0].split(":")[1];
            var ampm = timeStr.split(" ")[1];
            var id = results[i].id;
            var alarmName = results[i].get("alarmName");

            alarms[alarmName] = id;

            insertAlarm(hours, mins, ampm, alarmName);
          }
        }
    });
}

function deleteStr(str) {

    var AlarmObject = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmObject);
    query.get(alarms[str], {
        success: function(result) {
                result.destroy({ 
                    success: function(obj) {
                        $("#" + obj.get("alarmName")).remove()
                        alert("Alarm successfully removed");
                    }
                })
        },
        error: function(object, error) {
            console.log(error)
            alert("Error: alarm was not deleted, try again!");
        }
    });

}

function showAlarmPopup() {
    $("#mask").removeClass("hide")
    $("#popup").removeClass("hide")
}   

function hideAlarmPopup() {
    $("#mask").addClass("hide")
    $("#popup").addClass("hide")
}

function insertAlarm(hours, mins, ampm, alarmName, alarmId) {
    var newDiv = $("<div id='" + alarmName +"'>")
    newDiv.addClass("flexable")
    var button = "<button onclick=\'deleteStr(\"" + alarmName + "\")\'>X</button>";
    newDiv.append("<div class='name'>" +  alarmName + "&nbsp;</div><div class='time'>" + hours + ":" + mins + " " + ampm + button +  "</div>" )
    $("#alarms").append(newDiv)
}

function addAlarm() {
    var hours = $("#hours option:selected").val()
    var mins = $("#mins option:selected").val()
    var ampm = $("#ampm option:selected").val()
    var alarmName = $("#alarmName").val();

    var time = "" + hours + ":" + mins + " " + ampm;

    var AlarmObject = Parse.Object.extend("Alarm");
    var alarmObject = new AlarmObject();
    alarmObject.save({"time": time,"alarmName": alarmName}, {
        success: function(object) {
            insertAlarm(hours, mins, ampm, alarmName);
            hideAlarmPopup();
            alarms[alarmName] = object.id
        }
    });

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

