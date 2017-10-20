/*
 Canvas stuff
 */
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
var canvasWith = window.innerWidth;
var canvasHeight = window.innerHeight;

/*
 Functions
 */
function fullScreen () {
    if(canvas.webkitRequestFullScreen) {
        canvas.webkitRequestFullScreen();
    }
    else {
        canvas.mozRequestFullScreen();
    }
}
document.getElementById('fullScreen').addEventListener('click', fullScreen);


function randomIntFromRange(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}



/*
 Audio Stuff
 */
window.AudioContext=window.AudioContext||window.webkitAudioContext||window.mozAudioContext;
var audioCtx = new AudioContext();
var audioBuffer;
var audioSource;
var analyser = audioCtx.createAnalyser();
var frequencyData = new Uint8Array(analyser.frequencyBinCount);

var bassValue = 115;
var kickValue = 65;
var melodyValue = 4;
var timeToBegin = 3000;

// Time stuff
var DELTA_TIME = 0;
var LAST_TIME = Date.now();

// To delete
var opts = {
    barWidth: 10
}



/*
 Ball Stuff
 */
var ballNumber = 100;
var ballsTypes = 3;
var ballsArray = [];
var ballsBassArray = [];
var ballsKickArray = [];
var ballsMelodyArray = [];

var ball;
var radius = 45;
var opacity = 0.7;
var friction = 0.6;
var gravity = 3;

var beginningX = canvas.width / 2;
var beginningY = canvas.height / 2;
var beginningVx = 0;
var beginningVy = 3;

var ballsBass = Math.floor(ballNumber / 3);
var ballsKick = Math.floor((ballNumber - ballsBass) / 2);
var ballsMelody = ballNumber - (ballsBass + ballsKick);

const colors = [
    'rgb(136,216,176)',
    'rgba(255,238,173,' + opacity + '',
    'rgba(255,111,105,' + opacity + ''
];



// Object
function Ball(x, y, vx, vy, radius, color) {
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.radius = radius;
	this.color = color;

	this.update = () => {
		// Gravity of the ball
		if (this.y + this.radius + this.vy > canvas.height) {
			this.vy = -this.vy * friction;
			this.vx = this.vx * friction;
		} else {
			this.vy += gravity
		}

		if (this.x + this.radius + this.vx > canvas.width || this.x - this.radius <= 0) {
			this.vx = -this.vx * friction
		}

		this.x += this.vx;
		this.y += this.vy;
		this.draw();
	};

	this.draw = () => {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fillStyle = this.color;
		c.stroke();
		c.fill();
		c.closePath();
	};
}



function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', './sounds/sound.mp3', true);
    request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function() {

        audioCtx.decodeAudioData(request.response, function(buffer) {

            // success callback
            audioBuffer = buffer;

            // Create sound from buffer
            audioSource = audioCtx.createBufferSource();
            audioSource.buffer = audioBuffer;

            // connect the audio source to context's output
            audioSource.connect( analyser )
            analyser.connect( audioCtx.destination )
            frame()

        }, function(){

            // error callback
            //
        });
    }
    request.send();
}



function init() {
	// Draw background rectangle
	c.beginPath();
	c.rect(0,0,canvas.width,canvas.height);
	c.fillStyle = 'rgb(29, 29, 29)';
	c.fill();
	c.closePath();

	// Clear tab while resizing the canvas
	ballsArray = [];

	for (var i = 0; i < ballsBass; i++) {
		ballsArray.push(new Ball(beginningX, beginningY + 8, beginningVx, beginningVy, radius - 8 , colors[0]))
	}

	for (var i = 0; i < ballsKick; i++) {
		ballsArray.push(new Ball(beginningX, beginningY + 4, beginningVx, beginningVy, radius - 4, colors[1]));
	}

	for (var i = 0; i < ballsMelody; i++) {
		ballsArray.push(new Ball(beginningX, beginningY, beginningVx, beginningVy, radius, colors[2]));
	}

	// Slice ballsArray for 3 independent tabs
    ballsBassArray = ballsArray.slice(1, ballsBass);
    ballsKickArray = ballsArray.slice(ballsBass, ballsBass + ballsKick);
    ballsMelodyArray = ballsArray.slice(ballsBass + ballsKick, ballsArray.length);


    // First explosion
	setTimeout(function () {
		ballsArray.forEach(ball => {
			ball.vx = randomIntFromRange(-30, 30);
			ball.vy = randomIntFromRange(10, 100);
    	})
        audioSource.start();
    }, timeToBegin);
}



function frame() {
    requestAnimationFrame( frame )

    DELTA_TIME = Date.now() - LAST_TIME;
    LAST_TIME = Date.now();

    // analyser.getByteFrequencyData(frequencyData);
    analyser.getByteFrequencyData(frequencyData);


    c.fillStyle = 'rgba(29, 29, 29, 0.7';
    c.fillRect(0, 0, canvas.width, canvas.height);

    // Average frequencies
    var averageData = [];
    for (var i = 0; i <= (ballsTypes - 1); i++) {
        let currentAverage = 0;
        let cumul = 0;

        let begin = Math.floor( ((frequencyData.length - 1) / ballsTypes) * i );
        let end = Math.floor( ((frequencyData.length - 1) / ballsTypes) * (i + 1));

        for (let j = begin; j < end; j++) {
            cumul += frequencyData[j];
        }

        currentAverage = cumul / (end - begin);
        averageData.push(currentAverage);
    }


    ballsArray.forEach(ball => {
        ball.update();
    })

    /**
     * Balls animations
     */
    if (averageData[0] > bassValue) {
        ballsBassArray.forEach(ball => {
            ball.vx = randomIntFromRange(-30, 30);
            ball.vy = randomIntFromRange(10, 80);
        })
    }

    if (averageData[1] > kickValue) {
        ballsKickArray.forEach(ball => {
            ball.vx = randomIntFromRange(-30, 30);
            ball.vy = randomIntFromRange(10, 80);
        })
    }

    if (averageData[2] > melodyValue) {
        ballsMelodyArray.forEach(ball => {
            ball.vx = randomIntFromRange(-30, 30);
            ball.vy = randomIntFromRange(10, 80);
        })
    }
}

init();
loadSound()