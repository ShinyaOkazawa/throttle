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
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
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
(function(){
	'use strict';

	class Throttle{
		constructor(interval, callback){
			this._interval = interval;
			this._callback = callback;
			this._lastTime = 0;

			this._init();
		}

		_init(){
			this._lastTime = new Date().getTime() - this._interval;
		}

		run(){
			if((this._lastTime + this._interval) <= new Date().getTime()){
				this._lastTime = new Date().getTime();
				this._callback();
				return;
			}
		}
	}
	ZAWA.Throttle = Throttle;

	class Debounce{
		constructor(interval, callback){
			this._interval = interval;
			this._callback = callback;
			this._timer = 0;
		}

		run(){
			clearTimeout(this._timer);
			this._timer = setTimeout(()=>{
				this._callback();
			}, this._interval);
		}
	}
	ZAWA.Debounce = Debounce;

}());

var throttle = new ZAWA.Throttle(500, hello);
var debounce = new ZAWA.Debounce(500, hello);

$(window).on('resize', () => { throttle.run(); });
$(window).on('resize', () => { debounce.run(); });

function hello(){
	console.log('hello');
}
