$(function(){
	getTime();
})

function getTime() {
	var d = new Date();
	$("#date").html(d);
	setTimeout(getTime, 1000);
}




