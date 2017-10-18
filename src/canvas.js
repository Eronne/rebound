// Initial Setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;


// Variables
const mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2 
};

const colors = [
	'#2185C5',
	'#7ECEFD',
	'#FFF6E5',
	'#FF7F66'
];

var ball;
var ballNumber = 100;
var ballArray = [];
var friction = 0.75;
var gravity = 1;


// Event Listeners
addEventListener('mousemove', event => {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

addEventListener('resize', () => {
	canvas.width = innerWidth;	
	canvas.height = innerHeight;

	init();
});


// Utility Functions
function randomIntFromRange(min,max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1;
    const yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}


// Objects
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
		c.stroke()
		c.fill();
		c.closePath();
	};
}


function init() {
	var radius = 30;
	for (var i = 0; i < ballNumber; i++) {
		var x = randomIntFromRange(radius, canvas.width - radius);
		var y = randomIntFromRange(0, canvas.height - radius);
		var vx = randomIntFromRange(-2, 2);
        ballArray.push(new Ball(x, y, vx, 3, 30, 'red'))
	}

	canvas.addEventListener('click', function (e) {
		ballArray.forEach(ball => {
            ball.vx = randomIntFromRange(-2, 2);
            ball.vy = randomIntFromRange(0, 50);
    	})
	})
}

// Animation Loop
function animate() {
	requestAnimationFrame(animate);
	c.fillStyle = 'rgba(255, 255, 255, 0.5';
	c.fillRect(0, 0, canvas.width, canvas.height);

	ballArray.forEach(ball => {
		ball.update();
	})
}

init();
animate();