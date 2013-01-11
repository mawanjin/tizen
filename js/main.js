//Initialize function
var init = function() {
	// TODO:: Do your initialization job
	console.log("init() called");
	//show loading
	$("#loading_login").html(util.getLoading());
	$("#loading_login").show();
	
	prepare();
	
};
$(document).ready(init);

function exit(){
	tizen.application.exit();
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
		console.log("prepareDatabase() called");
		db.createTables(afterCreateTable);
	}
	
	var timer_check_table_exist = null;
	var timer_check_data_exist = null;

	var func_check_data_exist = function() {
		db.getIphoneExAppPagesCount();
		db.getIphoneExAppsCount();
		db.getIphoneQuestionsCount();
//		console.log("db.data_count_iphone_ex_apps = "+db.data_count_iphone_ex_apps);
//		console.log("db.data_count_IphoneExAppPages ="+db.data_count_IphoneExAppPages);
//		console.log("db.data_count_iphoneQuestions = "+db.data_count_iphoneQuestions);
		if (db.data_count_iphone_ex_apps == 152
				&& db.data_count_IphoneExAppPages == 42
				&& db.data_count_iphoneQuestions == 1510) {
			//&& db.data_count_iphoneQuestions == 1510) {
			console.log("fill data complete");
			// Filling data complete
			clearInterval(timer_check_data_exist);
			// start app
			startup();
		}
	};

	function afterCreateTable() {
		console.log("After createTables ,now filling the data...");
		setTimeout(db.fillData(startup));
//		setTimeout(function(){timer_check_data_exist = setInterval(func_check_data_exist, 2000);},1000);
	}

	var func_check_table_exist = function() {
		
		console.log("func_check_table_exist() called.");
		
		if (db.exists_iphone_ex_apps == 1 || db.exists_IphoneExAppPages == 1
				|| db.exists_iphoneQuestions == 1) {
			// table not exists
			console.log("tables don't exist.");
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
	parser.getmoduleinfo(function(moduleinfo) {
		main_moduleinfo = moduleinfo;
		console.log("afert getmoduleinfo() called");
		//generateCategoryBar();
		SystemOrientation.refresh(function (){
			console.log("afert SystemOrientation.refresh() called");
		});
		initConstant();
	});
//	 ================================================
	 parser.getInformation(function(array) {
		 informations = array;
	 });

	bindEvent();
	$("#loading_login").hide();
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
			//initialization for scroll
			myInfoScroll = new iScroll('wrapper_info');
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
		destoryScroll();
		myDiscussionScroll = new iScroll('wrapper_discussion');
		fromQuestionView = false;
		//show loading
		$("#loading_discussion").html(util.getLoading());
		$("#loading_discussion").show();
		$("#discussion_back").attr("href","#main");
		$("#discussion_back").bind("click",function(){
			resetMainScroll();
		});
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
	$("#imgBookmark").click(function() {
		destoryScroll();
		mybookmarkScroll = new iScroll('wrapper_bookmark');
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
		if(fromQuestionView)
			current_post_type = 2;
		else
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
	current_post_type = 3;
	$("#reply_textarea").html("");
	//post(2);
}

var current_post_type;
var current_question_id;
var current_discussion_id;
var current_examResultInfo;
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
			}else{
				if(fromQuestionView){
					$("#discussionForQ").trigger("click");
					showDiscussionForQuestion();
				}else{
					$("#disc_no_text").trigger("click");
				}
					
			}
				
		});
	}else if(current_post_type==2){
		http.postForAGivenQuestion(user,current_question_id, message,function(data){
			$("#loading_post").hide();
			if(data==-1){
				$("#loading_post").hide();
				alert("time out ,please try later.");
				return;
			}else{
				if(fromQuestionView){
					$("#discussionForQ").trigger("click");
					showDiscussionForQuestion();
				}else{
					$("#disc_no_text").trigger("click");
				}
					
			}
				
		});
	}else if(current_post_type==3){
		http.postReply(user,current_discussion_id, message,function(data){
			$("#loading_post").hide();
			if(data==-1){
				$("#loading_post").hide();
				alert("time out ,please try later.");
				return;
			}else{
				if(fromQuestionView){
					$("#discussionForQ").trigger("click");
					showDiscussionForQuestion();
				}else{
					$("#disc_no_text").trigger("click");
				}
					
			}
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
		
		//console.log("updateBookmark() called..date.length="+data.length);
		var html='';
		for(var i=0;i<data.length;i++){
			var o = data[i];
			var title = o.title;
			var date = util.formateDate(o.date);
			var questionPosition = o.position;
			var exapp_id = o.exappid;
			html+='<li><a href="#qeustionview" onclick="bookmark_review('+exapp_id+','+questionPosition+');" style="color:black;text-decoration:none;"><table width=100%><tr><td width=50% align=center>'+title+':#'+(questionPosition+1)+'</td><td align=center>'+date+'</td></tr></table></a></li>';
		}
		$("#thelist_bookmark").html(html);
		$("#thelist_bookmark").trigger("create");
		
		setTimeout(function () {
			mybookmarkScroll.refresh();
		},100);
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
	destoryScroll();
	myStaScroll = new iScroll('wrapper_sta');
	
	parser = new XMLParser();
	var h;
	var first_section;
	var first_section_short;
	parser
			.getmoduleinfo(function(moduleinfo) {
				h = '<div id="category_bar_sta_container" data-corners="true" data-role="navbar"><ul>';
				var c = moduleinfo.examSection.length;
				for ( var i = 0; i < c; i++) {
					var vo = moduleinfo.examSection[i];
					var selected='';
					if(i==0){
						selected='class="ui-btn-active"';
						first_section = vo.secName;
						first_section_short = vo.secNameShort;
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
				
				//load when create
				refreshListSta(first_section_short,first_section,1);
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
			if(type!=2){
				if(score!=0){
					score = parseInt((score/o.numQuestion)*100)+"%";
				}
				else
					score = score+"%";
			}else{
				score = parseInt(parseFloat(score/o.numQuestion)*100)+"%";
			}
				
			
			
			html += '<li><table width=100%><tr><td width=25% align=center>'+name+'</td><td width=25% align=center>'+per+'</td><td width=25% align=center>'+totalTime+'</td><td width=25% align=center>'+score+'</td><tr><table></li>';
		}
		
		$("#thelist_sta").html(html);
		$("#thelist_sta").trigger("create");
		
		setTimeout(function () {
			if(myStaScroll)
			myStaScroll.refresh();
		});
	});
}


var recommendations;
var ListItemMyQuestions;
function refreshList(sectionShortName, sectionName) {
	console.log("refreshList() called");
	
	current_section = sectionName;
	current_section_short = sectionShortName; 
	
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
	var status='';
	
	if(data.progress!=''&&data.finish=="false"){
		progress = '<div><meter min="0" max="'+data.progressMax+'" value="'+data.progressCount+'" /></div>';
	}
	status='<div style="float:left;"><div style="font-size:10px;">'+data.progress+'</div>'+progress+'</div>';
	
	 
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
	},100);
	
}
function updateListView(){
	
	var html='<li><a href="#main" onclick="hideMenuList();resetMainScroll();" style="color:black;text-decoration:none;" ><table><tr><td width=40px; valign="middle"><img src="./css/images/back.png" /></td><td><strong>Return to Main Menu<strong></td><td>&nbsp;</td></tr></table></a></li>';
	if(ListItemMyQuestions&&ListItemMyQuestions.length>0){
		
		for(var i=0;i<ListItemMyQuestions.length;i++){ 
			var o = ListItemMyQuestions[i];
			html+='<li><a href="#problemIntro" onclick=showProblemSetInforContent('+i+'); style="color:black;text-decoration:none;" >'+createListItemMyQuestions(o)+'</a></li>';
		}
			
	}
	
	$("#thelist_problemIntroMenu").html(html);
	$("#thelist_problemIntroMenu").trigger("create");
	
	setTimeout(function () {
		if(myProblemIntroMenuScroll)
			myProblemIntroMenuScroll.refresh();
	},1000);
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
		if(myScroll)
			myScroll.refresh();
		else {
			myScroll = new iScroll('wrapper');
			myScroll.refresh();
		}
			
	});
}

