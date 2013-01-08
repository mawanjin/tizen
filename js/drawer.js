function getBodyOffset(e) {
	var e = e || window.event;
	var left = e.clientX + document.body.scrollLeft
	+ document.documentElement.scrollLeft,top = e.clientY + document.body.scrollTop
	+ document.documentElement.scrollTop;
	
	return {
		x : left,
		//x : e.clientX,
			
		//y:e.clientY		
		y : top
	};
}

function Drawing(canvas, options) {
	typeof canvas == 'string' && (canvas = document.getElementById(canvas));
	if (!canvas || !canvas.getContext) {
		alert("do not support canvas!");
	}
	this.init(canvas);
	/*
	this.option = {
		colors : [ '#000000', '#ff0000', '#00ff00', '#0000ff', '#00ffff',
				'#7fef02', '#4488bb' ]
	};
	this.setOption(options);
   */
}

Drawing.prototype = {
	/*	
	setOption : function(options) {
		typeof options == 'object' || (options = {});
		for ( var i in options) {
			switch (i) {
			case 'colors':
				this.option[i] = options[i];
				break;
			}
		}
	},*/
	init : function(canvas) {
		this.type_line = 0;
		this.type_text = 1;
		this.type_eraser = 2;
		this.type_clear = 3;
		this.type_back = 4;
		this.type_forward = 5;
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.context.lineWidth = 1;
		this.context.lineJons = 'round';
		this.context.lineCep = 'round';
		this.isButtonDown = false;
		this.historyStroker = [];
		this.curStroker = {
			color : '#000000',
			path : [],
			type : this.type_line,
			time : util.currentTimeMillis(),
			lineWidth : 5,
			eraserSize : 5
		};
		this.lastX = 0;
		this.lastY = 0;
		this.curColor = '#000000';
		this.lineWidth = 5;
		this.curDrawingType = this.type_line;
		this.toolbarspos = {};
		this.bindEvent();
		//this.ResetDrawToolbar();
		this.lastIndex = 0;
		this.allstrokers = new Array();
		this.index = 0;
	},
	initAfterReady:function(){
		console.log("initAfterReady() called.");
		$( "#slider-mini-pen" ).on( 'slidestop', function( event ) {
			updatePenSettingPreview();
		});
		
		$( "#slider-mini-eraser" ).on( 'slidestop', function( event ) {
			updateEraserSettingPreview();
		});
		
		$("#slider-mini-text").on( 'slidestop', function( event ) {
			updateTextSettingPreview();
		});
		
		
		
		$("#div_pen_settings").bind({
   		popupafteropen: function(event, ui) {
   			updatePenSettingPreview();
   		}
		});
	
		$("#div_pen_settings").bind({
			popupafterclose: function(event, ui) {
				drawer.onPen();
			}
			});
		
		$("#div_eraser_settings").bind({
   		popupafteropen: function(event, ui) {
   			updateEraserSettingPreview();
   		}
		});
		
		$("#div_eraser_settings").bind({
			popupafterclose: function(event, ui) {
				drawer.onEraser();
			}
			});	
			
		$("#div_text_settings").bind({
			popupafterclose: function(event, ui) {
				
				setTimeout(function(){
					$('#div_can_txt').popup('open');
				},100);
			}
			});
			
		$("#div_text_settings").bind({
   		popupafteropen: function(event, ui) {
   			updateTextSettingPreview();
   		}
		});
		
		//test 
	}
	,
	bindEvent : function() {
		console.log("bindEvent() called.");
		var self = this;

		$("#can").bind("vmousemove", function(e) {			
			var xy = getBodyOffset(e);
			//var x = xy.x - this.offsetLeft, y = xy.y - this.offsetTop;
			var x = xy.x, y = xy.y;
			self.onMouseMove({
				x : x,
				y : y
			});
		});
		$("#can").bind("vmousedown", function(e) {
			console.log("vmousedown() called.");
			var xy = getBodyOffset(e);
			//var x = xy.x - this.offsetLeft, y = xy.y - this.offsetTop;
			var x = xy.x, y = xy.y;
			self.onMouseDown(event, {
				x : x,
				y : y
			});
		});

		$("#can").bind("vmouseup", function(e) {
			console.log("vmouseup() called.");
			var xy = getBodyOffset(e);
			//var x = xy.x - this.offsetLeft, y = xy.y - this.offsetTop;
			var x = xy.x, y = xy.y;
			self.onMouseUp(event, {
				x : x,
				y : y
			});
		});

		$("#can").bind("vclick", function(e) {
			console.log("vclick() called.");
			var xy = getBodyOffset(e);
			
			//var x = xy.x - this.offsetLeft, y = xy.y - this.offsetTop;
			var x = xy.x, y = xy.y;
			self.onClick({
				x : x,
				y : y
			});
		});
	},
	onMouseMove : function(pos) {
		// console.log("onMouseMove() called.x="+pos.x+";y="+pos.y);
		if (this.isButtonDown) {
			/*
			var p = this.toolbarspos;
			for ( var i in p) {
				if (pos.x >= p[i].x && pos.x <= p[i].x + p[i].w
						&& pos.y >= p[i].y && pos.y <= p[i].y + p[i].h) {
					return;
				}
			}*/
			if (this.curDrawingType == this.type_line) {
				this.context.lineTo(pos.x, pos.y);
				this.context.stroke();
			} else if (this.curDrawingType == this.type_eraser) {
				this.context.clearRect(pos.x, pos.y, curEraserSize,
						curEraserSize);
			} else if (this.curDrawingType == this.type_clear) {
				this.context.clearRect(0, 0, 1000, 2000);
				return;
			} else if (this.curDrawingType == this.type_text) {
				updateCanTxtPos(pos);
				this.lastX = pos.x;
				this.lastY = pos.y;
				return;
			}

			this.lastX = pos.x;
			this.lastY = pos.y;
			this.curStroker.path.push(pos);
		}
	},
	onMouseDown : function(event, pos) {
		console.log("onMouseDown() called.x="+pos.x+";y="+pos.y);

		if (this.curDrawingType == this.type_clear) {
			return;
		}
		/*
		var p = this.toolbarspos;
		for ( var i in p) {
			if (pos.x >= p[i].x && pos.x <= p[i].x + p[i].w && pos.y >= p[i].y
					&& pos.y <= p[i].y + p[i].h) {
				return;
			}
		}*/
		this.isButtonDown = true;
		
		this.lastX = pos.x;
		this.lastY = pos.y;
		this.context.beginPath();
		this.context.moveTo(this.lastX, this.lastY);
		this.curStroker.type = this.curDrawingType;
		this.curStroker.color = this.curColor;
		this.curStroker.lineWidth = this.lineWidth;
		this.curStroker.path.push(pos);

	},
	onMouseUp : function(event, pos) {
		console.log("onMouseUp() called.");

		if (this.curDrawingType == this.type_clear
				|| this.curDrawingType == this.type_text) {
			return;
		}
		/*
		var p = this.toolbarspos;
		for ( var i in p) {
			if (pos.x >= p[i].x && pos.x <= p[i].x + p[i].w && pos.y >= p[i].y
					&& pos.y <= p[i].y + p[i].h) {
				return;
			}
		}*/
		this.isButtonDown = false;
		this.curStroker.eraserSize = curEraserSize;
		this.historyStroker.push(this.curStroker);
		this.curStroker = {
			color : this.curColor,
			path : [],
			type : this.curDrawingType,
			time : 0,
			lineWidth : 5
		};

	},
	ResetDrawAll : function() {
		// console.log("ResetDrawAll() called.");
		this.context.clearRect(0, 0, 1000, 2000);
		this.ResetDrawCentre();
		//this.ResetDrawToolbar();
	},
	ResetDrawCentre : function(interval) {
		// console.log("ResetDrawCentre() called.");
		var p = this.historyStroker, p2, curColor = this.context.strokeStyle;
		var strokers = new Array();
		var data = new Array();
		var index = 0;

		var allstrokers = new Array();

		for ( var i = 0; i < p.length; i++) {
			var temp = new Array();

			if (p[i].type == this.type_back) {
				strokers.pop();
			} else if (p[i].type == this.type_forward) {
				data = new Array();
				var count_back = 0;
				var count_forward = 0;
				var index_content = 0;
				for ( var k = i; k >= 0; k--) {
					if (p[k].type == this.type_back) {
						count_back++;
					} else if (p[k].type == this.type_forward) {
						count_forward++;
					} else {
						index_content = k;
						break;
					}
				}

				for ( var j = 0; j <= index_content; j++) {
					data.push(p[j]);
				}

				var c = count_back - count_forward;

				index_content = index_content + 1;
				for ( var m = 0; m < c; m++) {
					data.push(p[m + index_content]);
				}
				strokers = this.executeDraw(data, interval);

			} else {
				strokers.push(p[i]);
			}

			for ( var k in strokers) {
				temp.push(strokers[k]);
			}

			allstrokers.push(temp);
			// this.ResetDrawCentreForDisplay(strokers,interval);
		}
		drawer.allstrokers = allstrokers;
		drawer.index = 0;
		if (interval) {
			var sh = setInterval(function() {
				var s = drawer.allstrokers[drawer.index];
				// alert(drawer.index+";"+s.length);
				drawer.ResetDrawCentreForDisplay(s, interval);
				drawer.index = drawer.index + 1;
				if (drawer.index >= drawer.allstrokers.length) {
					clearInterval(sh);
				}
			}, interval);
		} else {
			drawer
					.ResetDrawCentreForDisplay(allstrokers[allstrokers.length - 1]);
		}

		this.context.strokeStyle = curColor;
	},
	executeDraw : function(data, interval) {
		// console.log("executeDraw called.data.length="+data.length);
		if (data.length == 0)
			this.context.clearRect(0, 0, 1000, 2000);
		var p = data, p2, curColor = this.context.strokeStyle;
		var strokers = new Array();

		var _data = new Array();
		for ( var i = 0; i < p.length; i++) {
			if (p[i].type == this.type_back) {
				strokers.pop();
			} else if (p[i].type == this.type_forward) {
				_data = new Array();
				var count_back = 0;
				var count_forward = 0;
				var index_content = 0;
				for ( var k = i; k >= 0; k--) {
					if (p[k].type == this.type_back) {
						count_back++;
					} else if (p[k].type == this.type_forward) {
						count_forward++;
					} else {
						index_content = k;
						break;
					}
				}

				for ( var j = 0; j <= index_content; j++) {
					_data.push(p[j]);
				}
				var c = count_back - count_forward;

				index_content = index_content + 1;
				for ( var m = 0; m < c; m++) {
					_data.push(p[m + index_content]);
				}

				var ch = this.executeDraw(_data, interval);
				strokers = ch;
				/*
				 * for(var n=0;n<ch.length;n++){ strokers.push(ch[n]); }
				 */
				continue;
			} else {
				strokers.push(p[i]);
			}
			// this.ResetDrawCentreForDisplay(strokers,interval);
		}
		this.context.strokeStyle = curColor;
		return strokers;
	},
	ResetDrawCentreForDisplay : function(data, interval) {
		// console.log("ResetDrawCentreForDisplay()
		// called.data.length="+data.length);

		this.context.clearRect(0, 0, 1000, 2000);
		var p = data, p2, curColor = this.context.strokeStyle;
		for ( var i = 0; i < p.length; i++) {
			this.context.beginPath();
			if (p[i].type == this.type_clear) {
				this.context.clearRect(0, 0, 1000,2000);
				continue;
			} else if (p[i].type == this.type_text) {
				// alert(p[i].text+";"+p[i].position.x+";"+p[i].position.y);
				this.context.fillStyle = p[i].color;
				this.context.font = p[i].lineWidth + "px Times New Roman";
				this.context.fillText(p[i].text, p[i].position.x,
						p[i].position.y);
				continue;
			}

			this.context.strokeStyle = p[i].color;
			this.context.lineWidth = p[i].lineWidth;
			// this.context.beginPath();
			for ( var t = 0; t < p[i].path.length; t++) {
				p2 = p[i].path[t];
				if (t == 0)
					this.context.moveTo(p2.x, p2.y);
				if (p[i].type == this.type_line) {
					this.context.lineTo(p2.x, p2.y);
					this.context.stroke();
				} else if (p[i].type == this.type_eraser) {
					this.context.clearRect(p2.x, p2.y, p[i].eraserSize,
							p[i].eraserSize);
					this.context.stroke();
				} else if (p[i].type == this.type_text) {
					// console.log(p[i].text+";"+p[i].position.x+";"+p[i].position.y);
					this.context.fillText(p[i].text, p[i].position.x,
							p[i].position.y);
				}
			}
			this.context.beginPath();
		}
		this.context.strokeStyle = curColor;

	},
	ResetDrawToolbar : function() {
		// console.log("ResetDrawToolbar() called.");
		var curcolor = this.context.fillStyle;

		for ( var i = 0; i < this.option.colors.length; i++) {
			this.context.fillStyle = this.option.colors[i];
			if (this.curColor == this.context.fillStyle) {
				this.context.fillRect(i * 35 + 5, 2, 30, 20);
				this.toolbarspos[i] = {
					x : i * 35 + 5,
					y : 2,
					w : 30,
					h : 20
				};
			} else {
				this.context.fillRect(i * 35 + 5, 5, 30, 20);
				this.toolbarspos[i] = {
					x : i * 35 + 5,
					y : 5,
					w : 30,
					h : 20
				};
			}
			this.context.stroke();
		}
		this.context.fillStyle = curcolor;

	},
	onClick : function(pos) {
		console.log("onClick() called.");
		/*
		var p = this.toolbarspos;
		for ( var i in p) {
			if (pos.x >= p[i].x && pos.x <= p[i].x + p[i].w && pos.y >= p[i].y
					&& pos.y <= p[i].y + p[i].h) {
				this.curColor = this.option.colors[i];
				this.curDrawingType = this.type_line;
				this.context.strokeStyle = this.curColor;
				this.ResetDrawAll();
			}
		}*/
	},
	onPen : function() {
		console.log("onPen called.");
		this.curDrawingType = this.type_line;
		this.curColor = curPenColor;
		this.lineWidth = curPenSize;
		this.context.strokeStyle = this.curColor;
		this.context.lineWidth = this.lineWidth;
	},
	onEraser : function() {
		console.log("onEraser called.");
		this.curDrawingType = this.type_eraser;
		this.context.eraserSize = curEraserSize;
	},
	onClear : function() {
		console.log("onClear called.");
		this.context.beginPath();
		this.curDrawingType = this.type_clear;
		this.curStroker.type = this.curDrawingType;
		this.curStroker.time = util.currentTimeMillis();
		this.historyStroker.push(this.curStroker);
		this.curStroker = {
			color : this.curColor,
			path : [],
			type : this.curDrawingType,
			time : this.curStroker.time
		};
		
		this.context.clearRect(0, 0, 1000, 2000);
		//this.ResetDrawToolbar();
		// this.ResetDrawAll();
	},
	onUndo : function() {
		console.log("onUndo called.");

		if (!this.checkUndo())
			return;

		this.curDrawingType = this.type_back;
		this.curStroker.type = this.curDrawingType;
		this.curStroker.time = util.currentTimeMillis();
		this.historyStroker.push(this.curStroker);
		this.curStroker = {
			color : this.curColor,
			path : [],
			type : this.curDrawingType,
			time : this.curStroker.time
		};
		this.ResetDrawAll();
	},
	onRedo : function() {
		console.log("onRedo called.");

		if (!this.checkRedo())
			return;

		this.curDrawingType = this.type_forward;
		this.curStroker.type = this.curDrawingType;
		this.curStroker.time = util.currentTimeMillis();
		this.historyStroker.push(this.curStroker);
		this.curStroker = {
			color : this.curColor,
			path : [],
			type : this.curDrawingType,
			time : this.curStroker.time
		};
		this.ResetDrawAll();
	},
	onInputTxt : function() {
		console.log("onInputTxt called.");
		this.curDrawingType = this.type_text;
		this.curStroker.type = this.curDrawingType;
		this.curStroker.time = util.currentTimeMillis();
		// this.historyStroker.push(this.curStroker);
		// this.curStroker =
		// {color:this.curColor,path:[],type:this.curDrawingType,time:this.curStroker.time,position:{x:0,y:0},text:""};
	},
	onExecuteInputText : function() {
		console.log("onExecuteInputText called.");

		this.curStroker.color = curTextColor;
		this.curStroker.lineWidth = curTextSize;

		this.context.fillStyle = this.curStroker.color;
		this.context.font = this.curStroker.lineWidth + "px Times New Roman";
		this.context.fillText($("#c_input_txt").html(), this.lastX, this.lastY);

		this.curStroker.position = {
			x : this.lastX,
			y : this.lastY
		};
		this.curStroker.text = $("#c_input_txt").html();

		this.historyStroker.push(this.curStroker);
		this.curStroker = {
			color : this.curColor,
			path : [],
			type : this.curDrawingType,
			time : this.curStroker.time,
			position : {
				x : 0,
				y : 0
			},
			text : ""
		};
	},
	checkUndo : function() {
		var p = this.historyStroker;
		var count_back = 0;
		var count_content = 0;
		var f_back = false;
		var f_content = false;

		for ( var i = p.length - 1; i >= 0; i--) {
			if (p[i].type == this.type_back && !f_content) {
				count_back++;
			} else if (p[i].type == this.type_back && f_content) {
				break;
			} else if (p[i].type == this.type_forward) {
				count_back--;
			} else {
				f_content = true;
				if (!f_back)
					count_content++;
			}
		}

		if (count_back < count_content)
			return true;
		else
			return false;
	},
	checkRedo : function() {
		var p = this.historyStroker;
		var count_back = 0;
		var count_forward = 0;
		var count_content = 0;
		var f_forward = false;
		var f_back = false;
		var f_content = false;

		for ( var i = p.length - 1; i >= 0; i--) {
			if (p[i].type == this.type_forward && !f_forward) {
				count_forward++;
			} else if (p[i].type == this.type_back) {
				count_back++;
				f_forward = true;
			} else {
				break;
			}
		}
		if (count_forward <= count_back)
			return true;
		else
			return false;
	},
	replay : function(strokers, interval) {
		this.historyStroker = strokers;
		this.ResetDrawCentre(interval);
	}
};

