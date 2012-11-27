//Initialize function
var init = function() {
	// TODO:: Do your initialization job
	console.log("init() called");
};
$(document).ready(init);

/**
 *  Preparing Data 
 * 
 * step 1. parse configuration xmls ,convert them to object
 * step 2. create database and tables
 * step 3. insert configuration xml datas into database.
 * step 4. insert questions into database.
 * 
 * */
(function() {
	var db = new DBManager();
	//var xmlParser = new XMLParser();
	function prepareDatabase(){
		db.createTables();
		db.fillData();
		db.insertTest();
	}
	
	function afterCheckExists(exists){
		if(!exists)prepareDatabase();
	}
	
	/**
	 * parse 
	 */
	function prepareConfigurationData(){
		prepareDatabase();
	}
//	db.dropDB();
	db.exists(afterCheckExists);
})();