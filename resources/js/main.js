$(document).ready(function(){
	restart();
	//only for testing
	$('.title').click(renderAnswer);
});


/* Constants */

const GREY = 'rgb(200, 200, 200)';

const BLACK = 'rgb(33, 37, 41)';

const RED = 'rgb(224, 59, 14)'//'rgb(255, 81, 93)';
const REDHEX = '#E03B0E'//'#ff515d';

const GREEN = 'rgb(88, 148, 17)'; //'#589411';
const GREENHEX = '#589411';

const BLUEHEX = '#2340A1';
const BLUE = 'rgb(35, 64, 161)'; //'rgb(81, 180, 255)'

const YELLOWHEX = '#E0C80E';
const YELLOW = 'rgb(224, 200, 14)'; //'rgb(247, 235, 73)'

const COLORS = ['rgb(255, 251, 240)', BLACK, RED, GREEN, BLUE, YELLOW];


/* Variables */

var difficulty = 0; // 0 = easy, 1 = hard

var answer = createAnswer();

var turn = 10;

var flag = true;

var timer = setInterval(function(){
	timer++;
}, 1000);

/* Functions */

function restart() {
	$('#game').empty();
	addTurn();
	selectFirstChild();
	createAnswer();
	turn = 10;
	timer = 0;
	flag = true;
	//reset turn counter and return color to black
	$('#turn').empty().append('<h5>' + turn + '</h5>').css('color', '#212529');
	$('.answer i').css('opacity', '0');
	$('.question-mark').css({'opacity':'1', 'color':BLACK});
	clearInterval(timer);
};

function onWin() {
		renderAnswer();
		removeGuessHandlers();
		highScore();
}


function createAnswer() {
	if (difficulty === 0) {
		var answer = createAnswerEasy();
	} else {
		var answer = createAnswerHard();
	}
	return answer;
}

function createAnswerEasy() {
	var possibleColors = COLORS.slice();
	answer = [];

	for (i = 0; i < 4; i++) {
		var max = possibleColors.length - 1;
		var randomNumber = Math.floor(Math.random() * (max + 1));
		var randomColor = possibleColors[randomNumber];
		answer.push(randomColor);
		possibleColors.splice(randomNumber, 1);
	}
	$('#difficulty').html('<h5>Easy</h5>').css('color', GREEN);
	$('.header-2').css('box-shadow', '0px 1px 2px ' + GREENHEX + ', 0px -1px 2px' + GREENHEX);
	return answer;
}

function createAnswerHard() {
	var possibleColors = COLORS.slice();
	answer = [];

	for (i = 0; i < 4; i++) {
		var randomNumber = Math.floor(Math.random() * (5 + 1));
		var randomColor = possibleColors[randomNumber];
		answer.push(randomColor);
	}
	$('#difficulty').html('<h5>Hard</h5>').css('color', RED);
	$('.header-2').css('box-shadow', '0px 1px 2px ' + REDHEX + ', 0px -1px 2px' + REDHEX);

	return answer;
}

	/* Render functions */

function renderAnswer() {
	for (i = 0; i < 4; i++) {
		$('.answer-' + (i+1)).children().css('color', answer[i]);
		$('.answer i').css('opacity', '1');
		$('.question-mark').css('opacity', '0');
	}
}

function renderGuessLClick() {
	var $color = $(this).children().css('color');
	var $colorIndex = COLORS.indexOf($color);

	if (($color === GREY) || ($colorIndex === COLORS.length-1)) {
	$(this).children().animate({color: COLORS[0]}, 100);
	} else {
		$(this).children().animate({color: COLORS[$colorIndex + 1]}, 100);
	}
}

function renderGuessRClick() {
	event.preventDefault();
	var $color = $(this).children().css('color');
	var $colorIndex = COLORS.indexOf($color);

	if (($color === GREY) || ($colorIndex === 0)) {
		$(this).children().animate({color: COLORS[COLORS.length-1]}, 100);
	} else {
		$(this).children().animate({color: COLORS[$colorIndex - 1]}, 100);
	}
}

function confirmGuess() {
	var guess = [];

	for (i = 1; i < 5; i++) {
		var g = $('.guesses:first .guess-' + i).children().css('color');
		guess.push(g);
	}
	$('.confirm i').css('color', GREEN);

//compare guess and answer
	var indicatorPins = [];
	var hits = 0;
	var tempAnswer = answer.slice();

	for (guessIndex = 0; guessIndex < guess.length; guessIndex++) {
		if (guess[guessIndex] === tempAnswer[guessIndex]) {
			//add a white pin to indicatorPins
			indicatorPins.push('white');
			guess.splice(guessIndex, 1);
			tempAnswer.splice(guessIndex, 1);
			guessIndex--;
			hits++;
		}
	}
	for (guessIndex = 0; guessIndex < guess.length; guessIndex++) {
		for (answerIndex = 0; answerIndex < tempAnswer.length; answerIndex++) {
			if (guess[guessIndex] === tempAnswer[answerIndex]) {
				indicatorPins.push(BLACK);
				guess.splice(guessIndex, 1);
				tempAnswer.splice(answerIndex, 1);
				guessIndex--;
				answerIndex--;
			}
		}
	}

	//render indicatorPins
	i = 0;
	renderIndicatorPins();

	function renderIndicatorPins() {
		setTimeout(function(){
			$('.indicatorpins:first .pin-' + (i + 1)).animate({color: indicatorPins[i]}, 300);
			i++;
			if (i < indicatorPins.length) {
				renderIndicatorPins();
			} else {
				//remove old click handlers
				removeGuessHandlers();
				//return if won
				if (hits === 4) {
					setTimeout(function(){
						onWin();
						return;
					}, 800);
					flag = false;
				}
				if (flag) {
					//count down turn # and terminate if turns are up
					turn--;
					$('#turn').empty().append('<h5>' + turn + '</h5>');
					if (turn === 0) {
						$('#turn').css('color', RED);
						renderAnswer();
						removeGuessHandlers();
						return;
					}
					//add one more turn to top of game
					addTurn();
					//select new handlers
					selectFirstChild();
				}

			}
		}, 400);
	};
}

