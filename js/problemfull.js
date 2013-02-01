
var drawer;
var initWorkspace = function() {
	console.log("initWorkspace() called.");
	drawer = new Drawing('can');
	drawer.initAfterReady();
};	

//$(document).ready(init);
var choicesID = 'choices';    // 可选答案element id
var circleID = 'circle';      // 图标 圆的element id
var correctID = 'correct';    // 图标 正确element id
var solutionUserID = 'user_solution';    // 用户答案 element id
var solutionCorrectID = 'correct_solution';   // 正确答案 element id
var solutionDetailsID = 'solution_details';
var cur_choice_inxs = [];    // 当前用户选择答案的下标数组
var correct_inxs = [];      // 多个正确答案的下标数组
/**
 * 更新文章标签内的html
 */
function freshPassageHtmlWorkspace(html) {
	document.getElementById("content1").innerHTML=html;
	$("#content1").trigger("create");
}
/**
 * 更新问题的内容
 */
function freshQuestionContent(content) {
	document.getElementById("question").innerHTML=content;
	$("#question").trigger("create");
}
/**
 * 设定问题的可选答案
 * @param choices 可选答案数组
 * @param a_correct_inxs  正确答案的下标数组 0-A 1-B 2-C ....
 */
function setChoices(choices, a_correct_inxs,solution_details) {
	
    correct_inxs = a_correct_inxs;
    var innerHTML = '<table>';
    for (var i = 0; i < choices.length; i++) {
        var choice = choices[i];
        var _isCorrectInx = isCorrectInx(i);

        innerHTML += '<tr>' +
        '<td class="choice_letter"><div style="position:absolute;padding-left:7px;padding-top:2px;">' + translateLetter(i) + '</div><div id="' + circleID + i + '" class="choice_icon" ><img src="circle.png" width="28px" height="28px"/></div><div id="' + correctID + i + '" class="choice_icon"><img src="select.png" width="28px" height="28px"/></div></td>' +
        '<td class="choice_text">' + choice.text + '</td>' +
        '</tr>';
        
        if (choice.tip)
			innerHTML += '<tr><td class="choice_tip" colspan=2>' +
                 '<br/>' + choice.tip + '</td></tr>';
		else 
			innerHTML += '<tr><td colspan=2> </td></tr>';        
		
		if (_isCorrectInx) {
            innerHTML += '<tr><td class="choice_discussion" colspan=2><b>' +
                    'If you don\'t understand why this answer choice is correct, leave a comment in the discussion board <img src="discussion.png" width="30px"/>.' +
                    '</b></td></tr>';
        }
        innerHTML += '<tr><td>&nbsp;</td></tr>';
    }
    innerHTML += '';
    innerHTML += '</table>';
    
    document.getElementById(""+choicesID).innerHTML=innerHTML;
    document.getElementById("solution_details").innerHTML=solution_details;
	$("#solution_details").trigger("create");
    createCircleIcon();
    createCorrectIcon();
}
/* refresh passage, stem and choices together */
function freshWorkspacePassageStemChoices(fscreen,passage,stem,choices, a_correct_inxs,sol_details) {
	
	if (fscreen)
		twoColumn();
	else
		oneColumn();
	freshPassageHtmlWorkspace(passage);
	freshQuestionContent(stem);
	setChoices(choices, a_correct_inxs,sol_details);
	
	
}

/**
 * 选择答案
 * @param inx 所选择答案的下标  0-A 1-B 2-C ....
 */
function choice(inx) {
	document.getElementById(""+circleID + inx).style.display="block";
    //$('#' + circleID + inx).show();
    if (!existInArray(cur_choice_inxs, inx))
        cur_choice_inxs.push(inx);
}
/**
 * 取消选择
 * @param inx 所选择答案的下标  0-A 1-B 2-C ....
 */
function cancelchoice(inx) {
	document.getElementById(""+circleID + inx).style.display="none";
	
    //$('#' + circleID + inx).hide();
    if (existInArray(cur_choice_inxs, inx)) {
        var _a = [];
        for (var i = 0; i < cur_choice_inxs.length; i++) {
            if (cur_choice_inxs[i] != inx)
                _a.push(cur_choice_inxs[i]);
        }
        cur_choice_inxs = _a;
    }
}
/**
 * 公布答案
 */
