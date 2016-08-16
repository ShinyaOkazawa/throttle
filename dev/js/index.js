var ZAWA = ZAWA || {};
(function(global){

	ZAWA.throttle = (function(){
		var p = Throttle.prototype;

		function Throttle(time, func){
			this._lastTime = 0;
			this._interval = (time) ? time : 1000;
			this._callback = (func) ? func : undefined;

			this._init();
		}

		p._init = function(){
			this._lastTime = new Date().getTime() - this._interval;

			if(window.addEventListener){
				window.addEventListener('resize', this._throttle.bind(this), false);
			} else if(window.attachEvent){
				window.attachEvent('onresize', this._throttle.bind(this));
			}
		};

		p._throttle = function(){
			if((this._lastTime + this._interval) <= new Date().getTime()){
				this._lastTime = new Date().getTime();
				if(this._callback){
					this._callback();
				}
			}
		};

		return Throttle;
	}());

	global.ZAWA = ZAWA;
}(window));


new ZAWA.throttle(500,hello);

function hello(){
	console.log('hello');
}
