function MainApp () {
	$("#btn-wrapper-holder").html('<button disabled class="btn submit" id="btn-done">Submit</button>' +
	//'<button disabled class="btn btn-primary" id="btn-next">Next</button>' +
	//'<button disabled class="btn btn-primary" id="btn-tryagain">Try Again</button>' +
	'<button disabled class="btn btn-primary" id="btn-hint">Answer</button>' +
	'<button disabled class="btn btn-primary" id="btn-answers">Solution</button>'
	/*  + '<button disabled class="btn btn-primary" id="btn-again">Reset</button>' */
	)


	this.appTitle = document.getElementById('app-title');
	this.appInstruction = document.getElementById('app-instruction');
	this.handlerBar = document.getElementById('handler-bar');
	this.btnDone = document.getElementById('btn-done');
	this.btnTryAgain = document.getElementById('btn-tryagain');
	this.btnAnswer	= document.getElementById('btn-answers');
	this.feedback = document.getElementById('feedback-text');
	this.feedbackBox = document.getElementById('modal-feedback');
	this.btnAnswer.addEventListener('click', this.submitCorrect);

	this.current = 0;
	this.attempt = 0;
	
	this.init();
}

MainApp.prototype.init = function() {
	$('title').html(MASTER_DB.CONFIG.TITLE);
	this.appTitle.innerHTML = MASTER_DB.CONFIG.TITLE;
	$("#activity_title").html(MASTER_DB.CONFIG.TITLE);
	this.appInstruction.innerHTML = MASTER_DB.CONFIG.INSTRUCTION;
	$("#instruction-info").html('<li>' + MASTER_DB.CONFIG.INSTRUCTIONS.join("</li><li>") + '</li>');
	
	this.total = MASTER_DB.QUESTIONS.length;
	this.loadQuestion(this.current);
	this.loadAudio();
	
	$('#optionsInput').on('click', '.radio', this.enableDoneBtn);
	$('#btn-done').on('click', this.submitAns);
	$('#btn-next').on('click', this.nextQuestion);
	$('#btn-tryagain').on('click', this.submitAgain);
	$('#btn-hint').on('click', this.showHint);
	$('#btn-answers').on('click', this.submitCorrect);

	$('.list__item').on('click', function (e) {
		$('.list__item.active').removeClass('active');
		$(this).addClass('active');
	});
};

MainApp.prototype.loadAudio = function() {
	this.audioCorrectList = [];
	this.audioIncorrectList = [];
	this.audioCompleteList = [];

	var AUDIO_COMPLETE = MASTER_DB.AUDIO.COMPLETE;
	for(var i=0; i<AUDIO_COMPLETE.length; i++) {
		var id = "complete-" + i;
		this.audioCompleteList.push(id);
		soundManager.createSound({
			id:id,
			url:AUDIO_COMPLETE[i],
			autoLoad:true,
			autoPlay:false
		});
	}

	var AUDIO_POSITIVE = MASTER_DB.AUDIO.POSITIVE;
	for(var i=0; i<AUDIO_POSITIVE.length; i++) {
		var id = "positive-" + i;
		this.audioCorrectList.push(id);
		soundManager.createSound({
			id:id,
			url:AUDIO_POSITIVE[i],
			autoLoad:true,
			autoPlay:false
		});
	}

	var AUDIO_NEGATIVE = MASTER_DB.AUDIO.NEGATIVE;
	for(var i=0; i<AUDIO_NEGATIVE.length; i++) {
		var id = "negative-" + i;
		this.audioIncorrectList.push(id);
		soundManager.createSound({
			id:id,
			url:AUDIO_NEGATIVE[i],
			autoLoad:true,
			autoPlay:false
		});
	}
};

MainApp.prototype.playAudio = function(type) {
	var randomIndex = Math.floor(Math.random() * this[type].length);
	var id = this[type][randomIndex];
	soundManager.stopAll();
	soundManager.getSoundById(id).play();
	return randomIndex;
}

