"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
残タスク
・コントローラーの作成
・attachEventをaddEventListenerにbindする
→addEventListenerだけでattachEventをカバーできるようにする
*/

// bind polyfill
if (!Function.prototype.bind) {
	Function.prototype.bind = function (oThis) {
		if (typeof this !== "function") {
			// closest thing possible to the ECMAScript 5
			// internal IsCallable function
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}

		var aArgs = Array.prototype.slice.call(arguments, 1),
		    fToBind = this,
		    fNOP = function fNOP() {},
		    fBound = function fBound() {
			return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
		};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};
}

// addEventListener polyfill incomplete
// if(window.addEventListener){
// 	window.addEventListener = window.addEventListener;
// } else if(window.attachEvent){
// 	window.addEventListener = window.attachEvent;
// }

var ZAWA = ZAWA || {};
(function () {
	'use strict';

	var Throttle = function () {
		function Throttle(interval, callback) {
			_classCallCheck(this, Throttle);

			this._interval = interval;
			this._callback = callback;
			this._lastTime = 0;

			this._init();
		}

		_createClass(Throttle, [{
			key: "_init",
			value: function _init() {
				this._lastTime = new Date().getTime() - this._interval;
			}
		}, {
			key: "run",
			value: function run() {
				if (this._lastTime + this._interval <= new Date().getTime()) {
					this._lastTime = new Date().getTime();
					this._callback();
					return;
				}
			}
		}]);

		return Throttle;
	}();

	ZAWA.Throttle = Throttle;

	var Debounce = function () {
		function Debounce(interval, callback) {
			_classCallCheck(this, Debounce);

			this._interval = interval;
			this._callback = callback;
			this._timer = 0;
		}

		_createClass(Debounce, [{
			key: "run",
			value: function run() {
				var _this = this;

				clearTimeout(this._timer);
				this._timer = setTimeout(function () {
					_this._callback();
				}, this._interval);
			}
		}]);

		return Debounce;
	}();

	ZAWA.Debounce = Debounce;
})();

var throttle = new ZAWA.Throttle(500, hello);
var debounce = new ZAWA.Debounce(500, hello);

$(window).on('resize', function () {
	throttle.run();
});
$(window).on('resize', function () {
	debounce.run();
});

function hello() {
	console.log('hello');
}