function eraserOn(pop) {
	console.log("eraserOn() called.");
	
	if(pop==false){
		drawer.onEraser();
	}else{
		$("#div_eraser_settings").popup('open');
	}
}

function clear() {
	console.log("clear() called.");
	drawer.onClear();
}

function undo() {
	console.log("undo() called.");
	drawer.onUndo();
}

function redo() {
	console.log("redo() called.");
	drawer.onRedo();
}

function putText() {
	console.log("putText() called.");
	$('#div_can_txt').popup('open');
}

function fireCanTxt() {
	console.log("fireCanTxt() called.");
	$("#div_can_txt").popup("close");
	$("#c_input_txt_container").show();
	drawer.onInputTxt();
	$("#c_input_txt").html($("#can_txt").val());
}

function updateCanTxtPos(xy) {
	$("#c_input_txt_container").css("left", xy.x);
	$("#c_input_txt_container").css("top", xy.y);
}

function cancelCanTxt() {
	console.log("cancelCanTxt() called.");
	$("#div_can_txt").popup("close");
}

function cancelInputTxt() {
	$("#c_input_txt_container").hide();
	$("#div_can_txt").show();
}

function executeInputTxt() {
	$("#c_input_txt_container").hide();
	drawer.onExecuteInputText();
	$("#c_input_txt").val("");
	$("#can_txt").val("");
}

