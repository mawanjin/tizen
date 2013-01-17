var system_service = {};
system_service = new function() {

	 this.launchImagePickService = function(callback) {
		var service = new tizen.ApplicationService(
				"http://tizen.org/appcontrol/operation/pick", null, "*/*");

		this.onSuccess = function () {
			console.log("Appservice launched");
		};

		this.onError = function() {
			alert("Appservice launch failed: " + err.message);
		};

		this.serviceReply = {
			onsuccess : function(reply) {
				callback(reply[0].value[0]);
				//alert("Selected image path : <br/>" + reply[0].value[0]);
			},
			onfail : function() {
				alert("Appservice request failed");
			}
		};

		try {
			tizen.application.launchService(service, null, this.onSuccess, this.onError, this.serviceReply);
		} catch (exc) {
			alert("launchService exc: " + exc.message);
		}
	};
	
	this.launchEmailService = function(){
		var appServiceDataTo = 
		      new tizen.ApplicationServiceData("To", ["mwj@gmail.com"]);
		var appServiceDataSubject = 
		      new tizen.ApplicationServiceData("Subject", ["test"]);
		//alert(appServiceDataTo);
		var service = new tizen.ApplicationService(
				"http://tizen.org/appcontrol/operation/send", null, "*/*",[appServiceDataTo,appServiceDataSubject]);

		this.onSuccess = function () {
			console.log("Appservice launched");
		};

		this.onError = function() {
			alert("Appservice launch failed: " + err.message);
		};

		this.serviceReply = {
			onsuccess : function(reply) {
				alert("Selected image path : <br/>" + reply[0].value[0]);
			},
			onfail : function() {
				alert("Appservice request failed");
			}
		};

		try {
			tizen.application.launchService(service, null, this.onSuccess, this.onError, this.serviceReply);
		} catch (exc) {
			alert("launchService exc: " + exc.message);
		}
	};
	
	
	
	this.getAppinfo = function(){
		var appInfo = tizen.application.getAppInfo();
		console.log("id="+appInfo.id);
		console.log("name="+appInfo.name); 
		console.log("iconPath="+appInfo.iconPath);
		console.log("version="+appInfo.version);
	};
};