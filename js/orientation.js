var SystemOrientation = {};
SystemOrientation = new function() {
	self = this;
	self.orientation=0;
	
	self.setOrientation = function() {
		var orientation = window.orientation;
		self.orientation = orientation;
		switch (orientation) {
		case 0:
			generateCategoryBar();
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
			generateCategoryBar();
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