function penOn(pop) {
	if(pop==false){
		drawer.onPen();
	}else{
		$('#div_pen_settings').popup('open');
	}
}

function updateEraserSettingPreview() {
	console.log("updateEraserSettingPreview() called.");
	var canvas = document.getElementById("canvas_eraser_setting");
	var context = canvas.getContext('2d');

	context.clearRect(0, 0, canvas.width, canvas.height);
	// context.strokeStyle = curPenColor;
	context.lineWidth = $("#slider-mini-eraser").val();
	context.beginPath();
	context.moveTo(canvas.width / 2 - 10, canvas.height / 2);
	context.lineTo(canvas.width / 2 + context.lineWidth, canvas.height / 2);
	context.stroke();
	curEraserSize = $("#slider-mini-eraser").val();
}

function updatePenSettingPreview() {
	console.log("updatePenSettingPreview() called.");
	var canvas = document.getElementById("canvas_pen_setting");
	var context = canvas.getContext('2d');

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.strokeStyle = curPenColor;
	context.lineWidth = $("#slider-mini-pen").val();
	context.beginPath();
	context.moveTo(10, canvas.height / 2);
	context.lineTo(canvas.width - 10, canvas.height / 2);
	context.stroke();
	curPenSize = $("#slider-mini-pen").val();
}

