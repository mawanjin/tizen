var sh ;
function getBodyOffset(e) {
	var e = e || window.event;
	var left = e.clientX + document.body.scrollLeft
	+ document.documentElement.scrollLeft,
	top = e.clientY + document.body.scrollTop
	+ document.documentElement.scrollTop + drawer.offset;
	
	
	return {
		x : left,
		//x : e.clientX,
			
		//y:e.clientY		
		y : top-35
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
		this.firstOperation=true;
		this.enable = true;
		this.callback;
		this.interval = 1000;
		this.isPlaying = false;
		this.isPause = false;
		this.isStop = false;
		this.isResume = false;
		this.isPutText = false;
		this.isPutTextMoving = false;
		this.offset = 0;
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
		this.c_text_control = false;
		this.index_text = 0 ;
		this.temp_font_size=0;
		this.enable_del = true;
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
//				
//				setTimeout(function(){
//					$('#div_can_txt').popup('open');
//				},100);
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
			
			var x = xy.x, y = xy.y;
			
			self.onClick({
				x : x,
				y : y
			});
		});
	},
	onMouseMove : function(pos) {
		// console.log("onMouseMove() called.x="+pos.x+";y="+pos.y);
		
		if (this.isButtonDown&&drawer.enable&&this.isButtonDown==true&&drawer.enable==true&&this.curDrawingType != this.type_text) {
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
				
				if(hasFinishedDrawingCheck==false){
					setTimeout(function(){
						updateReplayIconWhenDrawing();	
					});
				}
			} else if (this.curDrawingType == this.type_eraser) {
				this.context.clearRect(pos.x, pos.y, curEraserSize,
						curEraserSize);
			} else if (this.curDrawingType == this.type_clear) {
				this.context.clearRect(0, 0, 1000, 2000);
				return;
			}else if(this.isPutText==true){
				return;
			} 
			else if (this.curDrawingType == this.type_text) {
				updateCanTxtPos(pos);
				this.lastX = pos.x;
				this.lastY = pos.y;
				if(hasFinishedDrawingCheck==false){
					updateReplayIconWhenDrawing();
				}
				return;
			}

			this.lastX = pos.x;
			this.lastY = pos.y;
			this.curStroker.path.push(pos);
		}
	},
	onMouseDown : function(event, pos) {
		console.log("onMouseDown() called.and enable = "+drawer.enable);
		if(!drawer.enable||drawer.enable!=true){this.isButtonDown = false;return;}
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
		if(this.isPutText==true){
			this.isButtonDown = false;
		}else{
			this.lastX = pos.x;
			this.lastY = pos.y;
		}
		this.context.beginPath();
		this.context.moveTo(this.lastX, this.lastY);
		this.curStroker.type = this.curDrawingType;
		this.curStroker.color = this.curColor;
		this.curStroker.lineWidth = this.lineWidth;
		this.curStroker.path.push(pos);

	},
	onMouseUp : function(event, pos) {
		console.log("onMouseUp() called.");
		//this.firstOperation
		if(this.curDrawingType == this.type_line||this.curDrawingType == this.type_text){
			this.firstOperation = false;
		}

		if (this.curDrawingType == this.type_clear
				|| this.curDrawingType == this.type_text) {
			this.isButtonDown = false;
			return;
		}
		
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
		 console.log("ResetDrawCentre() called.");
		var p = this.historyStroker, p2, curColor = this.context.strokeStyle;
		var strokers = new Array();
		var data = new Array();
		var index = 0;
		
		if(this.isResume==true){
			this.executeReplay(interval);
			return;
		}

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
				if(c<0)continue;
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
		this.executeReplay(interval);

		this.context.strokeStyle = curColor;
	},
	executeReplay: function(interval){
		drawer.index = 0;
		if (interval) {
			sh = setInterval(function() {
				var s = drawer.allstrokers[drawer.index];
				// alert(drawer.index+";"+s.length);
				
				drawer.ResetDrawCentreForDisplay(s, interval);
				drawer.index = drawer.index + 1;
				if (drawer.index >= drawer.allstrokers.length) {
					console.log("clear interval");
					clearInterval(sh);
					drawer.callback();
				}else if(drawer.isPause==true){
					clearInterval(sh);
				}
			}, interval);
		} else {
			drawer
					.ResetDrawCentreForDisplay(drawer.allstrokers[drawer.allstrokers.length - 1]);
		}
	},
	resumeReplay:function(callback){//invoke callback when complete the work
		 drawer.isPause = false;
		 sh = setInterval(function() {
			var s = drawer.allstrokers[drawer.index];
			drawer.ResetDrawCentreForDisplay(s, drawer.interval);
			drawer.index = drawer.index + 1;
			if (drawer.index >= drawer.allstrokers.length) {
				clearInterval(sh);
				callback();
			}else if(drawer.isPause==true){
				clearInterval(sh);
			}
		}, drawer.interval);
	}
	,
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
		if(!p)return;
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

	}
	,
	onClick : function(pos) {
		console.log("onClick() called.");
		
		if(drawer.enable==false||this.curDrawingType != this.type_text)return;
		//alert(this.isPutText+";"+this.isPutTextMoving);
		if(this.isPutText==true&&this.isPutTextMoving==false){
			$("#c_input_txt_container").hide();
			if($("#c_input_txt").val()!=""&&$("#c_input_txt").val().length>0)
				executeInputTxt();
			this.isPutTextMoving = true;
			focusTop();
			return;
		}
		
		var exists =false;
		//check whether current position has a text. historyStroker
		for(var i=0;i<this.historyStroker.length;i++){
			if(drawer.type_text==this.historyStroker[i].type){
				var p_x = this.historyStroker[i].position.x;
				var p_y = this.historyStroker[i].position.y;
				var p_text = this.historyStroker[i].text;
				
				if(pos.x>=p_x&&pos.x<=(p_x+10*p_text.length)&&pos.y>=p_y-10&&pos.y<=(p_y+10)){
					this.temp_font_size = this.historyStroker[i].lineWidth;
					//show the text control
					$("#c_text_control").show();
					$("#c_text_control").css("left", p_x);
					$("#c_text_control").css("top", p_y-document.getElementById("c_text_control").offsetHeight);
					
					//$("#c_text").css("{font-color:red;font-size:"+this.temp_font_size+"px;}");
					$("#c_text").css({"font-size":this.temp_font_size+"px"});
					$("#c_text").html(p_text);
					$("#c_text").trigger("create");
					
					this.c_text_control = true;
					this.isPutText=false;
					exists = true;
					this.index_text = i;
					this.enable_del = false;
					break;
				}
			}
				
		}
		if(exists==true)return;
		
		
		if(this.c_text_control==true&&this.isPutText==false){
			$("#c_text_control").hide();
			
			this.historyStroker[this.index_text].lineWidth = this.temp_font_size;
			this.ResetDrawCentre();
			this.c_text_control = false;
			this.isPutText=true;
			this.isPutTextMoving=false;
			focusTop();
		}
		
		if(this.isPutText==true&&this.isPutTextMoving==true){
			$("#c_input_txt_container").show();
			$("#inner_text_container").css({"height":"35px"});
			$("#c_input_txt").css({"height":"35px"});
			$("#c_input_txt").css({"font-size":curTextSize+"px"});
			
			updateCanTxtPos(pos);
			this.isPutTextMoving = false;
			this.lastX = pos.x;
			this.lastY = pos.y;
		}else if(this.isPutText==true){
			$("#c_input_txt_container").hide();
			if($("#c_input_txt").val()!=""&&$("#c_input_txt").val().length>0)
				executeInputTxt();
			
			this.isPutTextMoving = true;
			focusTop();
		}
		
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
		this.isPutText = false;
	},
	onClear : function() {
		console.log("onClear called.");
		this.context.beginPath();
		this.curDrawingType = this.type_clear;
		this.curStroker.type = this.curDrawingType;
		this.curStroker.time = util.currentTimeMillis();
		if(this.historyStroker.length>0)
		this.historyStroker.push(this.curStroker);
		this.curStroker = {
			color : this.curColor,
			path : [],
			type : this.curDrawingType,
			time : this.curStroker.time
		};
		
		this.context.clearRect(0, 0, 1000, 2000);
		
		if(this.firstOperation==true){
			//delete from db
			deleteCanvas();
			clearInperson();			
		}
	},
	onUndo : function() {
		console.log("onUndo called.");

		if (!this.checkUndo())
			return;

		this.curDrawingType = this.type_back;
		this.curStroker.type = this.curDrawingType;
		this.curStroker.time = util.currentTimeMillis();
		if(this.historyStroker.length>0)
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
		if(this.historyStroker.length>0)
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
		this.context.fillText($("#c_input_txt").val(), this.lastX, this.lastY);

		this.curStroker.position = {
			x : this.lastX,
			y : this.lastY
		};
		this.curStroker.text = $("#c_input_txt").val();

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
		
		if(strokers&&strokers!=-1)
			this.historyStroker = strokers;
		this.ResetDrawCentre(interval);
	}
};

