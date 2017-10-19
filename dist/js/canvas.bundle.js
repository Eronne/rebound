/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

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

addEventListener('resize', function () {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	init();
});

function randomIntFromRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

var colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

// Object
function Ball(x, y, vx, vy, radius, color) {
	var _this = this;

	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.radius = radius;
	this.color = color;

	this.update = function () {
		// Gravity of the ball
		if (_this.y + _this.radius + _this.vy > canvas.height) {
			_this.vy = -_this.vy * friction;
			_this.vx = _this.vx * friction;
		} else {
			_this.vy += gravity;
		}

		if (_this.x + _this.radius + _this.vx > canvas.width || _this.x - _this.radius <= 0) {
			_this.vx = -_this.vx * friction;
		}

		_this.x += _this.vx;
		_this.y += _this.vy;
		_this.draw();
	};

	this.draw = function () {
		c.beginPath();
		c.arc(_this.x, _this.y, _this.radius, 0, Math.PI * 2, false);
		c.fillStyle = _this.color;
		c.stroke();
		c.fill();
		c.closePath();
	};
}

function init() {
	// Draw background rectangle
	c.beginPath();
	c.rect(0, 0, canvas.width, canvas.height);
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
		ballArray.push(new Ball(x, y, vx, 3, 30, 'red'));
	}

	for (var k = 0; k < ballsKick; k++) {
		ballArray.push(new Ball(x, y, vx, 3, 30, 'blue'));
	}

	for (var k = 0; k < ballsMelody; k++) {
		ballArray.push(new Ball(x, y, vx, 3, 30, 'green'));
	}

	// First explosion
	setTimeout(function () {
		ballArray.forEach(function (ball) {
			ball.vx = randomIntFromRange(-10, 10);
			ball.vy = randomIntFromRange(0, 50);
		});
	}, 6000);
}

function animate() {
	requestAnimationFrame(animate);
	c.fillStyle = 'rgba(29, 29, 29, 0.5';
	c.fillRect(0, 0, canvas.width, canvas.height);

	ballArray.forEach(function (ball) {
		ball.update();
	});
}

init();
animate();

/***/ })
/******/ ]);
//# sourceMappingURL=canvas.bundle.js.map