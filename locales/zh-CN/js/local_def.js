var localD = new localDef();
/**
 * use the class "i18" to denote the element which wants to localizing.
 * Define the values in the map and the key is the value of element which wants to localizing.
 * @returns
 */
function localDef(){
	var self = this;
	var map = new Map();
	
	
	map.put("Login", "登录");
	
	
	self.get = function(_key){
		return map.get(_key);
	};
	
	self.translate = function(){
		$(".i18n").each(function(){
			$(this).text(self.get($(this).text()));
		});
	};
	
	return self;
}
