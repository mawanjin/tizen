//Initialize function
var init = function() {
	// TODO:: Do your initialization job
	console.log("init() called");
	
};
$(document).ready(init);

/**
 * Preparing Data
 * 
 * step 1. parse configuration xmls ,convert them to object step 2. create
 * database and tables step 3. insert configuration xml datas into database.
 * step 4. insert questions into database.
 * 
 */
(function() {
	var db = new DBManager();
	// var xmlParser = new XMLParser();
	function prepareDatabase() {
		db.createTables(afterCreateTable);
	}

	function afterCreateTable() {
		console.log("After createTables ,now filling the data...");
		db.fillData();
		timer_check_data_exist = setInterval(func_check_data_exist, 1000);
	}

	var timer_check_table_exist = null;
	var timer_check_data_exist = null;

	var func_check_data_exist = function() {
		db.getIphoneExAppPagesCount();
		db.getIphoneExAppsCount();
		db.getIphoneQuestionsCount();

		if (db.data_count_iphone_ex_apps == 152
				&& db.data_count_IphoneExAppPages == 42
				&& db.data_count_iphoneQuestions == 1510) {
			console.log("fill data complete");
			// Filling data complete
			clearInterval(timer_check_data_exist);
			// start app
			startup();
		}
	};

	var func_check_table_exist = function() {
		if (db.exists_iphone_ex_apps == 1 || db.exists_IphoneExAppPages == 1
				|| db.exists_iphoneQuestions == 1) {
			// table not exists
			clearInterval(timer_check_table_exist);
			prepareDatabase();
		} else if (db.exists_iphone_ex_apps == 0
				|| db.exists_IphoneExAppPages == 0
				|| db.exists_iphoneQuestions == 0) {
			// table exists
			clearInterval(timer_check_table_exist);
			startup();
		}
	};

	timer_check_table_exist = setInterval(func_check_table_exist, 1000);

	// db.dropDB();
	db.exists();
})();
var parser = new XMLParser();
function startup() {
	
//	parser.getProblemPackages(function(problempackage){
////		alert(problempackage[0].Attributes.AboutPage.Title);
////		alert(problempackage[0].Attributes.Bought);
////		alert(problempackage[0].Data.PackageSetName+";"+problempackage[0].Data.ProblemSets.length);
////		alert(problempackage[0].Data.PackageSetName+";"+problempackage[problempackage.length-1].Name.ProblemSetName);
//		
//		
//	});
//	parser.getmoduleinfo(function(moduleinfo) {
//		var c = moduleinfo.examSection.length;
//		for ( var i = 0; i < c; i++) {
//			var vo = moduleinfo.examSection[i];
//			alert(vo.secName + ";" + vo.secNameShort + ";" + vo.secFile);
//		}
//	 alert(moduleinfo.examType+"-"+moduleinfo.websiteURL+"::"+moduleinfo.examSection.length);
//	});
//	================================================
//	 parser.getInformation(function(array) {
//	 for ( var i = 0; i < array.length; i++)
//	 alert(array[i].name);
//	 });
	
	bindEvent();
	generateCategoryBar();
}

//======================
//index.html
//======================
function bindEvent(){
	$("#btn_login").click(function(){
		alert("good");
	});
	$("#info").click(function(){
		alert("info");
	});
	$("#perfdata").click(function(){
		alert("perfdata");
	});
	$("#disc_no_text").click(function(){
		alert("disc_no_text");
	});
	$("#bookmark").click(function(){
		alert("bookmark");
	});
	$("#mail").click(function(){
		alert("mail");
	});
	$("#search_icon").click(function(){
		alert("search_icon");
	});
	$("#btnVisit").click(function(){
		alert("btnVisit");
	});
}

function generateCategoryBar(){
	parser = new XMLParser();
	var h;
		parser
			.getmoduleinfo(function(moduleinfo) {
				h = '<div id="category_bar_container" data-corners="true" data-role="navbar"><ul>';
				var c = moduleinfo.examSection.length;
				for ( var i = 0; i < c; i++) {
					var vo = moduleinfo.examSection[i];
					// alert(vo.secName + ";" + vo.secNameShort + ";" +
					if(SystemOrientation.orientation==0){
						h+='<li><a href="#" data-theme="a">'+vo.secNameShort+'</a></li>';
					}else
						h+='<li><a href="#" data-theme="a">'+vo.secName+'</a></li>';

				}
				h+='</ul></div>';
				$("#category_bar_container").html(h); 
				$("#category_bar_container").trigger("create");
			});
	
	
	h+='<li><a href="#" data-theme="a">Two1</a></li><li><a href="#" data-theme="a">Two1</a></li><li><a href="#" data-theme="a">Two</a></li>';
	
	
//	alert(html);
//	$("#category_bar_container").html(html);
}