function eraserOnWorkspace(pop) {
	console.log("eraserOnWorkspace() called.");
	
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

function putTextWorkspace() {
	console.log("putText() called.");
	//$('#div_can_txt').popup('open');
	drawer.curDrawingType = drawer.type_text;
	drawer.c_text_control = false;
	drawer.isPutText = true;
	drawer.isPutTextMoving = true;
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
	if(hasFinishedDrawingCheck==false){
		updateReplayIconWhenDrawing();
	}
}

function penOnWorkspace(pop) {
	$("#c_input_txt_container").hide();
	drawer.isPutText=false;
	
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
var curTextSize = 25;

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
		if(strokers[i].position)
			xml += '<position>{"x":' + strokers[i].position.x + ',"y":'+strokers[i].position.y+'}</position>';
		xml += '<text>' + strokers[i].text + '</text>';
		xml += '<paths>';
		if(strokers[i].path&&strokers[i].path.length>0){
			for ( var j = 0; j < strokers[i].path.length; j++) {
				xml += '<path>{"x":' + strokers[i].path[j].x + ',"y":'+strokers[i].path[j].y+'}</path>';
			}
		}
		
		xml += '</paths>';

		xml += '</stroker>';
	}
	xml += '</strokers>';
	
	return xml;
}

function replayDrawingWorkspace(interval,callback){
	console.log("replayDrawing() called.");
	drawer.callback = callback;
	drawer.replay(-1, interval);
}

