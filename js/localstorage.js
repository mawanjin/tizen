var storage = window.localStorage;
var prefixInperson = "inperson_";
var prefixInpersonXml = "inperson_xml_";
var keyInpersonkeys = prefixInperson+"keys";
var mStorage = {
	
		saveInperson:function(questionId,base64,xml){
		console.log("saveInpersonBase64() called."+storage);
		storage.setItem(prefixInperson+questionId,base64);
		storage.setItem(prefixInpersonXml+questionId,xml);
		
		var keys = storage.getItem(keyInpersonkeys);
		console.log("keyInpersonkeys="+keys);
		if(!keys||keys==''||keys==null){
			storage.setItem(keyInpersonkeys,questionId);
		}else{
			keys =  keys.replaceAll(","+questionId,"");
			keys =  keys.replaceAll(questionId,"");
			storage.setItem(keyInpersonkeys,keys+","+questionId);
		}
	},
	getInpersonBase64:function(questionId){
		return storage.getItem(prefixInperson+questionId);
	},
	getInpersonXml:function(questionId){
		return storage.getItem(prefixInpersonXml+questionId);
	},
	getInpersonKeys:function(){
		var rs = new Array();
		var str = storage.getItem(keyInpersonkeys);
		if(str&&str!=''){
			var arrayKey = str.split(",");
			for(k in arrayKey){
				if(arrayKey[k]=="")continue;
				rs.push(arrayKey[k]);
			}
		}
		return rs;
	}
	
};
