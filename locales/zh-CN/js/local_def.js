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
	map.put("Login_to_ArcadiaPrep_com", "登录到 ArcadiaPrep.com");
	map.put("Password", "密码");
	map.put("need_login", "没有账号?");
	map.put("Register", "注册");
	map.put("nbsp_Register", "&nbsp;Register");
	map.put("Set_Photo", "Set Photo");
	map.put("Cancel", "Cancel");
	map.put("Select_from_gallery", "Select from gallery");
	map.put("take_photo", "Take photo");
	map.put("network_alert", "Network Alert");
	map.put("take_photo", "Take photo");
	map.put("Back", "Back");
	map.put("Information", "Information");
	map.put("Menu", "Menu");
	map.put("Review", "Review");
	map.put("Resume", "Resume");
	map.put("Begin_Practice_nbsp_nbsp", "Begin Practice&nbsp;&nbsp;");
	map.put("MarketPlace_nbsp_nbsp", "Market Place&nbsp;&nbsp;");
	map.put("Buy_Now", "Buy Now");
	map.put("Bookmarks", "Bookmarks");
	map.put("By_Date", "By Date");
	map.put("By_Sets", "By Sets");
	map.put("Last", "Last");
	map.put("Average", "Average");
	map.put("Best", "Best");
	map.put("Discussions_nbsp", "Discussions&nbsp;&nbsp;&nbsp;&nbsp;");
	map.put("post_your_comment_here", "Post Your comment here");
	map.put("Done", "Done");
	map.put("Discussions", "Discussions");
	map.put("head", "head");
	map.put("Location", "Location:");
	map.put("About_me", "About me:");
	map.put("Post", "Post");
	map.put("Comment", "Comment:");
	map.put("Attachment", "Attachment");
	map.put("Exam_option", "Exam option");
	map.put("Exit_the_Exam", "Exit the Exam");
	map.put("Finish&Review", "Finish&Review the Exam");
	map.put("Finish_this_Question", "Finish this Question");
	map.put("Finish_&_Review", "Finish & Review");
	map.put("Goto_the_Next_Question", "Goto the Next Question");
	map.put("Hint", "Hint");
	map.put("Show_Correct_Answers", "Show Correct Answers");
	map.put("Confirm", "Confirm");
	map.put("put_what_you_want", "put what you want&nbsp;&nbsp;&nbsp;&nbsp;");
	map.put("setting", "setting");
	map.put("Pen_Settings", "Pen Settings");
	map.put("Text_Settings", "Text Settings");
	map.put("Eraser_Settings", "Eraser Settings");
	map.put("Score", "Score:");
	map.put("Total_Time", "Total Time:");
	map.put("Average_Time_Per_Question", "Average Time Per Question:");
	map.put("NO.", "NO.");
	map.put("Your_Choice", "Your Choice");
	map.put("Correct_Answer", "Correct Answer");
	map.put("continue", "continue");
	map.put("where_to_go_from_here", "where to go from here");
	map.put("logout", "Logout");
	map.put("Invalid_Log_in","Invalid Log-in or Password.");
	map.put("time_out", "time out ,please try later.");
	map.put("Please_input_something", "Please input something.");
	map.put("please_try_later", "please try later");
	map.put("Return_to_Main_Menu", "Return to Main Menu");
	
	
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
