//Initialize function
var init = function() {
	// TODO:: Do your initialization job
	console.log("init() called");
	prepare();
};
$(document).ready(init);

function exit(){
	tizen.application.exit();
//	window.application.exit();
}

var db;
/**
 * Preparing Data
 * 
 * step 1. parse configuration xmls ,convert them to object step 2. create
 * database and tables step 3. insert configuration xml datas into database.
 * step 4. insert questions into database.
 * 
 */
function prepare() {
	console.log("prepare() called");
	db = new DBManager();
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
};
var parser = new XMLParser();
var main_moduleinfo;
var informations;
function startup() {
	console.log("startup() called");
	// parser.getProblemPackages(function(problempackage){
	// // alert(problempackage[0].Attributes.AboutPage.Title);
	// // alert(problempackage[0].Attributes.Bought);
	// //
	// alert(problempackage[0].Data.PackageSetName+";"+problempackage[0].Data.ProblemSets.length);
	// //
	// alert(problempackage[0].Data.PackageSetName+";"+problempackage[problempackage.length-1].Name.ProblemSetName);
	//		
	//		
	// });
	parser.getmoduleinfo(function(moduleinfo) {
		// var c = moduleinfo.examSection.length;
		// for ( var i = 0; i < c; i++) {
		// var vo = moduleinfo.examSection[i];
		// alert(vo.secName + ";" + vo.secNameShort + ";" + vo.secFile);
		// }
		// alert(moduleinfo.examType+"-"+moduleinfo.websiteURL+"::"+moduleinfo.examSection.length);
		main_moduleinfo = moduleinfo;
		console.log("afert getmoduleinfo() called");
		//generateCategoryBar();
		SystemOrientation.refresh(function (){
			console.log("afert SystemOrientation.refresh() called");
//			refreshList(current_section_short,current_section);	
		});
		initConstant();
	});
//	 ================================================
	 parser.getInformation(function(array) {
		 informations = array;
//	 for ( var i = 0; i < array.length; i++)
//	 alert(array[i].name);
	 });

	bindEvent();
//	this.questionStemA.replaceAll("[\\r\\n]", " ");
//	var code = "a"+1+"r"+5+"c"+0+"p?";
//	var rr = EncryptionUtil.dencrypt("0b8cdf3b8f94bea2549e8f643893a278e5200b10VwxWBwQCBQIHBlMGBQBRA1xUUFViXVFSCkFWXwFEC1NFRltREVQMDVhXQFhZBhYFXENbABFaVREEQgVfWEVUVBYEGVAKAEQ4b1NQV0RAAhVRGFNURAJED0NCXgtfGF9XRRYOVRVaSlUHExlYCkQTXQxRWxRFWgZBUlFbXERBVxRWFjpuQlBfRgtCB0QVQVBUQgdcQhANElQJDQtSBwZQWQ0LVgMAWVNTAQYHBgAI",false,code)
//	alert(rr.replaceAll("[\\r\\n]", " "));
}

