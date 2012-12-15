var schedule;
var c=0;
var timer = {};

timer = new function(){

	this.start = function(){
		c=0;
		timedCount();
		return util.currentTimeMillis();
	};
	
	this.stop = function(){
		stopCount();
		return c;
	};
	
};



function timedCount(){    
    c=c+1;
    schedule=setTimeout("timedCount()",1000);
}

function stopCount(){
    clearTimeout(schedule);
}