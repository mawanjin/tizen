var SystemOrientation = {};
SystemOrientation = new function() {
	var self = this;
	self.orientation=0;
	
	self.setOrientation = function() {
		var orientation = window.orientation;
		self.orientation = orientation;
		switch (orientation) {
		case 0:
			self.refresh();
			//generateCategoryBar();
			// portrait mode
			// document.getElementById('sl_style').href='css/sl_portrait.css';
			// document.getElementById('editlist_view_style').href='css/editlist_view_portrait.css';
			// document.getElementById('edititem_view_style').href='css/edititem_view_portrait.css';
			// document.getElementById('favorites_view_style').href='css/addfromfavorites_view_portrait.css';
			// document.getElementById('photofullscreen_view_style').href='css/photofullscreen_view_portrait.css';
			// document.getElementById('shadow').style.height = '1280px';
			// document.getElementById('shadow').style.width = '720px';
			break;

		case 90: // landscape mode, screen turned to the left
		case -90: // landscape mode, screen turned to the right
			self.refresh();
			//generateCategoryBar();
			// document.getElementById('sl_style').href='css/sl_landscape.css';
			// document.getElementById('editlist_view_style').href='css/editlist_view_landscape.css';
			// document.getElementById('edititem_view_style').href='css/edititem_view_landscape.css';
			// document.getElementById('favorites_view_style').href='css/addfromfavorites_view_landscape.css';
			// document.getElementById('photofullscreen_view_style').href='css/photofullscreen_view_landscape.css';
			// document.getElementById('shadow').style.height = '720px';
			// document.getElementById('shadow').style.width = '1280px';
			break;
		}

	};

	self.refresh = function(callback){
		
		if(self.orientation==0){//portrait mode
			if($("#main_css")){
				$("#main_css").attr("href","./css/style-portrait.css");
			}
			if($("#listview_css")){
				$("#listview_css").attr("href","./css/listview-portrait.css");
			}
			
			if($("#scroll_css")){
				$("#scroll_css").attr("href","./css/scroll-portrait.css");
			}
			if($("#loading_css")){
				$("#loading_css").attr("href","./css/loading-portrait.css");
			}
			if($("#reply_textarea"))
				$("#reply_textarea").attr("rows",20);
			
		}else{
			if($("#main_css"))
				$("#main_css").attr("href","./css/style.css");
			if($("#listview_css")){
				$("#listview_css").attr("href","./css/listview.css");
			}
			if($("#scroll_css")){
				$("#scroll_css").attr("href","./css/scroll.css");
			}
			if($("#loading_css")){
				$("#loading_css").attr("href","./css/loading.css");
			}
			if($("#reply_textarea"))
				$("#reply_textarea").attr("rows",10);
		}
		generateCategoryBar(function(){
			refreshMainListViewHeight();
			if(callback)
				callback();
		});
		
		generateCategoryBarForSta();
		setTimeout(function () {
			if(myDiscussionScroll)
				myDiscussionScroll.refresh();
		},1000);
	};
	
	// register for the orientation event changes
	//
	if ('onorientationchange' in window) {
		window.onorientationchange = function() {
			self.setOrientation();
		};
	} else {
		window.onresize = function() {
			if ($(window).height() > $(window).width()) {
				window.orientation = 0;
			} else {
				window.orientation = 90;
			}
			self.setOrientation();
		}
		if ($(window).height() > $(window).width()) {
			window.orientation = 0;
		} else {
			window.orientation = 90;
		}
	}
	
	return self;
};