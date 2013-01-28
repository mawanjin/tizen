var mChoicePanel = {};

mChoicePanel = new function(){
	
	this.onChoiceClick;
	this.question;
	
	this.setChoice = function(which){
		console.log("setChoice() called");
		this.changeButtonsBg(which);
	};
	
	this.generateChoicePancel = function(question,onChoiceClick,callback){
		console.log("generateChoicePancel() called");
		this.question = question;
		this.onChoiceClick = onChoiceClick;
		var html = '<table width=100% height=100% border=0>\
			<tr>\
				<td class="choicePanelMarginTd"></td>\
				';
		
		var len = question.getAnswerLetters().length;
		
		var w ='a';
		for(var i=0;i<len;i++){
			if(i==0)w='a';
			else if(i==1)w='b';
			else if(i==2)w='c';
			else if(i==3)w='d';
			else if(i==4)w='e';
			else if(i==5)w='f';
			
			html+='<td valign=top><img id="imgChoiceBtn_'+i+'" onclick="mChoicePanel.changeButtonsBg('+i+');" width="60px" src="./css/images/answer_'+w+'.png" /></td>';
		}
		html+='<td class="choicePanelMarginTd"></td></tr>';
		var hintCount = question.getHintCount();
		var hint='';
		if(hintCount>0){
			current_hint_index = 1;
			hint='<td colspan=4 align="right"><img id="btnHint" class="choice_panel_img_two_btn" src="./css/images/hint.png" onclick="onHintClick('+hintCount+')" />&nbsp;&nbsp;</td>';
		}
		else{
			current_hint_index =-1;
			hint='<td colspan=4 align="right">&nbsp;&nbsp;</td>';
		}
			
		
		html+='<tr>'+hint+'<td colspan=4 align="left">&nbsp;&nbsp;<a href="#popupConfirm" data-rel="popup"><img class="choice_panel_img_two_btn"  src="./css/images/confirm_button.png" /></a></td></tr></table>';
		//console.log("start create choice panel::"+html);
		$("#choicePanelContainer").html(html);
		$("#choicePanelContainer").trigger('create');
		callback();
	};
	
	this.changeButtonsBg = function(which){
		var w ='a';
			if(which==0)w='a';
			else if(which==1)w='b';
			else if(which==2)w='c';
			else if(which==3)w='d';
			else if(which==4)w='e';
			else if(which==5)w='f';
		
		var currentSrc = $("#imgChoiceBtn_"+which).attr("src");
		
		if(this.question.solution.length==1){
			//reset all option's bg
			var len = this.question.getAnswerLetters().length;
				
			for(var i=0;i<len;i++){
				var _w='a';
				if(i==0)_w='a';
				else if(i==1)_w='b';
				else if(i==2)_w='c';
				else if(i==3)_w='d';
				else if(i==4)_w='e';
				else if(i==5)_w='f';
				$("#imgChoiceBtn_"+i).attr("src","./css/images/answer_"+_w+".png");
				$("#imgChoiceBtn_"+i).trigger("create");
			}
		}
		
		var select = "true";
		if(!util.contains(currentSrc,"select",false)){
			$("#imgChoiceBtn_"+which).attr("src","./css/images/answer_select_"+w+".png");
			$("#imgChoiceBtn_"+which).trigger("create");
			select = "true";
		}else{
			select = "false";
		}
		
		this.onChoiceClick(which,select);
	};
};