function updateTextSettingPreview() {
	console.log("updateTextSettingPreview() called.");
	var canvas = document.getElementById("canvas_text_setting");
	var context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.strokeStyle = curTextColor;
	context.lineWidth = $("#slider-mini-text").val();

	context.fillStyle = curTextColor;
	context.font = context.lineWidth + "px Times New Roman";
	context.fillText("ABC abc", 5, canvas.height - 10);
	curTextSize = context.lineWidth;
}

var curPenColor = "#000000";
var curPenSize = 5;
var curEraserSize = 10;
var curTextColor = "#000000";
;
var curTextSize = 5;

function updateCurPenColor(color) {
	curPenColor = color;
	curPenSize = $("#slider-mini-pen").val();
	updatePenSettingPreview();
}

function updateCurTextColor(color) {
	curTextColor = color;
	curTextSize = $("#slider-mini-text").val();
	updateTextSettingPreview();
}

function saveToImg() {
	// convert to xml
	// alert(drawer.historyStroker.length);
	var xml = convertStrokerToXML(drawer.historyStroker);

	var data = drawer.canvas.toDataURL();
	// save original data and xml into db
	var img = data.substring(22);
	$("#rs_img").html('<img src="' + data + '"/>');
}

function convertStrokerToXML(strokers) {
	var xml = '<?xml version="1.0" encoding="UTF-8" ?>';
	xml += '<strokers>';
	for ( var i = 0; i < strokers.length; i++) {
		xml += '<stroker>';
		xml += '<color>' + strokers[i].color + '</color>';
		xml += '<type>' + strokers[i].type + '</type>';
		xml += '<time>' + strokers[i].time + '</time>';
		xml += '<lineWidth>' + strokers[i].lineWidth + '</lineWidth>';
		xml += '<eraserSize>' + strokers[i].eraserSize + '</eraserSize>';
		xml += '<position>' + strokers[i].position + '</position>';
		xml += '<text>' + strokers[i].text + '</text>';
		xml += '<paths>';
		for ( var j = 0; j < strokers[i].path; j++) {
			xml += '<path>' + strokers[i].path[j] + '</path>';
		}
		xml += '</paths>';

		xml += '</stroker>';
	}
	xml += '</strokers>';
}