function showWorkspaceSolution() {
	
    $('div[id*=' + circleID + ']').hide();
    // 显示用户答案的className
    var user_class_name = 'text_correct';
    // 正确答案显示的文本
    var txt_correct = 'Correct Answer is ';
    // 用户答案的显示文本
    var txt_user = 'Your Choice ';
    // 如果没有选择答案
    if (cur_choice_inxs.length < 1) {
        $('#' + solutionUserID).hide();
        $('#' + solutionCorrectID).text(txt_correct + translateLetter(correct_inxs)).show();
    } else {
        // 如果用户答案和正确答案不相同
        if (!isCorrect()) {
            user_class_name = 'text_wrong';
            txt_user = txt_user + translateLetter(cur_choice_inxs) + ' is Wrong';
            $('#' + solutionCorrectID).text(txt_correct + translateLetter(correct_inxs)).show();
        } else {
            $('#' + solutionCorrectID).hide();
            txt_user = txt_user + translateLetter(cur_choice_inxs) + ' is Correct';
        }
        $('#' + solutionUserID).text(txt_user).attr('class', '').addClass(user_class_name).show();
    }
    $('#solution').show();
    // 显示solution结束

    // 显示提示
    $('.choice_tip').show();
    $('.choice_discussion').show();

    // 设置答案图标
    var _tempId = 'your-choice';
    $('.choice_letter', '#' + choicesID).each(function (index) {
        if (isCorrectInx(index)) {
            $(this).parent().addClass('text_correct');
            // 如果用户的答案是正确的
            if (isUserChoiceInx(index) && !$('#' + _tempId + index)[0]) {
                $(this).parent().before('<tr id="' + _tempId + index + '"><td colspan=2 class="text_correct">Your Choice:</td></tr>');
            }
            var left = ($(this).offset().left + 1) + 'px';
            var top = ($(this).offset().top + 4) + 'px';

			$('#' + correctID + index).show();
            //$('#' + correctID + index).show().css('left', left).css('top', top);
        } else if (isUserChoiceInx(index)) {
            $(this).parent().addClass('text_wrong');
            if (!$('#' + _tempId + index)[0])
                $(this).parent().before('<tr id="' + _tempId + index + '"><td colspan=2 class="text_wrong">Your Choice:</td></tr>');
            var left = ($(this).offset().left - 4) + 'px';
            var top = ($(this).offset().top - 2) + 'px';
			$('#' + circleID + index).show();
            //$('#' + circleID + index).show().css('left', left).css('top', top);
        }
    });
}
/**
 * 界面重置
 */
function reset() {
    freshPassageHtmlWorkspace('');
    freshQuestionContent('');
    $('#' + choicesID).html('');
    $('#' + solutionUserID).html('');
    $('#' + solutionCorrectID).html('');
    $('#solution').hide();
    $('div[id*=' + circleID + ']').remove();
    $('div[id*=' + correctID + ']').remove();
    cur_choice_inxs = [];
    correct_inxs = [];
}
/**
*清除用户的选择
*/
function reset_user_choice(){
	cur_choice_inxs = [];
}


function translateLetter(inx) {
    if (inx.length) {
        var rs = '';
        for (var i = 0; i < inx.length; i++) {
            if (i > 0)
                rs += ',';
            rs += String.fromCharCode(97 + parseInt(inx[i])).toUpperCase();
        }
        rs = '(' + rs + ')';
        return rs;
    } else
        return  '(' + String.fromCharCode(97 + parseInt(inx)).toUpperCase() + ')';
}

function reload(){
    window.webview.notifyJSReload('true');
	location.reload();
}


function screenWidthHeight() {
	
    var a = document.getElementById("div_body").offsetHeight;
    window.webview.notifyHeightChanged(a);
}
/**
 * 为每个答案创建圆图标
 */
function createCircleIcon() {
	/*
    var html = '';
    $('.choice_letter', '#' + choicesID).each(function (index) {
        var left = ($(this).offset().left - 4) + 'px';
        var top = ($(this).offset().top - 2) + 'px';
        html += '<div id="' + circleID + index + '" class="choice_icon" style="left:' + left + ';top:' + top + '"><img src="circle.png" width="24px" height="24px"/></div>';
    });
    $('body').append(html);
	*/
}
/**
 * 为正确答案创建图标
 */
