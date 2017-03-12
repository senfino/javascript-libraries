let throttle = function(callback, timeDelay, discardIntermediary){
	let timeout = null;
	let lastArgs;

	if(discardIntermediary !== true){

		return function(){
			lastArgs = arguments;

			if(timeout===null){
				timeout = setTimeout(function(){
					timeout = null;

					callback.apply(null, lastArgs);
				}, timeDelay);
			}
		};
	}else{

		return function(){
			lastArgs = arguments;

			clearTimeout(timeout);

			timeout = setTimeout(function(){
				timeout = null;

				callback.apply(null, lastArgs);
			}, timeDelay);
		};
	}
};

module.exports = throttle;