function replay() {
	console.log("replay() called.");
	parseStrokerXML(function(strokers) {
		console.log("parseStrokerXML() called.and stroker length is "
				+ strokers.length);
		drawer.replay(strokers, 1000);
	});
}

function parseStrokerXML(callback) {
	/*
	 * var xml = '<?xml version="1.0" encoding="UTF-8"?><strokers><stroker><color>#000000</color></stroker></strokers>';
	 * $(xml).find("stroker").each(function(i){ var
	 * color=$(this).children("color"); var
	 * color_value=$(this).children("color").text(); alert(color_value);});
	 */
	var stokers = new Array();
	$.ajax({
		url : 'stroker_template.xml',
		type : 'GET',
		dataType : 'xml',
		timeout : 1000,
		error : function(xml) {
			alert('Error loading XML document' + xml);
		},
		success : function(xml) {
			$(xml).find("stroker").each(
					function(i) {
						var stroker = {
							color : '#000000',
							path : [],
							type : 1,
							time : 0,
							lineWidth : 0,
							eraserSize : 0,
							position : {
								x : 0,
								y : 0
							},
							text : ''
						};
						;

						stroker.color = $(this).children("color").text();
						stroker.type = $(this).children("type").text();
						stroker.time = $(this).children("time").text();
						stroker.lineWidth = $(this).children("lineWidth")
								.text();
						stroker.eraserSize = $(this).children("eraserSize")
								.text();
						stroker.position = util.strToJson($(this).children(
								"position").text());
						stroker.text = $(this).children("text").text();
						// parse path
						$(this).children("paths").find("path").each(
								function(j) {
									stroker.path.push(util.strToJson($(this)
											.text()));
								});

						stokers.push(stroker);
					});
			callback(stokers);
		}
	});

}