// ======================
// index.html
// ======================
function bindEvent() {
	console.log("bindEvent() called");
	
	$("#btnInfo").click(function() {
		
		setTimeout(function(){
			if(informations&&informations.length>0){
				$("#intro_list").html('');
				for ( var i = 0; i < informations.length; i++){
					if(i==informations.length-1){
						$("#intro_list").append('<li><a href="#" onclick="showInforContent('+i+');" >'+informations[i].name+'</a></li>');
					}else
						$("#intro_list").append('<li><a href="#info_content" onclick="showInforContent('+i+');" >'+informations[i].name+'</a></li>');
				}
			}
			if($('#intro_list')){
				setTimeout(function(){
					$('#intro_list').listview('refresh');
				},500);
			}
		});
	});
	$("#btn_login").click(function() {
		
		
		if(http.publicUser&&http.publicUser.userName&&http.publicUser.userName!=""){
			$("#btn_login").html('<input  type="image" width=100% height=25px src="./css/images/bttn_no_txt.png" data-role="none" />');
			$("#btn_login").trigger('create');
			http.publicUser.userName="";
			http.publicUser.password="";
			http.publicUser.profile="";
		}
		/*
		//check log status
		if(http.User){//log out
			$("#btn_login").html('<input  type="image" width=100% height=25px src="./css/images/bttn_no_txt.png" data-role="none" />');
		}else{//log in
			$("#btn_login").html('<input  type="image" width=100% height=25px src="./css/images/logout_button.png" data-role="none" />');
		}
		*/
	});
	$("#perfdata").click(function() {
		generateCategoryBarForSta(function(){
//			db.getExamStatsBySectionAndType()
		});
	});
	$("#disc_no_text").click(function() {
		//show loading
		$("#loading_discussion").html(util.getLoading());
		$("#loading_discussion").show();
		
		//load data from server(HTTP).
		http.findDiscussionsByExamType(function(data){
			console.log("findDiscussionsByExamType() called");
			if(data==-1){
				$("#loading_discussion").hide();
				alert("time out ,please try later.");
				return;
			}
			var html='';
			for(var i=0;i<data.length;i++){
				var o = data[i];
				var img = '<a href="#userInfo" onclick="showUserInfo('+o.userId+',\''+o.profilePic+'\',\''+o.attachIamge+'\');"><img width=40px src="'+o.profilePic+'" /></a>';
				var questionID = o.questionId;
				var date = '<font color=blue size=1>'+o.date+'</font>';
				var title = o.uname;
				var attach = o.attachIamge;
				var go = '';
				if(questionID!=0)
					go = '<font color=blue size=1>Go to problemset</font>';
				if(!attach)attach='';
				else
					attach='<img width=80px height=60px src="'+attach+'" onclick=showBigAttach("'+attach+'"); />';
				var content = o.message;
				
				html+='<li><table width=100%><tr><td width="50px">'+img+'</td><td><table width=100% border=0><tr><td colspan=2><table width=100%><tr><td>'+title+'</td><td align=right><a href="#reply"><img src="./css/images/chat.png " onclick="postForQuestion('+questionID+');" /></a></td></tr></table></td></tr><tr><td>'+attach+'</td><td>'+content+'</td></tr><tr><td colspan=2><table width=100%><tr><td>'+go+'</td><td align=right>'+date+'</td></tr></table></td></tr></table></td></tr></table></li>';
			}
			$("#loading_discussion").hide();
			$("#thelist_discussion").html(html);
			$("#thelist_discussion").trigger("create");
			
			setTimeout(function () {
				myDiscussionScroll.refresh();
			},2000);
		});
	});
	$("#bookmark").click(function() {
		updateBookmark('date');
	});
	$("#mail").click(function() {
		alert("mail");
	});
	$("#search_icon").click(function() {
		alert("search_icon");
	});
	$("#btnVisit").click(function() {
		alert("btnVisit");
	});
	$("#post").click(function() {
		//check the type of reply:plain or reply for one
		current_post_type = 1;
		$("#reply_textarea").html("");
	});
	
	$("#popupPhotoPicker").bind({
		popupafterclose: function(event, ui) {setTimeout(showPopupRegister,100);}
	});
	
}

function showPopupRegister(){
	$("#popupRegister").popup("open");
}

function postForQuestion(questionId){
	current_question_id = questionId;
	current_post_type = 2;
	$("#reply_textarea").html("");
	//post(2);
}

var current_post_type;
var current_question_id;
var current_discussion_id;
/**
 * 
 * @param type 1-post new 2-for given question 3-reply
 */ 
