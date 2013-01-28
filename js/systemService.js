var system_service = {};
system_service = new function() {

	 this.launchImagePickService = function() {
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
				var data;
				var html = '';
				//file:///opt/media/Images/image6.jpg
//				alert("Selected image path : <br/>" + reply[0].value[0]);
				for ( var i = 0; i < reply.length; i++) {
					html += 'Data ' + i + ': <br/>';

					data = reply[i];
					html += 'Key:' + data.key + '<br/>';
					html += 'Values: <br/>';

					for (var j = 0; j < data.value.length; j++) {
						html += j + ': ' + data.value[j] + '<br/>';
					}
					html += '<br/>';
				}
				alert(html);
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

		var service = new tizen.ApplicationService(
				"http://tizen.org/appcontrol/operation/send", null, "image/*");

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