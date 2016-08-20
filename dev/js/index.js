/*
残タスク
・コントローラーの作成
・attachEventをaddEventListenerにbindする
→addEventListenerだけでattachEventをカバーできるようにする
*/

// polyfill
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

var ZAWA = ZAWA || {};
(function(){

	ZAWA.Throttle = (function(){

		class Throttle {
			constructor(interval, callback){
				this._interval = interval;
				this._lastTime = 0;
				this._callback = callback;

				this._init();
			}

			_init () {
				this._lastTime = new Date().getTime() - this._interval;
			}

			run () {
				if((this._lastTime + this._interval) <= new Date().getTime()){
					this._lastTime = new Date().getTime();
					this._callback();
					return;
				}
			}
		}

		return Throttle;
	}());

}());

var throttle = new ZAWA.Throttle(500, hello);

if(window.addEventListener){
	window.addEventListener('resize', () => { throttle.run(); }, false);
} else if(window.attachEvent){
	window.attachEvent('onresize', () => { throttle.run(); });
}

function hello(){
	console.log('hello');
}