function post(){
	
	console.log("bindEvent() called,and type="+current_post_type);
	
	//post data to server
	//step 1 -  check user login status if not login show the login dialog
	//step 2 - after login post to server
	var user = new http.User("mwj@hotmail.com","123456",5);
	var message = $("#reply_textarea").val();
	if(message==""){
		alert("Please input something.");
		return;
	}
	//show loading
	$("#loading_post").html(util.getLoading());
	$("#loading_post").show();
	
	if(current_post_type==1){
		http.postNew(user,message,function(data){
			$("#loading_post").hide();
			if(data==-1){
				$("#loading_post").hide();
				alert("time out ,please try later.");
				return;
			}else
				$("#disc_no_text").trigger("click");
		});
	}else if(current_post_type==2){
		http.postForAGivenQuestion(user,current_question_id, message,function(data){
			$("#loading_post").hide();
			if(data==-1){
				$("#loading_post").hide();
				alert("time out ,please try later.");
				return;
			}else
				$("#disc_no_text").trigger("click");
		});
	}else if(current_post_type==3){
		http.postReply(user,current_discussion_id, message,function(data){
			$("#loading_post").hide();
			if(data==-1){
				$("#loading_post").hide();
				alert("time out ,please try later.");
				return;
			}else
				$("#disc_no_text").trigger("click");
		});
	}else {
		$("#loading_post").hide();
		alert("invalid type");
	}
	
	
}

function showUserInfo(userId,head,attach){
	
	http.getUserInfo(userId,function(data){
		if(data==-1){
			alert("time out ,please try later.");
			return;
		}
		
		$("#userinfo_content_head").html("<img src='"+head+"' />");
		
		$("#userinfo_content_title").html(data.uname);
		$("#userinfo_content_name").html(data.uname);
		$("#userinfo_content_post").html(data.post+" Posts");
		$("#userinfo_content_aboutme").html(data.aboutme);
		if(attach&&attach!=undefined&&attach!="undefined"){
			$("#attachImg_userinfo").html("<img width=50% height=30% src='"+attach+"' onclick=showBigAttachForUserInfo('"+attach+"'); />");
		}
	});
}

function showBigAttachForUserInfo(attachURL){
	
	$("#div_attach_userinfo").html('<img width=100% height=100% id="imgAttach" src="'+attachURL+'"  />');
	$("#div_attach_userinfo").show();
	
	$("#div_attach_userinfo").bind("click",function(){
		$("#div_attach_userinfo").hide();	
	});
}

function showBigAttach(attachURL){
	
	$("#div_attach").html('<img width=100% height=100% id="imgAttach" src="'+attachURL+'"  />');
	$("#div_attach").show();
	
	$("#div_attach").bind("click",function(){
		$("#div_attach").hide();	
	});
}

function updateBookmark(orderby){
	//title
	db.findAllBookMark(orderby,function(data){
		
		console.log("updateBookmark() called..date.length="+data.length);
		var html='';
		for(var i=0;i<data.length;i++){
			var o = data[i];
			var title = o.title;
			var date = o.date;
			html+='<li><a href="javascript:alert(11);" style="color:black;text-decoration:none;"><table width=100%><tr><td width=50%>'+title+'</td><td>'+date+'</td></tr></table></a></li>';
		}
		$("#thelist_bookmark").html(html);
		$("#thelist_bookmark").trigger("create");
		
		setTimeout(function () {
			mybookmarkScroll.refresh();
		},2000);
	});
}

var current_section,current_section_short;
function generateCategoryBar(callback) {
	console.log("generateCategoryBar() called");
	parser = new XMLParser();
	var h;
	parser
			.getmoduleinfo(function(moduleinfo) {
				h = '<div id="category_bar_container" data-corners="true" data-role="navbar"><ul>';
				var c = moduleinfo.examSection.length;
				for ( var i = 0; i < c; i++) {
					var vo = moduleinfo.examSection[i];
					var selected='';
					if(i==0){
						selected='class="ui-btn-active"';
						current_section = vo.secName;
						current_section_short = vo.secNameShort;
					}
					
					if (SystemOrientation.orientation == 0) {
						
						h += '<li><a '+selected+' onclick="refreshList(\'' + vo.secNameShort
								+ '\',\'' + vo.secName
								+ '\');"  >'
								+ vo.secNameShort + '</a></li>';
					} else
						h += '<li><a '+selected+' href="#" onclick="javascript:refreshList(\''
								+ vo.secNameShort
								+ '\',\''
								+ vo.secName
								+ '\');" >'
								+ vo.secName
								+ '</a></li>';

				}
				h += '</ul></div>';
				$("#category_bar_container").html(h);
				$("#category_bar_container").trigger("create");
				
				$("#category_bar_container").find("li").addClass("ui-btn-active");
				refreshList(current_section_short,current_section);
				
				if(callback)
				callback();
			});
}