MainApp.prototype.loadQuestion = function(index) {

	var dataHTML = "";
	var dataObj = MASTER_DB.QUESTIONS[index];
	
	$('.attempt-incorrect').removeClass('attempt-incorrect');
	$('.attempt-correct').removeClass('attempt-correct');
	$("input[type='radio']:checked").prop('checked', false);
	$("#btn-next").attr('disabled', 'disabled');
	$(".question-section").removeClass('blocker');
	//$("#modal-feedback").hide();
	if(typeof this.app === 'undefined') {
		this.app = new Vue({
			el: '#devilz-content',
			data: {
				q: dataObj
			}
		})
	} else {
		Vue.set(this.app, 'q', dataObj);
	}
	
	this.attempt = 0;

	$('.question-section').removeClass('animated bounceInRight');
	setTimeout(function() {
		$('.question-section').addClass('animated bounceInRight');
	}, 10);
	$(".list__item.active").removeClass('active');
	
	$('.blinking').css('visibility', 'visible');
	$('.blinking').removeClass('blinking');
	$('.feedback_img').hide();
	$("#btn-next").attr('disabled', 'disabled');
	$("#btn-tryagain").attr('disabled', 'disabled');
	$("#btn-again").attr('disabled', 'disabled');
	$("#btn-done").attr('disabled', 'disabled');
	$('#btn-hint').attr('disabled', 'disabled');
};

MainApp.prototype.enableDoneBtn = function (e) {
	if($('input[type="radio"]:checked').length)
		$("#btn-done").removeAttr('disabled')
};

MainApp.prototype.submitAns = function () {
	var _this = MasterApp;
	$("#btn-again").removeAttr('disabled', 'disabled');
	
	$('.attempt-incorrect').removeClass('attempt-incorrect');
	
	var isCorrect;
	var $itemEle = $('input[type="radio"]:checked').parents('li');
	
	var ans = $itemEle.find('.secrectkey').text();
	console.log(ans);
	$("#feedback-correct, #feedback-incorrect").hide();
	if(ans == "true") {
		isCorrect = true;
		$itemEle.addClass('attempt-correct');
		_this.playAudio('audioCorrectList');
		$("#feedback-correct").show();
	} else {
		isCorrect = false;
		$itemEle.addClass('attempt-incorrect');
		_this.playAudio('audioIncorrectList');
		$("#feedback-incorrect").show();
	}

	try {
		clearTimeout(kidTimeout);
	} catch(e) {}
	$('.feedback_img').show();
	window.kidTimeout = setTimeout(function() {
		$('.feedback_img').hide();
		$("#feedback-correct, #feedback-incorrect").hide();
	}, MASTER_DB.CONFIG.FEEDBACK_TIME);
	
	if(!isCorrect) {
		$("#btn-tryagain").removeAttr('disabled');
		
		_this.attempt++;
		if(_this.attempt >= MASTER_DB.CONFIG.HINT) {
			$("#btn-hint").removeAttr('disabled'); 			
			$("#btn-tryagain").attr('disabled', 'disabled');
		}
	} else {
		_this.checkForNext();
	}

	var feedbackObj = _this.app.q.feedback;
	if(typeof feedbackObj == "object") {
		var feedbackHTML = isCorrect ? feedbackObj.positive : feedbackObj.negative;
		$("#feedback-text").html(feedbackHTML);
		setTimeout(function() {
			/*$("#feedback-text").html('<img src="img/character.png">');*/
		}, 4000);
		//$("#modal-feedback").show();
	}
	
	$("#btn-done").attr('disabled', 'disabled');
	//$(".question-section").addClass('blocker');
};
	//Netxt btn active and go to next question
