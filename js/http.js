var http = {};
http = new function() {
	var self = this;

	/**
	 * examType exam type: LSAT, GRE,GMAT,SAT return Array<DiscussionVO>
	 */
	self.findDiscussionsByExamType = function(callback) {

		var server_url = Constant.GET_SERVER_URL_DISCUSSIONS_BY_EXAM;
		$.ajax({
			url : server_url,
			data : {
				abc : new Date()
			},
			dataType : "json",
			timeout : Constant.ajax_timeout,
			success : function(data) {
				var rs = new Array();
				var discussions = data.discussions;
				for ( var i = 0; i < discussions.length; i++) {
					var o = discussions[i];
					rs.push(new self.DiscussionVO(o.id, o.discussion_id,
							o.user_id, o.subject, o.message, o.date,
							o.replied_to, o.pseudonym, o.cid, o.profile,
							o.profile_pic, o.uname, o.member, o.attach_image,
							o.question_id));
				}
				callback(rs);
			},
			error : function(){
				callback(-1);
			}
		});
	};
	
	self.publicUser;
	
	self.User = function(userName, password, profile) {
		var self = this;
		this.userName = userName;
		this.password = password;
		this.profile = profile;
		return self;
	};

	self.postNew = function(user, message, callback) {
		var server_url = Constant.GET_SERVER_URL_POST_A_NEW_DISCUSSION;
		var subject = message;
		if (message.length > 32)
			subject = message.substring(0, 32);
		$.ajax({
			url : server_url,
			type : "POST",
			// fileElementId : 'pic',
			timeout : Constant.ajax_timeout,
			data : {
				"login_user" : user.userName,
				"login_pass" : user.password,
				"login" : "login",
				"step" : "2",
				"cod" : "123",
				"type" : "1",
				"play_time" : "0",
				"message" : message,
				"subject" : subject	
			},
			// dataType : "json",
			success : function(data) {
				$("#div_test").text(data);
				//callback("1");
				
			},
			error : function(obj, message) {
				callback(-1);
			}
		});

	};
	
	self.postForAGivenQuestion = function(user,questionId, message, callback) {
		var server_url = (Constant.GET_SERVER_URL_POST_FOR_A_GIVEN_QUESTION+questionId).replace("$",questionId);
		var subject = message;
		if (message.length > 32)
			subject = message.substring(0, 32);
		$.ajax({
			url : server_url,
			type : "POST",
			// fileElementId : 'pic',
			timeout : Constant.ajax_timeout,
			data : {
				"login_user" : user.userName,
				"login_pass" : user.password,
				"login" : "login",
				"step" : "2",
				"cod" : "123",
				"type" : "1",
				"play_time" : "0",
				"message" : message,
				"subject" : subject	
			},
			// dataType : "json",
			success : function(data) {
				callback("1");
			},
			error : function(obj, message) {
				callback(-1);
			}
		});

	};
	//
	self.postReply = function(user,discussionId, message, callback) {
		var server_url = (Constant.Constant.GET_SERVER_URL_POST_REPLY+discussionId);
		var subject = message;
		if (message.length > 32)
			subject = message.substring(0, 32);
		$.ajax({
			url : server_url,
			type : "POST",
			// fileElementId : 'pic',
			timeout : Constant.ajax_timeout,
			data : {
				"login_user" : user.userName,
				"login_pass" : user.password,
				"login" : "login",
				"step" : "2",
				"cod" : "123",
				"type" : "1",
				"play_time" : "0",
				"message" : message,
				"subject" : subject	
			},
			// dataType : "json",
			success : function(data) {
				callback("1");
			},
			error : function(obj, message) {
				callback(-1);
			}
		});

	};

	self.findDiscussionsByQuestionid = function(questionId, callback) {
		var server_url = Constant.GET_SERVER_URL_DISCUSSIONS_BY_QUESTION_ID
				+ questionId;
		$.ajax({
			url : server_url,
			dataType : "json",
			timeout : Constant.ajax_timeout,
			success : function(data) {
				var rs = new Array();
				var discussions = data.discussions;
				for ( var i = 0; i < discussions.length; i++) {
					var o = discussions[i];
					rs.push(new self.DiscussionVO(o.id, o.discussion_id,
							o.user_id, o.subject, o.message, o.date,
							o.replied_to, o.pseudonym, o.cid, o.profile,
							o.profile_pic, o.uname, o.member, o.attach_image,
							o.question_id));
				}
				callback(rs);
			},
			error : function(obj, message) {
				callback(-1);
			}
		});
	};

	self.getUserInfo = function(userId, callback) {
		var server_url = Constant.GET_SERVER_URL_USER_INFO + userId;
		$.ajax({
			url : server_url,
			dataType : "json",
			timeout : Constant.ajax_timeout,
			success : function(data) {
				var uname = '';
				var extra = '';
				var location = '';
				var aboutme = '';
				var post = '';
				var imgAttach = '';
				var head = '';
				if (data) {
					uname = data.uname;
					aboutme = data.about;
					post = data.n_post;
				}
				var rs = new self.DiscussionUserVO(userId, uname, extra,
						location, aboutme, post, imgAttach, head);

				callback(rs);
			},
			error : function(obj, message) {
				callback(-1);
			}
		});
	};
	
	/**
	 * return entity(http.User) if success otherwise it would be -1
	 */
	self.login = function(username,password,callback){
		var server_url = Constant.GET_SERVER_URL_USER_LOGIN;
		
		$.ajax({
			url : server_url,
			type: "POST",
			dataType : "json",
			timeout : Constant.ajax_timeout,
			data : {"login_user":username,"login_pass":password,"login":"login"},
			success : function(data) {
				var login = data.login;
				if(login=="Yes"){
					
					self.publicUser = new self.User(username, password, data.profile);
					
//					self.User = new self.User(username, password, data.profile);
					callback(self.publicUser);
				}else
					callback(-1);	
				
			},
			error : function(obj, message) {
				callback(-1);
			}
		});
	};
	
	/**
	 * @param exam now it is empty 
	 */
	self.register = function(fname,lname,email,pass,r_pass,exam,callback){
		var server_url = Constant.GET_SERVER_URL_USER_REGISTER;
		
		$.ajax({
			url : server_url,
			type: "POST",
			dataType : "json",
			timeout : Constant.ajax_timeout,
			data : {"fname":fname,"lname":lname,"email":email,"pass":pass,"r_pass":r_pass,"exam":exam},
			success : function(data) {
				var register = data.register;
				if(register=="Yes"){
					//process login...
					self.login(email,pass,function(data){
						callback(data);
					});
//					http.User = new self.User(username, password, data.profile);
//					callback(self.User);
				}else
					callback(data.error);	
				
			},
			error : function(obj, message) {
				callback(-1);
			}
		});
	};

	self.DiscussionUserVO = function(userID, uname, extra, location, aboutme,
			post, imgAttach, head) {
		this.userID = userID;
		this.uname = uname;
		this.extra = extra;
		this.location = location;
		this.aboutme = aboutme;
		this.post = post;
		this.imgAttach = imgAttach;
		this.head = head;
	};

	self.DiscussionVO = function(id, discusstionId, userId, subject, message,
			date, repliedTo, pseudonym, cid, profile, profilePic, uname,
			member, attachIamge, questionId) {
		this.id = id;
		this.discusstionId = discusstionId;
		this.userId = userId;
		this.subject = subject;
		this.message = message;
		this.date = date;
		this.repliedTo = repliedTo;
		this.pseudonym = pseudonym;
		this.cid = cid;
		this.profile = profile;
		this.profilePic = profilePic;
		this.uname = uname;
		this.member = member;
		this.attachIamge = attachIamge;
		this.questionId = questionId;

	};
	
	return self;
}