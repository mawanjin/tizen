String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
};

String.prototype.startWith = function(str) {
	var reg = new RegExp("^" + str);
	return reg.test(this);
};




var util = {};

util = new function() {
	this.getLoading = function() {
		return "<div class='marginLeft'><div id='circular_1' class='circular'></div><div id='circular_2' class='circular'></div><div id='circular_3' class='circular'></div><div id='circular_4' class='circular'></div><div id='circular_5' class='circular'></div><div id='circular_6' class='circular'></div><div id='circular_7' class='circular'></div><div id='circular_8' class='circular'></div><div class='clearfix'></div></div>";
	};
	this.getLoadingForDiscussion= function(){
		return "<div class='marginLeftDiscussion'><div id='circular_1' class='circular'></div><div id='circular_2' class='circular'></div><div id='circular_3' class='circular'></div><div id='circular_4' class='circular'></div><div id='circular_5' class='circular'></div><div id='circular_6' class='circular'></div><div id='circular_7' class='circular'></div><div id='circular_8' class='circular'></div><div class='clearfix'></div></div>";
	};
	this.getLoadingForQuestion= function(){
		return "<div class='marginLeftDiscussion'><div id='circular_1' class='circular'></div><div id='circular_2' class='circular'></div><div id='circular_3' class='circular'></div><div id='circular_4' class='circular'></div><div id='circular_5' class='circular'></div><div id='circular_6' class='circular'></div><div id='circular_7' class='circular'></div><div id='circular_8' class='circular'></div><div class='clearfix'></div></div>";
	};
	
	this.currentTimeMillis = function(){
		
		return Date.parse(new Date());
//		var date=new Date();
//		var yy=date.getYear(); 
//		var MM=date.getMonth() + 1;
//		var dd=date.getDay(); 
//		var hh=date.getHours(); 
//		var mm=date.getMinutes(); 
//		var ss=date.getSeconds(); 
//		var sss=date.getMilliseconds();  
//		return Date.UTC(yy,MM,dd,hh,mm,ss,sss); 
	};
	
	this.formateDate = function(timeMillis){
		timeMillis = parseInt(timeMillis);
		var d = new Date(timeMillis);
		return (d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()); 
	};
	
	this.getBytes = function(str){
		var ch, st, re = [];   
	    for (var i = 0; i < str.length; i++ ) {     
	        ch = str.charCodeAt(i);  
	        st = [];         
	        do {      
	             st.push( ch & 0xFF ); 
	             ch = ch >> 8;
	        } while ( ch );
	        re = re.concat( st.reverse() );   
	     }   // return an array of bytes   
	     return re;
	};
	
	this.getString = function(bytes){
		var s = "";
		var arr = [];
		for(var i=0;i<bytes.length;i++){
			arr.push(bytes[i]);
		}
		var str = String.fromCharCode.apply("", arr);
		return str;
	};
	
	this.contains = function(string, substr, isIgnoreCase)
	{
	    if (isIgnoreCase)
	    {
	         string = string.toLowerCase();
	         substr = substr.toLowerCase();
	    }

	    var startChar = substr.substring(0, 1);
	    var strLen = substr.length;

	    for (var j = 0; j<string.length - strLen + 1; j++)
	    {
	         if (string.charAt(j) == startChar)  //如果匹配起始字符,开始查找
	         {
	             if (string.substring(j, j+strLen) == substr)  //如果从j开始的字符与str匹配，那ok
	             {
	                 return true;
	             }   
	         }
	    }
	    return false;
	};
	
	this.strToJson = function(str){
//		var json = eval('(' + str + ')'); 
//		return json;
		//$("#div_test1").text(str);
		var str = new String(str);
		
		try{
			eval("var theJsonValue = "+str);
		}catch(e){
			alert(e.message);
		}
		
		return theJsonValue;
	} ;
	/**
	 * convert second to "HH:mm:ss"
	 * 
	 * @param second
	 */
	this.getTime = function(second){
		var min = parseInt(second / 60);
		var sec = (second % 60);
		var hour = parseInt(min / 60);
		if(hour==0)hour="00";
		if(min<10)min="0"+min;
		if(sec<10)sec="0"+sec;
		return hour+":"+min+":"+sec;
	};
	
	this.convertChoiceToStr = function(i){
		var _w='--';
		if(i==0)_w='a';
		else if(i==1)_w='b';
		else if(i==2)_w='c';
		else if(i==3)_w='d';
		else if(i==4)_w='e';
		else if(i==5)_w='f';
		return _w;
	};
	
	this.convertChoiceToIndex = function(i){
		if(i=='a')return 0;
		else if(i=='b')return 1;
		else if(i=='c')return 2;
		else if(i=='d')return 3;
		else if(i=='e')return 4;
		else if(i=='f')return 5;
		else if(i=='g')return 6;
	};
	
	this.pause = function(millisecondi)
	{
	    var now = new Date();
	    var exitTime = now.getTime() + millisecondi;

	    while(true)
	    {
	        now = new Date();
	        if(now.getTime() > exitTime) return;
	    }
	};
	
};

