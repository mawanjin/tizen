var SystemOrientation = {};
SystemOrientation = new function() {
	var self = this;
	self.orientation = 0;

	self.setOrientation = function() {
		var orientation = window.orientation;
		self.orientation = orientation;
		// alert(orientation);
		switch (orientation) {
		case 0:
			self.refresh();
			// generateCategoryBar();
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
			// generateCategoryBar();
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

	self.refresh = function(callback) {

		if (self.orientation == 0) {// portrait mode
			if ($("#main_css")) {
				$("#main_css").attr("href", "./css/style-portrait.css");
			}
			if ($("#listview_css")) {
				$("#listview_css").attr("href", "./css/listview-portrait.css");
			}

			if ($("#scroll_css")) {
				$("#scroll_css").attr("href", "./css/scroll-portrait.css");
			}
			if ($("#loading_css")) {
				$("#loading_css").attr("href", "./css/loading-portrait.css");
			}
			if ($("#reply_textarea"))
				$("#reply_textarea").attr("rows", 20);

			if ($("#slider_css")) {
				$("#slider_css").attr("href", "./css/slider-portrait.css");
			}

		} else {
			if ($("#main_css"))
				$("#main_css").attr("href", "./css/style.css");
			if ($("#listview_css")) {
				$("#listview_css").attr("href", "./css/listview.css");
			}
			if ($("#scroll_css")) {
				$("#scroll_css").attr("href", "./css/scroll.css");
			}
			if ($("#loading_css")) {
				$("#loading_css").attr("href", "./css/loading.css");
			}

			if ($("#slider_css")) {
				$("#slider_css").attr("href", "./css/slider.css");
			}

			if ($("#reply_textarea"))
				$("#reply_textarea").attr("rows", 10);
		}

		if (current_page == Constant.application_page_main) {

			generateCategoryBar(function() {
				refreshMainListViewHeight();
				resetMainScroll();
				if (callback)
					callback();
			});
		} else if (current_page == Constant.application_page_intro) {
			resetMyProblemIntroMenuScroll();
		} else if (current_page == Constant.application_page_question_view) {
			resetQuestionViewScroll();
		} else if (current_page == Constant.application_page_app_intro) {
			resetmyInfoScroll();
		} else if (current_page == Constant.application_page_st) {
			generateCategoryBarForSta();
			resetmyStaScroll();
		} else if (current_page == Constant.application_page_discussion) {
			resetMyDiscussionScroll();
		} else if (current_page == Constant.application_page_bookmark) {
			resetBookMarkScroll();
		} else if (current_page == Constant.application_page_exam) {
			resetmyExamScroll();
		} else if (current_page == Constant.application_page_package_intro) {
			resetmyPackageIntroScroll();
		}

	};

	return self;
};

function onErrorCallback(){
	console.log("error.......a a a ");
}

tizen.systeminfo.addPropertyValueChangeListener("DeviceOrientation",
		onSuccessCallback, onErrorCallback, {
			lowThreshold : 0.2
});

function onSuccessCallback(orientation) {
	switch (orientation.status) {

	case 0:
		console.log(" Device current Orientation " + "portrait-primary");
		window.orientation = 0;
		SystemOrientation.setOrientation();
		break;

	case 1:
		console.log(" Device current Orientation " + "portrait-secondary");
		window.orientation = 0;
		SystemOrientation.setOrientation();
		break;

	case 2:
		console.log(" Device current Orientation " + "landscape-primary");// Reverse
		window.orientation = 90;
		SystemOrientation.setOrientation();																	// landscape
																			// in
																			// emulator
		break;

	case 3:
		console.log(" Device current Orientation " + "landscape-secondary");// Landscape
		window.orientation = 90;
		SystemOrientation.setOrientation();																	// landscape																			// in
																			// emulator
		break;

	}
}