function showPackageIntro(position){
	resetPackageIntroScroll();
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
var current_question_position;
var fromQuestionView=false;
var isQuestoinViewPage = false;

function showProblemSetInforContent(position){
	
		//initialization for scroll
		destoryScroll();
		if(!myProblemIntroScroll)
			myProblemIntroScroll = new iScroll('wrapper_problemIntro');
		if(!myProblemIntroMenuScroll)
			myProblemIntroMenuScroll = new iScroll('wrapper_problemIntroMenu');
	
		hideMenuList();
		$("#btnReview").hide();
		$("#btnResume").hide();
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
	    	var content = data.replaceAll('\\\\','');;
	    	
	    	$("#problemIntro_title").html(title);
			$("#thelist_problemSetinfo").html('<li>'+content+'</li>');
			$("#thelist_problemSetinfo").trigger("create");
			
			setTimeout(function () {
				if(myProblemIntroScroll)
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
//			    		$("#btnBegin").hide();
//			    		$("#btnReview").hide();
//						$("#btnResume").hide();showExam()
			    	}else if(info[0].finish=="false"){
			    		$("#btnBegin").show();
			    		$("#btnResume").show();
			    	}else if(info[0].finish=="true"){
			    		$("#btnBegin").show();
			    		$("#btnReview").show();
			    	}
			    	
			    	current_examResultInfo = info[0];
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
	hasInperson = false;
	current_showsolution = false;
	$("#questionview_done").hide();
	$("#questionview_menu").show();
	$("#choice_bg").show();
	$("#choicePanelContainer").show();

	resetQuestionViewScroll();
	/*
	destoryScroll();
	if(!myQuestionListScroll) myQuestionListScroll = new iScroll('wrapper_question_list',{ fixedScrollbar: false,bounce:false,vScrollbar: false });
	*/
	
	setTimeout(function(){
		current_question_position = 0;
		console.log("beginPractice() called");
		db.findQuestionsByExAppID(current_exAppId,function(questions){
			current_questions = questions;
			console.log("current_questions.length="+current_questions.length);
			//update the number indicator of questions 
			$("#questionview_number_indicator").html("1/"+current_questions.length);
			updateQuestionList();
			mChoicePanel.generateChoicePancel(current_questions[0],whenChoiceOnClick,function(){
				console.log("generateChoicePancel() successed");
			});
			//get examResultInfo
			db.getExamResultInfoNew(current_exAppId,current_exAppName,questions,function(info){
				current_examResultInfo = info;
				current_examResultInfo.startTime = util.currentTimeMillis;
				
				changePage(current_question_position);
			});
			
		});
		
		setTimeout(function () {
			myQuestionListScroll.refresh();
		},1000);
		
		//start count 
		start_timer_date = timer.start();
		
//		setTimeout(function () {
//			updateDiscussionNumber();
//		},1000);
	});
}
var current_showsolution=false;
function resume(callback){
	hasInperson = false;
	$("#questionview_done").hide();
	/*
	$("#questionview_menu").show();
	$("#choice_bg").show();
	$("#choicePanelContainer").show();*/
	resetQuestionViewScroll();
	current_showsolution = false;
	
	setTimeout(function(){
		
		current_question_position = 0;
		console.log("resume() called");
		db.findQuestionsByExAppID(current_exAppId,function(questions){
			current_questions = questions;
			console.log("current_questions.length="+current_questions.length);
			//update the number indicator of questions 
			$("#questionview_number_indicator").html(current_examResultInfo.progress+"/"+current_questions.length);
			updateQuestionList();
			mChoicePanel.generateChoicePancel(current_questions[0],whenChoiceOnClick,function(){
				console.log("generateChoicePancel() successed");
			});
			current_question_position = current_examResultInfo.progress-1;
			//current_examResultInfo.startTime = util.currentTimeMillis+(current_examResultInfo.endTime*1000);
			
			changePage(current_question_position);
			if(callback)
			callback();
		});
		
		setTimeout(function () {
			if(myQuestionListScroll)
				myQuestionListScroll.refresh();
		},1000);
		
		//start count 
		start_timer_date = timer.start();
		
	});
}

function resumeForExamReview(callback){
	
	setTimeout(function(){
		
		console.log("resumeForExamReview() called");
		db.findQuestionsByExAppID(current_exAppId,function(questions){
			current_questions = questions;
			console.log("current_questions.length="+current_questions.length);
			//update the number indicator of questions 
			$("#questionview_number_indicator").html((current_question_position+1)+"/"+current_questions.length);
			updateQuestionList();
			mChoicePanel.generateChoicePancel(current_questions[0],whenChoiceOnClick,function(){
				console.log("generateChoicePancel() successed");
			});
			//current_examResultInfo.startTime = util.currentTimeMillis+(current_examResultInfo.endTime*1000);
			
			changePage(current_question_position);
			if(callback)
			callback();
		});
		
		setTimeout(function () {
			if(myQuestionListScroll)
			myQuestionListScroll.refresh();
		},100);
		
		//start count 
		start_timer_date = timer.start();
		
	});
}

function exam_review(position){
	
	$("#questionview_done").show();
	$("#questionview_menu").hide();
	$("#choice_bg").hide();
	$("#choicePanelContainer").hide();
	$("#questionview_done").html('<a href="#exam" onclick="resetExamScroll()" ><img  src="./css/images/done_button.png" width=80px height="30px" /></a>');
	$("#questionview_done").trigger('create');
	
	current_question_position = position;
	resumeForExamReview(function(){
		showSolution();
		current_showsolution = true;
	});
	
}

function bookmark_review(exapp_id,position){
	resetQuestionViewScroll();
	
	$("#questionview_done").show();
	$("#questionview_menu").hide();
	$("#choice_bg").hide();
	$("#choicePanelContainer").hide();
	$("#imgPre").hide();
	$("#imgNxt").hide();
	
	
	$("#questionview_done").html('<a href="#bookmark" onclick="resetBookMarkScroll();" ><img  src="./css/images/done_button.png" width=80px height="30px" /></a>');
	$("#questionview_done").trigger('create');
	
	current_exAppId = exapp_id;
	current_question_position = position;
	
	db.GetExamResultInfoByExAppIDs(current_exAppId,function(rs){
		examResultInfo = rs[0];
		current_examResultInfo = examResultInfo;
		resumeForBookmarkReview(function(){
			setTimeout(function () {
				if(myQuestionListScroll){
					myQuestionListScroll.refresh();
					showSolution();
				}
			},1000);
			
			current_showsolution = true;
		});
	});
}

function resumeForBookmarkReview(callback){
	
	setTimeout(function(){
		
		console.log("resumeForBookmarkReview() called");
		db.findQuestionsByExAppID(current_exAppId,function(questions){
			current_questions = questions;
			console.log("current_questions.length="+current_questions.length);
			//update the number indicator of questions 
			$("#questionview_number_indicator").html((current_question_position+1)+"/"+current_questions.length);
			updateQuestionList();
			mChoicePanel.generateChoicePancel(current_questions[0],whenChoiceOnClick,function(){
				console.log("generateChoicePancel() successed");
			});
			
			changePage(current_question_position);
			if(callback)
			callback();
		});
		
		//start count 
		//start_timer_date = timer.start();
		
	});
}

function updateDiscussionNumber(){
	console.log("updateDiscussionNumber() called");
	http.findDiscussionsByQuestionid(current_questions[current_question_position].id,function(data){
		$("#discussion_num").html(data.length);
	});
}

function showDiscussionForQuestion(){
	console.log("showDiscussionForQuestion() called");
	fromQuestionView = true;
	//show loading
	$("#loading_discussion").html(util.getLoading());
	$("#loading_discussion").show();
	$("#discussion_back").attr("href","#qeustionview");
	$("#discussion_back").trigger("create");
	$("#discussion_back").bind("click",function(){
		resetQuestionViewScroll();
	});
	
	
	http.findDiscussionsByQuestionid(current_questions[current_question_position].id,function(data){
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
}

function checkBookMark(){
	
	db.findBookMarkByQuestionId(current_questions[current_question_position].id,function(rs){
		if(rs==1){
			$("#btnBookmark").attr("src","./css/images/bookmark2.png");
			$("#btnBookmark").trigger("create");
		}else{
			$("#btnBookmark").attr("src","./css/images/bookmark.png");
			$("#btnBookmark").trigger("create");
		}
	});
}

function updateQuestionList(){
	console.log("updateQuestionList() called");
	db.findBookMarkByExappId(current_exAppId,function(bookmarks){
		console.log("findBookMarkByExappId() called,and exAppId="+current_exAppId);
		console.log("bookmarks's length = "+bookmarks.length);
		var html = '<li style="background-color:black;color:white;">'+current_exAppName+'</li>';
		var f = false;
		for(var i=0;i<current_questions.length;i++){
			f = false;
			var bookmark='';
			for(var j=0;j<bookmarks.length;j++){
				if(current_questions[i].id==bookmarks[j].questionId){
					f = true;
					break;
				}
			}
			if(f)bookmark='<img src="./css/images/bookmark2.png"  style="height:30px;" />'; 

										html += '<li><a href="javascript:onclick=changePage('
									+ i
									+ ');" style="color:black;text-decoration:none;">'
									+'<table width=100% border=0><tr><td width=30% >'+bookmark+'</td><td align="left">'
									+ 'Question '
									+ (i + 1) + '</td></tr></table></a></li>';
		}
		
		$("#thelist_question_list").html(html);
		$("#thelist_question_list").trigger("create");
	});
	
	setTimeout(function () {
		if(myQuestionListScroll)
			myQuestionListScroll.refresh();
	},100);
}

function updateBookMark(){
	console.log("updateBookMark()...");
	if(util.contains($("#btnBookmark").attr("src"),"bookmark.png")){//mark the question and save it into database.
		console.log("save bookmark...");
		$("#btnBookmark").attr("src","./css/images/bookmark2.png");
		$("#btnBookmark").trigger("create");
//		ex_app_id, question_id,position,title,date, callback
		db.saveBookMark(current_exAppId,current_questions[current_question_position].id,current_question_position,current_exAppName,util.currentTimeMillis(),function(rs){
			//rs ==1 success 0 fail
		});
	}else{//delete from db
		console.log("delete bookmark...");
		$("#btnBookmark").attr("src","./css/images/bookmark.png");
		$("#btnBookmark").trigger("create");
		db.deleteBookMark(current_exAppId,current_questions[current_question_position].id,function(rs){
			//rs ==1 success 0 fail
		});
	}
}


function showQuestionList(){
	if($("#wrapper_question_list").is(":hidden")){
		$("#wrapper_question_list").show();
		updateQuestionList();
		setTimeout(function () {
			myQuestionListScroll.refresh();
		},100);
	}
	else
		$("#wrapper_question_list").hide();	
}

function showQuestionMenu(){
	if($("#wrapper_question_menu").is(":hidden"))
		$("#wrapper_question_menu").show();
	else
		$("#wrapper_question_menu").hide();	
}

function exitExam(){
	resetMainScroll();
	$("#wrapper_question_menu").hide();
	saveExamStatus(false,function(){
		//refresh list
		refreshList(current_section_short,current_section);
	});
	setTimeout(saveInperson);
}

function finishExam(){
	$("#wrapper_question_menu").hide();
	saveExamStatus(true,function(){
		showExam();
		//refresh list
		refreshList(current_section_short,current_section);
	});
	setTimeout(saveInperson);
}

function report(){
	alert("report");
}

function dismissQuestionMenu(){
	$("#wrapper_question_menu").hide();
}

var previous_choice=-1;
function whenChoiceOnClick(which,select){
	console.log("option is "+which+" onclick...");
	console.log("rememeber this choice"); 
	
	if(current_examResultInfo.QuestionExamStatus[current_question_position].correctChoice.length>1){
		if(select=="false"){
			current_examResultInfo.QuestionExamStatus[current_question_position].choice = (""+current_examResultInfo.QuestionExamStatus[current_question_position].choice).replaceAll(which, "");
			cancelchoice(parseInt(which)+"");
			if(current_examResultInfo.QuestionExamStatus[current_question_position].choice =="")current_examResultInfo.QuestionExamStatus[current_question_position].choice =-1;
		}else{
			if(current_examResultInfo.QuestionExamStatus[current_question_position].choice==-1)current_examResultInfo.QuestionExamStatus[current_question_position].choice="";
			choice(parseInt(which)+"");
			current_examResultInfo.QuestionExamStatus[current_question_position].choice =current_examResultInfo.QuestionExamStatus[current_question_position].choice+""+ which;
		}
	}else{
		current_examResultInfo.QuestionExamStatus[current_question_position].choice=parseInt(which);
		console.log("start show circle picture for choice");
		if(select=="true"){
			if(previous_choice!=-1){
				cancelchoice(previous_choice);
			}
			choice(parseInt(which)+"");
			//current_examResultInfo.QuestionExamStatus[current_question_position].choice;
			previous_choice = parseInt(which);
		}else{
			cancelchoice(parseInt(which)+"");
			current_examResultInfo.QuestionExamStatus[current_question_position].choice=-1;
		}
	}
}

var start_timer_date;

/**
 * when i=true,current_question_position will ++,false --.other numbers is the value of current_question_position 
 * @param i
 */
function changePage(i){
	hidePainterController();
	hasInperson = false;
	saveInperson();
	//rest
	reset_user_choice();
	
	$("#wrapper_question_list").hide();
	
	if(i=="true"){
		current_question_position = current_question_position+1;
	}else if(i=="false"){
		current_question_position = current_question_position-1;
	}else
		current_question_position = i;
	
	if(current_questions.length==0)return;
	if(current_question_position>current_questions.length-1)current_question_position=current_questions.length-1;
	else if(current_question_position<0)current_question_position=0;
	 
	//update the number indicator of questions 
	$("#questionview_number_indicator").html((current_question_position+1)+"/"+current_questions.length);
	
	//set correct choice
	current_examResultInfo.QuestionExamStatus[current_question_position].correctChoice = current_questions[current_question_position].solution;
	
	setTimeout(function () {
		checkBookMark();
	});
	
	setTimeout(function () {
		updateDiscussionNumber();
	});
	
	//load content
	loadContent(current_showsolution);
	
	//set progress
	if(current_examResultInfo.progress<current_question_position+1)
		current_examResultInfo.progress = current_question_position+1;
	
	//reset choice panel
	mChoicePanel.generateChoicePancel(current_questions[current_question_position],whenChoiceOnClick,function(){
		console.log("generateChoicePancel() successed");
	});
	
	//set privious selection
	if(parseInt(current_examResultInfo.QuestionExamStatus[current_question_position].choice)!=-1)
		mChoicePanel.setChoice(parseInt(current_examResultInfo.QuestionExamStatus[current_question_position].choice)+"");
	
	//change button in pop
	if(current_question_position==(current_questions.length-1)){
		$("#btnPopFinish").show();
		$("#btnPopNxt").hide();
	}else{
		$("#btnPopFinish").hide();
		$("#btnPopNxt").show();
	}
	
	//load video
	loadVideo();
	//load inperson
	
	db.findInpersonByQuestionId(current_questions[current_question_position].id,function(inperson){
		setInperson(inperson);
	});
	
}

var current_video_content;
var video_is_playing=false;
function loadVideo(){

	$("#video_container").show();
	var video1 = current_questions[current_question_position].video1.replaceAll('\\\\','');
	var video2 = current_questions[current_question_position].video2.replaceAll('\\\\','');
	if(video1&&video1.length>10){
		$("#video1").show();
		$("#videoReplay").show();
	}else{
		$("#video1").hide();
		$("#videoReplay").hide();
	}
	if(video2&&video2.length>10){
		$("#video2").show();
	}else
		$("#video2").hide();
	
	$("#video1").bind("click",function(){current_video_content=video1;setVideoContent(video1);video_is_playing=true;});
	$("#video2").bind("click",function(){current_video_content=video2;setVideoContent(video2);video_is_playing=true;});
	
	
	$("#videoReplay").bind("click",function(){
		if(video_is_playing==false)
			$("#popupVideo").popup("open");
		setVideoContent(current_video_content);});
	
	
	$("#popupVideo").bind({
		   popupafterclose: function(event, ui) {
			   video_is_playing=false;
			   $("#popContent").html("");
		   }
	});
}

function setVideoContent(content){
	
	$("#popContent").html(content);
}

/**
 * 
 * @param showSolution true|false
 */
function loadContent(isShowSolution){
	console.log("loadContent() called");
	
	var question =  current_questions[current_question_position];
	console.log(question.id);
	  
	var solution = current_questions[current_question_position].solution;
	
	var s = "[";
	for(var i=0;i<solution.length;i++ ){
		if(i==solution.length-1)
			s+=util.convertChoiceToIndex(solution.charAt(i));
		else
			s+=util.convertChoiceToIndex(solution.charAt(i))+",";
	}
	s+="]";
	
	freshPassageStemChoices(question.textBlock1A,question.questionStemA,question.getAnswers(),util.strToJson(s),question.solutionText);
	
	//set choice
	var c = parseInt(current_examResultInfo.QuestionExamStatus[current_question_position].choice)+"";
	
	if(c!=-1&&c!=""){
		var s="";
		for(var i=0;i<c.length;i++ ){
			whenChoiceOnClick(c.charAt(i),"true");
			//choice(c.charAt(i));
		}
	}
	
	//set solution
	if(isShowSolution&&isShowSolution==true){
		showSolution();
	}
	
	//refresh scroll
	window.frames["i_workspace"].refreshList();
}

function reset_user_choice(){
	console.log("reset_user_choice() called");
	$( "#popupConfirm" ).popup( "close" );
	window.frames["i_workspace"].reset_user_choice();
}

function showSolution(){
	console.log("showSolution() called");
	$( "#popupConfirm" ).popup( "close" );
	window.frames["i_workspace"].showSolution();
	//refresh scroll
	window.frames["i_workspace"].refreshList();
}

function choice(option){
	window.frames["i_workspace"].choice(option);
}

function cancelchoice(option){
	window.frames["i_workspace"].cancelchoice(option);
}

function freshPassageHtml(content){
	window.frames["i_workspace"].freshPassageHtml(content);
	//refresh scroll
	window.frames["i_workspace"].refreshList();
}


function freshPassageStemChoices(passage,stem,answers,solution,solutionText){
	
	//console.log("freshPassageStemChoices() called,and parames=[passage="+passage+"],stem=["+stem+"],answers=["+answers+"],solution=["+solution+"],solutionText="+solutionText+"]");
	//var json_answers = "[{text:'Analysis of fossilized pollen is a useful means  of supplementing and in some cases correcting  other sources of information regarding changes  in the Irish landscape.',tip:'<b>Correct:</b> Use the \"Reduce\" button to see the sections of the passage that support this answer choice. <br><br> Note how closely this choice tracks the author\\'s thesis.'},{text:'Analyses of historical documents, together with  pollen evidence, have led to the revision of  some previously accepted hypotheses regarding  changes in the Irish landscape.',tip:'<b>Wrong: Not supported by the passage.</b><br> The passage does not discuss using pollen analysis to make determinations about changes in the landscape.'},{text:'Analysis of fossilized pollen has proven to be a  valuable tool in the identification of ancient  plant species.',tip:'<b>Wrong: Not supported by the passage.</b><br>'},{text:'Analysis of fossilized pollen has provided new  evidence that the cultivation of such crops as  cereal grains, flax, and madder had a  significant impact on the landscape of Ireland.',tip:'<b>Wrong: Not supported by the passage.</b><br>'},{text:'While pollen evidence can sometimes  supplement other sources of historical  information, its applicability is severely  limited, since it cannot be used to identify  plant species.',tip:'<b>Wrong: Not supported by the passage.</b><br> The passage doesn\\'t say that the use of pollen analysis is \"severely limited.\"'}]";
	answers = util.strToJson(answers);
	
	//invoke js method in iframe
	window.frames["i_workspace"].freshPassageStemChoices(false,passage.replaceAll("\'", "\\\\'"),stem.replaceAll("\'", "\\\\'"),answers,solution,solutionText.replaceAll("\'", "\\\\'"));
}

/**
 * keep exam status into DB when Finish or exit exam action is triggered.
 */
function saveExamStatus(finish,callback){
	
	console.log("saveExamStatus() called. finish="+finish);
	var totalTime = timer.stop();
	//id,section,exAppID,exAppName,score,finish,progress,startTime,endTime,questionCount,QuestionExamStatus
	current_examResultInfo.endTime = totalTime;
	current_examResultInfo.startTime = start_timer_date;
//	if(current_examResultInfo.progress<current_question_position+1)
//		current_examResultInfo.progress = current_question_position+1;
	
	var choiceCount = 0;
	current_examResultInfo.finish = finish;
	
	var c = 0;
	for(var i=0;i<current_examResultInfo.QuestionExamStatus.length;i++){
		var o = current_examResultInfo.QuestionExamStatus[i];
		//id,exAppID,questionId,choice,correctChoice,mark
		
		if(util.convertChoiceToStr(o.choice)==o.correctChoice)c=c+1;
		if(o.choice!=-1)choiceCount=choiceCount+1;
	}
	
	if(choiceCount>current_examResultInfo.progress)current_examResultInfo.progress =choiceCount;
	current_examResultInfo.score = c;
	current_examResultInfo.questionCount = current_questions.length;
	current_examResultInfo.section = current_section;
	
	//save into db
	db.saveExamResultInfo(current_examResultInfo,function(rs){
		callback();
		if(finish){};
		//redirect to exam review page. 
	});
}
function showExam(){
	console.log("showExam() called.");
	
	resetExamScroll();
	
	$("#exam_title").html(current_exAppName);
	//get exam_result_info
	db.GetExamResultInfoByExAppIDs(current_exAppId,function(rs){
		examResultInfo = rs[0];
		current_examResultInfo = examResultInfo;
		console.log("GetExamResultInfoByExAppIDs() called. exappid="+current_exAppId);
		//id,section,exAppID,exAppName,score,finish,progress,startTime,endTime,questionCount,QuestionExamStatus
		$("#exam_score").html(examResultInfo.score+"/"+parseInt(examResultInfo.questionCount));
		$("#exam_totalTime").html(util.getTime(parseInt(examResultInfo.endTime)));
		$("#exam_per").html(parseInt(util.getTime(parseInt(examResultInfo.endTime)/examResultInfo.questionCount)));
		
		//generate list
		var html = '';
		for(var i=0;i<examResultInfo.QuestionExamStatus.length;i++){
			var o = examResultInfo.QuestionExamStatus[i];
			//id,exAppID,questionId,choice,correctChoice,mark
			var choice = parseInt(o.choice)+"";
			
			if(choice!="-1"&&choice.length>1){
				var _c ="";
				for(var i=0;i<choice.length;i++){
					if(choice.charAt(i)==0)_c=_c+'a';
					else if(choice.charAt(i)==1)_c=_c+'b';
					else if(choice.charAt(i)==2)_c=_c+'c';
					else if(choice.charAt(i)==3)_c=_c+'d';
					else if(choice.charAt(i)==4)_c=_c+'e';
					else if(choice.charAt(i)==5)_c=_c+'f';
					
					if(i!=choice.length-1)_c=_c+',';
				}
				if(_c!="")choice=_c;
				
			}else{
				if(choice=="-1")choice="--";
				else if(choice==0)choice='a';
				else if(choice==1)choice='b';
				else if(choice==2)choice='c'; 
				else if(choice==3)choice='d';
				else if(choice==4)choice='e';
				else if(choice==5)choice='f';
			}
				
			var correct = o.correctChoice;
			if(correct==choice)
				html +='<li><a href="#qeustionview" style="color:black;text-decoration:none;" onclick="exam_review('+i+')" ><table width=100% border=0><tr><td width=40px><img src="./css/images/select.png" /></td><td>'+(i+1)+'</td><td>'+choice+'</td><td>('+correct+')</td><td><img src="./css/images/arrow.png" /></td></tr></table></a></li>';
			else
				html +='<li><a href="#qeustionview" style="color:black;text-decoration:none;" onclick="exam_review('+i+')"><table width=100% border=0><tr><td width=40px><img src="./css/images/delete.png" /></td><td>'+(i+1)+'</td><td>'+choice+'</td><td>('+correct+')</td><td><img src="./css/images/arrow.png" /></td></tr></table></a></li>';
		}
		
		$("#thelist_exam").html(html);
		$("#thelist_exam").trigger("create");
		setTimeout(function () {
			myExamScroll.refresh();
		},100);
	});
}

function showExamIntro(){
	console.log("showExamIntro() called.");
	db.findProblemSetIntroductionForExamResultByExAppId(current_exAppId,function(data){
		
		$("#thelist_exam_intro").html('<li>'+data+'</li>');
		$("#thelist_exam_intro").trigger("create");
		setTimeout(function(){
			myExamIntroScroll.refresh();
		});
	});
}
var current_hint_index = -1;
function onHintClick(hintCount){
	console.log("onHintClick() called.current_hint_index="+current_hint_index+";hintCount="+hintCount);
	if(current_hint_index<hintCount){
		if(current_hint_index==1){  
			freshPassageHtml(current_questions[current_question_position].textBlock1B.replaceAll("\'", "\\\\'"));	
		}else if(current_hint_index==2){
			freshPassageHtml(current_questions[current_question_position].textBlock1C.replaceAll("\'", "\\\\'"));
		}
		current_hint_index++;
		if(current_hint_index==1)
			$("#btnHint").attr("src","./css/images/hint.png");
		else
			$("#btnHint").attr("src","./css/images/hint"+current_hint_index+".png");
		
	}else if(current_hint_index==hintCount){
		if(current_hint_index==1){
			freshPassageHtml(current_questions[current_question_position].textBlock1B.replaceAll("\'", "\\\\'"));
		}else if(current_hint_index==2){
			freshPassageHtml(current_questions[current_question_position].textBlock1C.replaceAll("\'", "\\\\'"));
		}else if(current_hint_index==3)
			freshPassageHtml(current_questions[current_question_position].textBlock1D.replaceAll("\'", "\\\\'"));
		
		current_hint_index++;
		
		$("#btnHint").attr("src","./css/images/passage.png");
	}else if(current_hint_index>hintCount){
		current_hint_index=1;
		$("#btnHint").attr("src","./css/images/hint.png");
		freshPassageHtml(current_questions[current_question_position].textBlock1A.replaceAll("\'", "\\\\'"));
	}
	
	$("#btnHint").trigger("create");
}

function showNextQuestion(){
	changePage('true');
	$( "#popupConfirm" ).popup( "close" );
}

function showPainterController(){
	
	$("#painter_controller").hide();
	$("#painter_controller_up").show();
	$("#painter_controller_content").show();
	//hide video container if it is visible
	$("#video_container").hide();
	
	//hide the choice panel
	$("#choice_bg").hide();
	$("#choicePanelContainer").hide();
	window.frames["i_workspace"].showCanvas();
	penOn(1);
	//draw if exits before
	updateCanvasReplayIcnonStatus();
}

function updateCanvasReplayIcnonStatus(){
	if(hasInperson==true){
		$("#canvas_replay_btn_container").show();
		//window.frames["i_workspace"].replayDrawing(0,function(){});
		window.frames["i_workspace"].stopReplay();
	}
	else
		$("#canvas_replay_btn_container").hide();
}

function shoReplayIcon(){
	$("#canvas_replay_btn_container").show();
}

function hidePainterController(){
	$("#canvas_replay_btn_container").hide();
	$("#video_container").show();
	$("#painter_controller").show();
	$("#painter_controller_content").hide();
	$("#painter_controller_up").hide();
	window.frames["i_workspace"].hideCanvas();
	$("#choice_bg").show();
	$("#choicePanelContainer").show();
}

function penOn(on){
	console.log("penOn() called.");
	if(on&&on==1){
		resetDrawerToolsColor();
		$("#a_pen_settings").html('<img src="./css/images/draw_on.png" width=40 height=40 />');
		$("#a_pen_settings").trigger("create");
		window.frames["i_workspace"].penOn(false);
	}else{
		if (util.contains(("" + $("#a_pen_settings").html()), "off", false)) {
			resetDrawerToolsColor();
			$("#a_pen_settings").html('<img src="./css/images/draw_on.png" width=40 height=40 />');
			$("#a_pen_settings").trigger("create");
			window.frames["i_workspace"].penOn(false);
		} else {
			window.frames["i_workspace"].penOn(true);
		}
	}
		
}

function putText(){
	resetDrawerToolsColor();
	if (util.contains(("" + $("#a_text_settings").html()), "off", false)) {
		$("#a_text_settings").html('<img src="./css/images/text_on.png" width=40 height=40 />');
		$("#a_text_settings").trigger("create");
	}
	window.frames["i_workspace"].putText();
}

function eraserOn() {
	console.log("eraserOn() called.");
	
	if (util.contains(("" + $("#a_eraser_settings").html()), "off", false)) {
		resetDrawerToolsColor();
		$("#a_eraser_settings")
				.html('<img src="./css/images/eraser_on.png" width=40 height=40 />');
		$("#a_eraser_settings").trigger("create");
		window.frames["i_workspace"].eraserOn(false);
	} else {
		window.frames["i_workspace"].eraserOn(true);
	}
}

function clearOn() {
	console.log("clearOn() called.");
	resetDrawerToolsColor();
	window.frames["i_workspace"].clear();
}

function undo() {
	console.log("undo() called.");
	resetDrawerToolsColor();
	window.frames["i_workspace"].undo();
}

function redo() {
	console.log("redo() called.");
	resetDrawerToolsColor();
	window.frames["i_workspace"].redo();
}

function resetDrawerToolsColor(){
	window.frames["i_workspace"].cancelCanTxt();
	
	$("#a_pen_settings").html('<img  src="./css/images/draw_off.png" width=40 height=40 />');
	$("#a_pen_settings").trigger('create');
	
	$("#a_text_settings").html('<img  src="./css/images/text_off.png" width=40 height=40 />');
	$("#a_text_settings").trigger('create');
	
	$("#a_eraser_settings").html('<img  src="./css/images/eraser_off.png" width=40 height=40  />');
	$("#a_eraser_settings").trigger('create');
}

function switchMode(){
	console.log("switchMode() called.");
	resetDrawerToolsColor();
	
	if (!util.contains(("" + $("#a_mode").html()), "off", false)) {
		$("#a_mode").html('<img src="./css/images/penmodeoff.png" width=40 height=40 />');
		$("#a_mode").trigger("create");
		window.frames["i_workspace"].switchPenOn();
		
	} else {
		$("#a_mode").html('<img src="./css/images/penmode.png" width=40 height=40 />');
		$("#a_mode").trigger("create");
		window.frames["i_workspace"].penOff();
		
	}
	
}

function destoryScroll(){
	if(myInfoScroll){
		myInfoScroll.destroy();
		myInfoScroll = null;
	}
	
	if(myScroll){
		myScroll.destroy();
		myScroll = null;	
	}
	
	if(myProblemIntroScroll){
		myProblemIntroScroll.destroy();
		myProblemIntroScroll = null;	
	}

	if(myProblemIntroMenuScroll){
		myProblemIntroMenuScroll.destroy();
		myProblemIntroMenuScroll = null;	
	}
	
	if(myPackageIntroScroll){
		myPackageIntroScroll.destroy();
		myPackageIntroScroll = null;
	}
	
	if(mybookmarkScroll){
		mybookmarkScroll.destroy();
		mybookmarkScroll = null;	
	}
	
	if(myStaScroll){
		myStaScroll.destroy();
		myStaScroll = null;	
	}
	
	if(myDiscussionScroll){
		myDiscussionScroll.destroy();
		myDiscussionScroll = null;	
	}
	
	if(myQuestionMenuScroll){
		myQuestionMenuScroll.destroy();
		myQuestionMenuScroll = null;	
	}
	
	if(myQuestionListScroll){
		myQuestionListScroll.destroy();
		myQuestionListScroll = null;
	}
	
	if(myExamScroll){
		myExamScroll.destroy();
		myExamScroll = null;	
	}
	
	if(myExamIntroScroll){
		myExamIntroScroll.destroy();
		myExamIntroScroll = null;
	}
	
}

function resetBookMarkScroll(){
	destoryScroll();
	mybookmarkScroll = new iScroll('wrapper_bookmark');
}

function resetMainScroll(){
	destoryScroll();
	/*myScroll = new iScroll('wrapper');*/
	fireRefreshList();
	setTimeout(function () {
		myScroll.refresh();
	},500);
}
function resetQuestionViewScroll(){
	console.debug("resetQuestionViewScroll() called.");
	$("#questionview_menu").show();
	$("#choice_bg").show();
	$("#choicePanelContainer").show();
	$("#imgPre").show();
	$("#imgNxt").show();
	destoryScroll();
	myQuestionMenuScroll = new iScroll('wrapper_question_menu', { fixedScrollbar: false,bounce:false});
	myQuestionListScroll = new iScroll('wrapper_question_list',{ fixedScrollbar: false,bounce:false,vScrollbar: false });
}
function resetExamScroll(){
	destoryScroll();
	myExamScroll = new iScroll('wrapper_exam', { fixedScrollbar: false,bounce:false});
	myExamIntroScroll = new iScroll('wrapper_exam_intro', { fixedScrollbar: false,bounce:false});
}

function resetPackageIntroScroll(){
	destoryScroll();
	myPackageIntroScroll = new iScroll('wrapper_package_intro');
}

function resetReplayBtn(){
	$("#inperson_btn_2").hide();
	$("#inperson_btn_play").show();
	
	$("#painter_controller").show();
	$("#painter_controller_up").show();
	$("#painter_controller_content").show();
}

function replayDrawing(interval){
	hidePainterController1();
	$("#inperson_btn_2").show();
	$("#inperson_btn_play").hide();
	if(!interval)
		window.frames["i_workspace"].replayDrawing(1000,resetReplayBtn);
	else
		window.frames["i_workspace"].replayDrawing(interval,resetReplayBtn);
}

function pauseDrawing(){
	$("#inperson_pause_container").html('<img  src="./css/images/inperson_inner_pause.png" onclick="resumeDrawing()" />');
	$("#inperson_pause_container").trigger('create');
	window.frames["i_workspace"].pauseDrawing();
}

function resumeDrawing(){
	$("#inperson_pause_container").html('<img  src="./css/images/inperson_pause1.png" onclick="pauseDrawing()" />');
	$("#inperson_pause_container").trigger('create');
	window.frames["i_workspace"].resumeReplay(resetReplayBtn);
}

function stopDrawing(){
	window.frames["i_workspace"].stopReplay();
	resetReplayBtn();
}

function hidePainterController1(){
	$("#painter_controller").hide();
	$("#painter_controller_up").hide();
	$("#painter_controller_content").hide();
}
var hasInperson = false;
function setInperson(inperson){
	window.frames["i_workspace"].clearInperson();
	console.log("setInperson() called.");
	if(inperson&&inperson._xml&&inperson._xml.length>60){
		window.frames["i_workspace"].setInperson(inperson);
		hasInperson = true;
	}else{
		hasInperson = false;
	}
}

function saveInperson(){
	var inperson = window.frames["i_workspace"].getInpersonVO();
	
	if(inperson&&inperson.xml&&inperson.xml.length>60)
		db.insertInperson(current_exAppId,current_questions[current_question_position].id,inperson.data,inperson.xml,util.currentTimeMillis(),function(){
			
		});
}

function getInperson(){
	db.findInpersonByQuestionId(current_questions[current_question_position].id,function(inperson){
		//exAppID questionId _base64 _xml date
	});
}