function initConstant(){
	Constant.SERVER_URL = main_moduleinfo.ServerURL+"/";
	if(!Constant.SERVER_URL.startWith("http"))Constant.SERVER_URL="http://"+Constant.SERVER_URL+"/";
	Constant.GET_SERVER_URL_DISCUSSIONS_BY_QUESTION_ID=Constant.SERVER_URL+"jreq.php?discussions_question=1&q_id=";
	Constant.GET_SERVER_URL_DISCUSSIONS_BY_EXAM = Constant.SERVER_URL+"jreq.php?discussions_recent=1&exam_type="+main_moduleinfo.examType;
	Constant.GET_SERVER_URL_POST_A_NEW_DISCUSSION = Constant.SERVER_URL+"post_a_new_discussion_thread";
	Constant.GET_SERVER_URL_POST_FOR_A_GIVEN_QUESTION = Constant.SERVER_URL+"index.php?qdiscussions_popup=$&question=";
	Constant.GET_SERVER_URL_POST_REPLY = Constant.SERVER_URL+"post_reply/";
	Constant.GET_SERVER_URL_USER_INFO = Constant.SERVER_URL+"jreq.php?user_info=1&user_id=";
	Constant.GET_SERVER_URL_USER_LOGIN = Constant.SERVER_URL+"jsonlogin/";
	Constant.GET_SERVER_URL_USER_REGISTER = Constant.SERVER_URL+"jsonregister/";
}

var current_section_for_sta;
function generateCategoryBarForSta(callback) {
	console.log("generateCategoryBarForSta() called");
	parser = new XMLParser();
	var h;
	parser
			.getmoduleinfo(function(moduleinfo) {
				h = '<div id="category_bar_sta_container" data-corners="true" data-role="navbar"><ul>';
				var c = moduleinfo.examSection.length;
				for ( var i = 0; i < c; i++) {
					var vo = moduleinfo.examSection[i];
					var selected='';
					if(i==0){
						selected='class="ui-btn-active"';
						current_section = vo.secName;
						current_section_short = vo.secNameShort;
					}
					
					if (SystemOrientation.orientation == 0) {
						
						h += '<li><a '+selected+' onclick="refreshListSta(\'' + vo.secNameShort
								+ '\',\'' + vo.secName
								+ '\',1);"  >'
								+ vo.secNameShort + '</a></li>';
					} else
						h += '<li><a '+selected+' href="#" onclick="javascript:refreshListSta(\''
								+ vo.secNameShort
								+ '\',\''
								+ vo.secName
								+ '\',1);" >'
								+ vo.secName
								+ '</a></li>';

				}
				h += '</ul></div>';
				$("#perfdata_category").html(h);
				$("#perfdata_category").trigger("create");
				$("#perfdata_category").find("li").addClass("ui-btn-active");
				
				if(callback)
					callback();
			});
}
function refreshListStaByType(type){
	refreshListSta('',current_section_for_sta,type);
}
function refreshListSta(sectionShortName, sectionName,type){
	if(type==1){
		$("#Last").addClass("ui-btn-active");
		$("#Average").removeClass("ui-btn-active");
		$("#Best").removeClass("ui-btn-active");
	}
	current_section_for_sta = sectionName;
	console.log("refreshListSta() called");
	db.getExamStatsBySectionAndType(sectionName,type,function(data){
		var html = '<li><table width=100%><tr><td width=25% align=center>&nbsp;</td><td width=25% align=center>Per Question</td><td width=25% align=center>Total Time</td><td width=25% align=center>Score</td><tr><table></li>';
		for(var i=0;i<data.length;i++){
			var o = data[i];
			var name = o.name;
			var per = o.per;
			var totalTime = o.totalTime;
			var score = o.score;
			html += '<li><table width=100%><tr><td width=25% align=center>'+name+'</td><td width=25% align=center>'+per+'</td><td width=25% align=center>'+totalTime+'</td><td width=25% align=center>'+score+'</td><tr><table></li>';
		}
		$("#thelist_sta").html(html);
		$("#thelist_sta").trigger("create");
		
		setTimeout(function () {
			myStaScroll.refresh();
		});
	});
}


