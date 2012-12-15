var EncryptionUtil = {};
EncryptionUtil = new function() {
	this.dencrypt = function(input,isEncrypt,key){
		if(!input||input=="")return "";
		var microTime = util.currentTimeMillis()*1000;
		var dynKey = isEncrypt?new String(CryptoJS.SHA1(""+microTime)):input.substring(0, 40);
		var fixedKey = new String(CryptoJS.SHA1(key));
		
		var dynKeyPart1 = dynKey.substring(0, 20);
		var dynKeyPart2 = dynKey.substring(20);
		var fixedKeyPart1 = (fixedKey.substring(0, 20));
		var fixedKeyPart2 = fixedKey.substring(20);
		
		key = new String(CryptoJS.SHA1(dynKeyPart1 + fixedKeyPart1 + dynKeyPart2 + fixedKeyPart2));

		var bytes = isEncrypt?util.getBytes(fixedKeyPart1 + input + dynKeyPart2):util.getBytes(Base64.decode(input.substring(40)));

		var len = bytes.length;
		var result = new Array();
		var keyBytes = util.getBytes(key);

		for (var n = 0; n < len; n++){
			var b = (bytes[n] ^ keyBytes[n % 40]);
			if(b!=194)
				result[n] = b;
//			result[n] = (bytes[n] ^ keyBytes[n % 40]);
		}
            

			
		var subArray;
		if(result.length>20){
			subArray = new Array();
			for(var i=0;i< result.length; i++){

				if(i>=20&&i<len-20){
					subArray.push(result[i]);
				}
			}
		}
		
		return isEncrypt ? dynKey + Base64.encode(result).replace("=", "") : util.getString(subArray);
		
		//return isEncrypt ? dynKey + base64_encode(result).replace("=", "") : new String(result, 20, len - 40, CHAR_ENCODING);
		
	};
};