MainApp.prototype.checkForNext = function () {
	if(this.total == this.current + 1) {
		var _this = this;	
		setTimeout(function() {
			$("body").addClass('completed');
			$("#btn-answers").removeAttr('disabled');
			$("#btn-again").removeAttr('disabled');
		}, MASTER_DB.CONFIG.RESULT_TIME);
	} else {
		setTimeout(function() {
			 var _this = MasterApp;
		
			if(_this.total == _this.current + 1) {
			} else {
				_this.loadQuestion(++_this.current);
			} 
		}, 3000);  
	}
};

MainApp.prototype.nextQuestion = function() {
	var _this = MasterApp;
	
	if(_this.total == _this.current + 1) {
	} else {
		_this.loadQuestion(++_this.current);
	}
	console.log(_this.total, _this.current)
};

MainApp.prototype.submitAgain = function () {	
	$('.attempt-incorrect').removeClass('attempt-incorrect');
	$('.attempt-correct').removeClass('attempt-correct');
	$("input[type='radio']:checked").prop('checked', false);
	$("#btn-next").attr('disabled', 'disabled');
	$("#btn-tryagain").attr('disabled', 'disabled');
	$("#btn-done").attr('disabled', 'disabled');
	$("#btn-hint").attr('disabled', 'disabled');
	$(".question-section").removeClass('blocker');
	$('.list__item.active').removeClass('active');
};

MainApp.prototype.showHint = function () {
	$("#btn-hint").attr('disabled', 'disabled');
	var _this = MasterApp;

	var rightEles = $('#optionsInput').find('li').map(function() {
		var val = $(this).find('.secrectkey').text();
		if(val == 'true')
			return this;
	}).get();
	$(rightEles).addClass('blinking');
	
	var intervalHolder;
	$('.blinking').each(function() {
		var elem = $(this);
		intervalHolder = setInterval(function() {
			if (elem.css('visibility') == 'hidden') {
				elem.css('visibility', 'visible');
			} else {
				elem.css('visibility', 'hidden');
			}    
		}, 500);
	});
	
	setTimeout(function() {
		clearInterval(intervalHolder);
		$('.blinking').css('visibility', 'visible');
		$('.blinking').removeClass('blinking');
		if(MasterApp.current+1 == MasterApp.total) {
			MasterApp.checkForNext();
		} else {
			$("#btn-next").removeAttr('disabled');
		}
	}, 3100);
	$("#btn-tryagain").attr('disabled', 'disabled');
}
	

MainApp.prototype.submitCorrect = function () {
	var _this = MasterApp;
	$("#area-action").hide();
	$("#area-static").show(); 
	var qs = MASTER_DB.QUESTIONS;
	var ansHTML = "";
	for(var i=0; i<qs.length; i++) {
		ansHTML += '<tr><td><p class="ans-opt-static">' + (i+1) + '. ' + qs[i].title + '</p></td><td>' + _this.getAns(qs[i].options) + '</td></tr>';
	}
	$("#gatherAnswer tbody").html(ansHTML);
	$("#btn-answers").attr('disabled', 'disabled');
	$("#btn-again").removeAttr('disabled', 'disabled');
	$("#app-instruction").text('');
	

	var obj = MasterApp.app.q;
	obj.title = MASTER_DB.ANSWERS.INSTRUCTION;
	//$("#ans-title").html(MASTER_DB.ANSWERS.INSTRUCTION);
	Vue.set(MasterApp.app, 'q', obj);
	$("#btn-again").removeAttr('disabled');
	$("body").addClass('gamecompleted-screen');
	$("#screen-result").hide();
	$("#screen-gameplay").show();
};

MainApp.prototype.playAgain = function() {
	window.location.reload();
};

MainApp.prototype.getAns = function (opts) {
	var result = [];
	for(var key in opts) {
		if(opts[key] == true)
			result.push(key);
	}
	return result.join(", ")
};

function closeModal (eleId) {
	$("#" + eleId).fadeOut();
}

var MasterApp;
$(document).ready(function(e) {
	MasterApp = new MainApp();

	$("#btn-again").click(function(e) {
		MasterApp.playAgain();
	});

});
