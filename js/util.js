String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}

String.prototype.startWith = function(str) {
	var reg = new RegExp("^" + str);
	return reg.test(this);
}

var util = {};

util = new function() {
	this.getLoading = function() {
		return "<div class='marginLeft'><div id='circular_1' class='circular'></div><div id='circular_2' class='circular'></div><div id='circular_3' class='circular'></div><div id='circular_4' class='circular'></div><div id='circular_5' class='circular'></div><div id='circular_6' class='circular'></div><div id='circular_7' class='circular'></div><div id='circular_8' class='circular'></div><div class='clearfix'></div></div>";
	};
};