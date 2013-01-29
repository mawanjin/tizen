var system_service = {};
system_service = new function() {

	this.launchImagePickService = function(callback) {
		var service = new tizen.ApplicationService(
				"http://tizen.org/appcontrol/operation/pick", null, "*/*");

		this.onSuccess = function() {
			console.log("Appservice launched");
		};

		this.onError = function() {
			alert("Appservice launch failed: " + err.message);
		};

		this.serviceReply = {
			onsuccess : function(reply) {
				callback(reply[0].value[0]);
				// alert("Selected image path : <br/>" + reply[0].value[0]);
			},
			onfail : function() {
				alert("Appservice request failed");
			}
		};

		try {
			tizen.application.launchService(service, null, this.onSuccess,
					this.onError, this.serviceReply);
		} catch (exc) {
			alert("launchService exc: " + exc.message);
		}
	};

	this.launchEmailService = function() {
		var appServiceDataTo = new tizen.ApplicationServiceData("To",
				[ "mwj@gmail.com" ]);
		var appServiceDataSubject = new tizen.ApplicationServiceData("Subject",
				[ "test" ]);
		// alert(appServiceDataTo);
		var service = new tizen.ApplicationService(
				"http://tizen.org/appcontrol/operation/send", null, "*/*", [
						appServiceDataTo, appServiceDataSubject ]);

		this.onSuccess = function() {
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
			tizen.application.launchService(service, null, this.onSuccess,
					this.onError, this.serviceReply);
		} catch (exc) {
			alert("launchService exc: " + exc.message);
		}
	};

	this.launchBrowserService = function() {
		var service = new tizen.ApplicationService(
				"http://tizen.org/appcontrol/operation/view", null, "*/*");

		this.onSuccess = function() {
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
			tizen.application.launchService(service, null, this.onSuccess,
					this.onError, this.serviceReply);
		} catch (exc) {
			alert("launchService exc: " + exc.message);
		}
	};

	this.getAppinfo = function() {
		var appInfo = tizen.application.getAppInfo();
		console.log("id=" + appInfo.id);
		console.log("name=" + appInfo.name);
		console.log("iconPath=" + appInfo.iconPath);
		console.log("version=" + appInfo.version);
	};

	this.getNetWorkInfo = function(callback) {
		var isSupported = tizen.systeminfo.isSupported("WifiNetwork");
		
		if (isSupported) {
			console.log("WifiNetwork is supported");
			tizen.systeminfo.getPropertyValue("WifiNetwork", function(wifi){
				system_service.wifiSuccess(wifi);
				if(wifi.status=="OFF"||wifi.signalStrength==0)
					system_service.checkNetWork(callback);
				else
					callback(true);
			},
			function(){
				system_service.checkNetWork(callback);
			});
		}else{
			system_service.checkNetWork(callback);
		}

	};
	
	this.checkNetWork = function(callback){
		var isSupported = tizen.systeminfo.isSupported("Network");
		
		if (isSupported) {
			console.log("Network is supported");
			tizen.systeminfo.getPropertyValue("Network", function(network){
				system_service.networkSuccess(network);
				if(network.networkType==0)
					callback(false);
				else
					callback(true);
			},
					function(){callback(false);});
		}else{
			callback(false);
		}
	};
	

	this.networkSuccess = function(network) {
		var str = "";
		try {
			str += "Network information: <br/>";
			str += "System Info Network Type: " + network.networkType
					+ " <br/>";

			console.log(str);
		} catch (exc) {
			console.log("Exception: " + exc.message + '<br/>');
		}
	};

	this.wifiSuccess = function(wifi) {
		var str = "";

		try {
			str += "Wifi network information: <br/>";
			str += "Status: " + wifi.status + " <br/>";
			str += "SSID: " + wifi.ssid + " <br/>";
			str += "IP address: " + wifi.ipAddress + " <br/>";
			str += "Signal strength: " + wifi.signalStrength + " <br/>";

			console.log(str);
		} catch (exc) {
			console.log("Exception: " + exc.message + '<br/>');
		}
	};
	
	this.launchWebBrowserService = function(){
		
		var service = new tizen.ApplicationService(
				"http://tizen.org/appsvc/operation/view", Constant.WEBSITE_URL);

		this.onSuccess = function () {
			console.log("Appservice launched");
		};

		this.onError = function(err) {
			alert("Appservice launch failed: " + err.message);
		};

		try {
			tizen.application.launchService(service, "org.tizen.browser", this.onSuccess, this.onError, null);
		} catch (exc) {
			alert("launchService exc: " + exc.message);
		}
	};

};