function replay() {
	console.log("replay() called.");
	parseStrokerXML(function(strokers) {
		console.log("parseStrokerXML() called.and stroker length is "
				+ strokers.length);
		drawer.replay(strokers, 1000);
	});
}

function pauseWorkspaceDrawing(){
	drawer.isPause = true;
}

function resumeWorkspaceReplay(callback){
	drawer.resumeReplay(callback);
}

function stopReplay(){
	if(!drawer)return;
	console.log("stopReplay() called.");
	drawer.isPlaying = false;
	drawer.isPause = false;
	drawer.isStop = false;
	drawer.isResume = false;
	clearInterval(sh);
	drawer.ResetDrawCentre();
}

function parseStrokerXML(xml,callback) {
	
	 // var xml = '<?xml version="1.0" encoding="UTF-8"?><strokers><stroker><color>#000000</color></stroker></strokers>';
//	  $(xml).find("stroker").each(function(i){ var
//	  color=$(this).children("color"); var
//	  color_value=$(this).children("color").text(); alert(color_value);});
	var stokers = new Array();
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

				stroker.color = $(this).children("color").text();
				stroker.type = $(this).children("type").text();
				stroker.time = $(this).children("time").text();
				stroker.lineWidth = $(this).children("lineWidth")
						.text();
				stroker.eraserSize = $(this).children("eraserSize")
						.text();
				if($(this).children("position").text())
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
	 
	/*
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
	});*/
}

function getInpersonVO(){
	hideInputText();
	
//	var xml = convertStrokerToXML(drawer.allstrokers);
	if(!drawer){
		return;
	}
	var xml = convertStrokerToXML(drawer.historyStroker);
	var data = drawer.canvas.toDataURL();
	var inperson = {"xml":xml,"data":data};
	return inperson;
}

function setInpersonWorkspace(inperson){
	
	parseStrokerXML(inperson._xml,function(strokers) {
		console.log("parseStrokerXML() called.and stroker length is "
				+ strokers.length);
		drawer.historyStroker = strokers;
		drawer.allstrokers =  strokers;
		drawer.firstOperation = true;
	});
}
function clearInperson(){
	console.log("clearInperson() called.");
	stopReplay();
	hasFinishedDrawingCheck = false;
	drawer.historyStroker = new Array();
	drawer.allstrokers =  new Array();
	this.firstOperation = true;
	$("#c_text").html("");
	$("#c_text_control").hide();
	hasInperson=false;
	updateCanvasReplayIcnonStatus();
}
var hasFinishedDrawingCheck = false;
function updateReplayIconWhenDrawing(){
	hasInperson = true;
	shoReplayIcon();
	hasFinishedDrawingCheck = true;
}
function showTextSettingPop(){
	$("#div_text_settings").popup( "open" );
}
function c_add(){
	drawer.temp_font_size = parseInt(drawer.temp_font_size)+5;
	if(drawer.temp_font_size>50)drawer.temp_font_size=50;
	
	$("#c_text").css({"font-size":drawer.temp_font_size+"px"});
	$("#c_text_control").css({"font-size":drawer.temp_font_size+"px"});
	
	$("#c_text_control").trigger("create");
	$("#c_text_control").hide();
	setTimeout(function(){$("#c_text_control").show();});
	
}

function c_subtract(){
	drawer.temp_font_size = parseInt(drawer.temp_font_size)-5;
	
	if(parseInt(drawer.temp_font_size)<5){
		drawer.temp_font_size = 5;
	}
	
	$("#c_text").css({"font-size":drawer.temp_font_size+"px"});
//	$("#c_text").trigger("create");
	
	$("#c_text_control").css({"font-size":drawer.temp_font_size+"px"});
	$("#c_text_control").trigger("create");
	$("#c_text_control").hide();
	setTimeout(function(){$("#c_text_control").show();});
}

function c_del(){
	console.log("c_del() called.");
	//this.enable_del
	if(drawer.enable_del == false){
		drawer.enable_del = true;
		return;	
	}
	var temp = new Array();
	$("#c_text_control").hide();
	for(var i=0;i<drawer.historyStroker.length;i++){
		if(i==drawer.index_text)continue;
		temp.push(drawer.historyStroker[i]);
	}
	drawer.historyStroker = temp;
	
	drawer.c_text_control = false;
	drawer.isPutText=true;
	drawer.isPutTextMoving=true;
	drawer.ResetDrawCentre();
	focusTop();
}


function hideInputText(){
	$("#c_input_txt_container").hide();
}