var recommendations;
var ListItemMyQuestions;
function refreshList(sectionShortName, sectionName) {
	console.log("refreshList() called");
	if (!recommendations || recommendations.length == 0) {
		getAllPackageItems(function(data) {
			recommendations = data;
			console.log("find my questionsets by sectionName::"+sectionName);
			// get myQuestionSets
			db.findMyQuestionSets(sectionName, function(data) {
				console.log("find my questionsets...size is "+data.length);
				ListItemMyQuestions = data;
				fireRefreshList();
			});
		});
	} else {
		// get myQuestionSets
		console.log("find my questionsets by sectionName::"+sectionName);
		db.findMyQuestionSets(sectionName, function(data) {
			console.log("find my questionsets...size is "+data.length);
			ListItemMyQuestions = data;
			fireRefreshList();
		});
	}
	
//	if (!recommendations || recommendations.length == 0) {
//		getAllPackageItems(function(data) {
//			recommendations = data;
//			// get myQuestionSets
//			db.findExAppsBySection(sectionName, function(data) {
//				exApps = data;
//				fireRefreshList();
//			});
//		});
//	} else {
//		// get myQuestionSets
//		db.findExAppsBySection(sectionName, function(data) {
//			exApps = data;
//			fireRefreshList();
//		});
//	}
}

function refreshMainListViewHeight() {
	console.log("refreshMainListViewHeight() called");
	if (SystemOrientation.orientation == 0)
		$("#div_content").css("height",
				Constant.main_div_listview_height_portrait);
	else
		$("#div_content").css("height",
				Constant.main_div_listview_height_landscape);
	
	
}

function fireRefreshList() {
	console.log("fireRefreshList() called");
	console.log("ready to fill the listview.[recommendation="+recommendations.length+"];[myquestionests="+ListItemMyQuestions.length+"]");
	update(recommendations,ListItemMyQuestions);
}
/**
 * show the introduction of one problemset,it is usually called when click on list.  
 */
function showProblemSetIntro(){	
	//$('div[data-role="page"]').hide();
	//window.location.href="#info";
}

//List View
function createListItemMyQuestions(data){
	
	var img = '<img src="./css/images/'+data.logoImg+'" />';
	var title ='<div><strong>'+data.title+'</strong></div>';
	if(data.info){
		var info = data.info;
		info = info.replaceAll('\\\\','');
		title+='<div>'+info+'</div>';
	}
	//test begin
	//....test in progress
//	data.progress='In progress: 10/25';
//	data.progressMax=25; 
//	data.progressCount=10;
	//....test Last score
//	data.progress='Last Score:0%';
//	data.finish="true";
	//test end
	var img_arrow = '<div style="float:left;width:100%;height:100%;border:0px solid blue;text-align:right;"><table border=0 height="100%" cellspacing=0 cellpadding=0><tr><td align="right" valign="middle"><img name="arrow" src="./css/images/arrow.png" width="15px" height="10px;" /></td></tr></table></div>';
	var progress='';
	if(data.progress!=''&&data.finish=="false")
		progress = '<div><meter min="0" max="'+data.progressMax+'" value="'+data.progressCount+'" /></div>';
	 
	var status='<div style="float:left;"><div style="font-size:10px;">'+data.progress+'</div>'+progress+'</div>'; 
	 
	var html = '<table cellspacing=0 cellpadding=0><tr><td name="td_logo" valign="middle" >'+img+'</td><td name="title">'+title+'</td><td name="td_last" align="right" valign="center"><table width="100%" border="0"><tr><td><div style="text-align:right;">'+status+'</div></td><td align="right">'+img_arrow+'</td></tr></table></td></tr></table>';
	return html;
}