function createCorrectIcon() {
	/*
    var html = '';
    $('.choice_letter', '#' + choicesID).each(function (index) {
        if (isCorrectInx(index)) {
            var left = ($(this).offset().left + 1) + 'px';
            var top = ($(this).offset().top + 4) + 'px';
            html += '<div id="' + correctID + index + '" class="choice_icon" style="left:' + left + ';top:' + top + '"><img src="select.png" width="24px" height="24px"/></div>';
        }
    });
    $('body').append(html);
	*/
}
/**
 * 当前传进来的下标，是否为正确下标
 * @param inx
 */
function isCorrectInx(inx) {
    return existInArray(correct_inxs, inx);
}
/**
 * 当前下标是否属于用户的选择
 * @param inx
 * @return {*}
 */
function isUserChoiceInx(inx) {
    return existInArray(cur_choice_inxs, inx);
}
/**
 * value 是否在数组_array中存在
 * @param _array
 * @param value
 */
function existInArray(_array, value) {
    var rs = false;
    for (var i = 0; i < _array.length; i++) {
        if (value == _array[i]) {
            rs = true;
            break;
        }
    }
    return rs;
}
/**
 * 用户的选择和正确答案是否一致
 */
function isCorrect() {
    var rs = true;
    if (cur_choice_inxs.length != correct_inxs.length) return false;
    for (var i = 0; i < cur_choice_inxs.length; i++) {
        if (!isCorrectInx(cur_choice_inxs[i])) {
            rs = false;
            break;
        }
    }
    return rs;
}
function oneColumn() {
	html =  '<div id="content1"> </div> <br> <br> \
				 <div id="content2"> \
                    <div id="question"></div> \
                    <br/> \
                    <div id="choices"></div> \
                    <br/> \
                    <div id="solution"> \
                        <p id="user_solution" class="text_wrong"></p> \
                        <p id="correct_solution" class="text_correct"></p> \
                        <p id="solution_details"></p> \
                    </div> \
					<br><br> \
                </div>';    
	$('#div_body').html(html);
}
function twoColumn() {

	html = '<table width="100%" > \
        <tr> \
            <td width="2px"></td> \
            <td width="385px" valign="top"> \
                <div id="content1"> \
                </div> <br><br>\
            </td> \
            <td width="6px"></td> \
            <td valign="top"> \
                <div id="content2"> \
                    <div id="question"></div> \
                    <br/> \
                    <div id="choices"></div> \
                    <br/> \
                    <div id="solution"> \
                        <p id="user_solution" class="text_wrong"></p> \
                        <p id="correct_solution" class="text_correct"></p> \
                        <p id="solution_details"></p> \
                    </div> \
                </div> \
                <br><br> \
            </td> \
            <td >&nbsp;</td> \
        </tr> \
    </table>';
    
    $('#div_body').html(html);
    $("#div_body").trigger("create");
}

var questionScroll;

function loaded() {
		console.log("loaded() called.");
		questionScroll = new iScroll('wrapper_workspace');
		
		setTimeout(function(){
			questionScroll.refresh();
		},1000);
}

function refreshWorkspaceList(){
	console.log("refreshWorkspaceList() called.");
	//$("#div_body").trigger("create");
	setTimeout(function(){
			questionScroll.refresh();
			updateCanvasWidthAndHieght(questionScroll.scrollerW,questionScroll.scrollerH);
		},100);
}
//note:once change this two attributes of canvas ,the canvas will be restructed and all the data will gone.
//so just invoke this method properly.
function updateCanvasWidthAndHieght(width,height){
	
	$("#can").attr("width",width);
	$("#can").attr("height",height);
	$("#canvas_container").css("width",width+"px");
	$("#canvas_container").css("height",height+"px");
}

document.addEventListener('touchmove', function(e) {
		e.preventDefault();
	}, false);
document.addEventListener('DOMContentLoaded', loaded, false);

function showCanvas(){
	console.log("problemfull.html-->showCanvas() called.");
	drawer.offset = Math.abs(questionScroll.y);
	$("#canvas_container").show();
	$("#canvas_container").css("z-index",999);
	questionScroll.disable();
}

function hideCanvas(){
	console.log("problemfull.html-->hideCanvas() called.");
	$("#canvas_container").hide();
	questionScroll.enable();
}

function switchPenOn(){
	console.log("switchPenOn() called.");
	drawer.offset = Math.abs(questionScroll.y);
	//make scrolling disable
	questionScroll.disable();
	//make drawer disable.
	drawer.enable = true;
	showCanvas();
	penOn(1);
}

function penOff(){
	console.log("problemfull.html-->penOff() called.");
	questionScroll.enable();
	//make drawer disable.
	drawer.enable = false;
}