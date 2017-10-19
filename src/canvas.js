const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

var ball;
var ballNumber = 100;
var ballsBass = Math.floor(ballNumber / 3);
var ballsKick = Math.floor((ballNumber - ballsBass) / 2);
var ballsMelody = ballNumber - (ballsBass + ballsKick);
var ballArray = [];
var friction = 0.75;
var gravity = 1;

addEventListener('resize', () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	init();
});


function randomIntFromRange(min,max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const colors = [
	'#2185C5',
	'#7ECEFD',
	'#FFF6E5',
	'#FF7F66'
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



function init() {
	// Draw background rectangle
	c.beginPath();
	c.rect(0,0,canvas.width,canvas.height);
	c.fillStyle = 'rgb(29, 29, 29)';
	c.fill();
	c.closePath();

	// Clear tab while resizing the canvas
	ballArray = [];

	var radius = 30;
	var x = randomIntFromRange(radius, canvas.width - radius);
	var y = randomIntFromRange(0, canvas.height - radius);
	var vx = randomIntFromRange(-10, 10);

	for (var k = 0; k < ballsBass; k++) {
		ballArray.push(new Ball(x, y, vx, 3, 30, 'red'))
	}

	for (var k = 0; k < ballsKick; k++) {
		ballArray.push(new Ball(x, y, vx, 3, 30, 'blue'))
	}

	for (var k = 0; k < ballsMelody; k++) {
		ballArray.push(new Ball(x, y, vx, 3, 30, 'green'))
	}

	// First explosion
	setTimeout(function () {
		ballArray.forEach(ball => {
			ball.vx = randomIntFromRange(-10, 10);
			ball.vy = randomIntFromRange(0, 50);
		})
	}, 6000);
}



function animate() {
	requestAnimationFrame(animate);
	c.fillStyle = 'rgba(29, 29, 29, 0.5';
	c.fillRect(0, 0, canvas.width, canvas.height);

	ballArray.forEach(ball => {
		ball.update();
	})
}

init();
animate();