function createListItemRecommendation(data){
	var img = '<img name="recommend_logo" src="./css/images/'+data.icon+'" />';
	var title ='<div><strong>'+data.title+'</strong></div>';
	var price = data.price;
	
	var img_arrow = '<img name="arrow" src="./css/images/arrow.png" width="15px" height="10px;" />';
	var html = '<table cellspacing=0 cellpadding=0><tr><td name="td_logo" valign="middle" >'+img+'</td><td >'+title+'</td><td name="price" align="right">'+price+'&nbsp;'+img_arrow+'</td></tr></table>';
	return html;
}

function showProblemMenuList(){
	if($("#wrapper_problemIntroMenu").is(":hidden"))
		$("#wrapper_problemIntroMenu").show();
	else
		$("#wrapper_problemIntroMenu").hide();
	
	updateListView();
}
function hideMenuList(){
	setTimeout(function(){
		$("#wrapper_problemIntroMenu").hide();	
	},1000);
	
}
function updateListView(){
	
	var html='<li><a href="#main" onclick="hideMenuList()" style="color:black;text-decoration:none;" ><table><tr><td width=40px; valign="middle"><img src="./css/images/back.png" /></td><td><strong>Return to Main Menu<strong></td><td>&nbsp;</td></tr></table></a></li>';
	if(ListItemMyQuestions&&ListItemMyQuestions.length>0){
		
		for(var i=0;i<ListItemMyQuestions.length;i++){
			var o = ListItemMyQuestions[i];
			html+='<li><a href="#problemIntro" onclick=showProblemSetInforContent('+i+'); style="color:black;text-decoration:none;" >'+createListItemMyQuestions(o)+'</a></li>';
		}
			
	}
	
	$("#thelist_problemIntroMenu").html(html);
	$("#thelist_problemIntroMenu").trigger("create");
	
	setTimeout(function () {
		myProblemIntroMenuScroll.refresh();
	},2000);
}

function update(recommendations,myquestions){
	
	var html='';
	if(myquestions&&myquestions.length>0){
		
		html+='<li style="height:30px; line-height:30px;background-color:#73ff8c;"><strong>MY Question Sets</strong></li>';
		for(var i=0;i<myquestions.length;i++){
			var o = myquestions[i];
			html+='<li><a href="#problemIntro" onclick=showProblemSetInforContent('+i+'); style="color:black;text-decoration:none;" >'+createListItemMyQuestions(o)+'</a></li>';
		}
			
	}
	
	if(recommendations&&recommendations.length>0){
		html+='<li style="height:30px; line-height:30px;background-color:#73ff8c;"><strong>Recommendations</strong></li>';
		for(var i=0;i<recommendations.length;i++){
			var o = recommendations[i];
			html+='<li data-icon="arrow-r" data-iconpos="right" ><a href="#package_intro" onclick="showPackageIntro('+i+');" style="color:black;text-decoration:none;">'+createListItemRecommendation(o)+'</a></li>';
		}
	}
	$("#thelist").html(html);
	$("#thelist").trigger("create");
	//$('#thelist').listview('refresh');
	
	setTimeout(function () {
		myScroll.refresh();
	});
}

function showPackageIntro(position){
	var o = recommendations[position];
	$("#package_intro_name").html(o.title);
	
	$("#thelist_package_intro").html('<li>'+o.text+'</li>');
	
	setTimeout(function () {
		myPackageIntroScroll.refresh();
	},1000);
	
}