function addTurn() {
var oneTurn =	'<div class="try grid-parent">' +
							'<div class="indicatorpins grid-left">' +
							'	 <div class="row">' +
							'		 <i class="pin-1 fa fa-map-pin fa-2x"></i>' +
							'		 <i class="pin-2 fa fa-map-pin fa-2x"></i>' +
							'	 </div>' +
							'	 <div class="row">' +
							'		 <i class="pin-3 fa fa-map-pin fa-2x"></i>' +
							'		 <i class="pin-4 fa fa-map-pin fa-2x"></i>' +
							'	 </div>' +
							'	</div>' +
							' <div class="guesses grid-middle">' +
							'	 <div class="guess-1 col-3"><i class="fa fa-map-pin fa-3x"></i></div>' +
							'	 <div class="guess-2 col-3"><i class="fa fa-map-pin fa-3x"></i></div>' +
							'	 <div class="guess-3 col-3"><i class="fa fa-map-pin fa-3x"></i></div>' +
							'	 <div class="guess-4 col-3"><i class="fa fa-map-pin fa-3x"></i></div>' +
							' </div>' +
							' <div class="confirm grid-right">' +
							'	 <i class="fa fa-check fa-2x"></i>' +
							' </div>' +
							'</div>';


$(oneTurn).addClass('invisible').prependTo('#game');
setTimeout(function(){
		$('.try:first-of-type').removeClass('invisible');
}, 500);
}



/* Modal setup */

var infoBtn = document.getElementById('infoBtn');
var close = document.getElementsByClassName('close');
var modal = document.getElementsByClassName('modal');
var infoModal = document.getElementById('infoModal');

function closeModals() {
	$('#infoModal').fadeOut('fast');
	$('#winModal').fadeOut('fast');
}

infoBtn.onclick = function() {
	$('#infoModal').fadeIn('fast');
}

$('.close').click(function(){
	closeModals();
});

window.onclick = function(event) {
	if (event.target == infoModal || event.target == winModal) {
		closeModals();
	}
}

$(document).keyup(function(e){
	if (e.which == 27) {
		closeModals();
	}
});


	/* Handler functions */

function changeDifficulty(){
	if (difficulty === 0) {
		difficulty = 1;
		createAnswer();
	} else {
		difficulty = 0;
		createAnswer();
	}
	restart();
};

function selectFirstChild() {
	for (i = 1; i < 5; i++) {
		$('.guesses:first .guess-' + i).click(renderGuessLClick).contextmenu(renderGuessRClick);
	}

	$('.confirm:first .fa-check').one('click', (confirmGuess));
	$('.try:first').contextmenu(function(){
		event.preventDefault();
	});
}

function removeGuessHandlers() {
	for (i = 1; i < 5; i++) {
		$('.guesses:first .guess-' + i).off();
	}
	$('.confirm:first .fa-check').off();
}


/* Score functions */

function highScore() {
	/* Current score */
	var minutes = Math.floor((timer) / 60);
	var seconds = (timer) % 60;
	minutes = (minutes < 10) ? '0' + minutes : minutes;
	seconds = (seconds < 10) ? '0' + seconds : seconds;
	var tries = 11-turn;
	if (tries === 1) {
		$('#win-turns').html('You guessed the right combination in 1 try.');
	} else {
		$('#win-turns').html('You guessed the right combination in ' + tries + ' tries.');
	}
	$('#win-timer').html('It took you ' + minutes + ':' + seconds + '.');

	/* High score */
	var prefix = (difficulty == 0) ? 'green' : 'red';
	var lsTries = localStorage.getItem(prefix + 'tries');
	var lsTimer = localStorage.getItem(prefix + 'timer');
	if (typeof(Storage) !== "undefined") {
	    // Code for localStorage/sessionStorage.

			if (!lsTries || lsTries > tries || (lsTries == tries && lsTimer > timer)) {
				console.log("new high score set");
				localStorage.setItem(prefix + 'tries', tries);
				localStorage.setItem(prefix + 'timer', timer);
			}

			var hsTries = localStorage.getItem(prefix + 'tries');
			var hsMinutes = Math.floor((Number(localStorage.getItem(prefix + 'timer')) / 60));
			var hsSeconds = localStorage.getItem(prefix + 'timer') % 60;
			hsMinutes = (hsMinutes < 10) ? '0' + hsMinutes : hsMinutes;
			hsSeconds = (hsSeconds < 10) ? '0' + hsSeconds : hsSeconds;

			var hsHtml = 'Your high score on the ' + prefix + ' difficulty is ' + hsTries + ' tries in ' + hsMinutes + ':' + hsSeconds + '.';
			$('#highscore').html(hsHtml);
	}
	$('#winModal').fadeIn('slow');
}

function resetScore() {
	localStorage.removeItem('tries');
	localStorage.removeItem('timer');
	$('#status').html('High score reset.')
	console.log("High score reset.");
}