function showInforContent(which){
	if(which == informations.length-1){
		alert("invoke web browser.");
	}else{
		$("#infor_content_title").html('<h3>'+informations[which].name+"</h3>");
		$("#thelist_info").html('<li>'+informations[which].content+'</li>');
		$("#thelist_info").trigger("create");
		
		
		setTimeout(function () {
			myInfoScroll.refresh();
		},2000);
	}
}
var current_exAppId;
var current_exAppName;
var current_questions;
function showProblemSetInforContent(position){
		$("#btnReview").show();
		$("#btnResume").show();
		$("#btnBegin").show();
		
		var o = ListItemMyQuestions[position];
		var title = o.title;
		if(o.info){
			var info = o.info.replaceAll('\\\\','');
			title = title+':'+info;
		}
		
		
		
		var exAppId = o.exAppId;
		
		current_exAppId = exAppId;
		current_exAppName = title;
		
	    db.findProblemSetIntroductionByExAppId(exAppId,function(data){
	    	var content = data;
	    	
	    	$("#problemIntro_title").html(title);
			$("#thelist_problemSetinfo").html('<li>'+content+'</li>');
			$("#thelist_problemSetinfo").trigger("create");
			
			setTimeout(function () {
				myProblemIntroScroll.refresh();
			},2000);
			
			//$("#wrapper_problemIntro").hide();
	    });
		
		db.getNumOfQuestions(exAppId,function(count){
			if(!count||count==0||count<1){
				$("#btnReview").hide();
				$("#btnResume").hide();
				$("#btnBegin").hide();
			}else{
				db.GetExamResultInfoByExAppIDs(exAppId,function(info){
			    	if(!info||info.length==0){
			    		$("#btnReview").hide();
						$("#btnResume").hide();
			    	}else if(!info[0].finish){
			    		$("#btnReview").hide();
			    	}else if(info[0].finish){
			    		$("#btnResume").hide();
			    	}
			    });
			}
		});
}

function login(){
	//show loading
	$("#loading_login").html(util.getLoading());
	$("#loading_login").show();
	var login_name = $("#login_name").val();
	var login_pass = $("#login_pass").val();
	http.login(login_name,login_pass,function(data){
		$("#loading_login").hide();
		if(data==-1){
			alert("Invalid Log-in or Password...");
		}else{
			//alert(http.User.profile);
			http.publicUser = data;
			$("#btn_login").html('<input  type="image" width=100% height=25px src="./css/images/logout_button.png" data-role="none" />');
			$( "#popupBasic" ).popup( "close" );
		}
	});
}

function register(){
	//show loading
	$("#loading_login").html(util.getLoading());
	$("#loading_login").show();
	
	var fname = $("#fname").val();
	var lname = $("#lname").val();
	var email = $("#email").val();
	var pass = $("#pass").val();
	var r_pass = $("#r_pass").val();
	var exam = "";
	//fname,lname,email,pass,r_pass,exam,callback
	http.register(fname,lname,email,pass,r_pass,exam,function(data){
		$("#loading_login").hide();
		if(data==-1){
			alert("please try later");
		}else if(data.userName){//register success and login success
			$("#btn_login").html('<input  type="image" width=100% height=25px src="./css/images/logout_button.png" data-role="none" />');
			$( "#popupRegister" ).popup( "close" );
		}else{
			alert(data);
		}
	});
}

function showGallery(){
	
}

function beginPractice(){
//	current_exAppId
//  current_exAppName
// current_questions	
// generate choice pancel
	console.log("beginPractice() called");
	db.findQuestionsByExAppID(current_exAppId,function(questions){
		current_questions = questions;
		console.log("current_questions.length="+current_questions.length);
		
		mChoicePanel.generateChoicePancel(current_questions[0],function(which){
			console.log("option is "+which+" onclick...");
		},function(){
			console.log("generateChoicePancel() successed");
		});
	});
	
}



