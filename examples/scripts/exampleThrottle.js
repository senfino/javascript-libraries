let log = require('./log');
let throttle = require('../../scripts/throttle');

log('catching the last event after a delay');

let callback1Delay = 1000;
let startingArg1 = 5;
let arg1 = startingArg1;
let callback1 = function(arg1){
	log(`throttled callback called after ${startingArg1} calls and a ${callback1Delay} idle time, arg1 = ${arg1}`);
};

let throttledCallback = throttle(callback1, callback1Delay, true);

let interval1 = setInterval(function(){
	arg1--;

	if(arg1 > 0){
		throttledCallback(arg1);
	}else{
		clearInterval(interval1);
	}
}, 200);


log('catching intermediary events in a regular interval');

let callback2 = function(arg2){
	log(`finished throttling with regular intervals, ${arg2}`);
};

let callback2Delay = 200;
let startingArg2 = 30;
let arg2 = startingArg2;

let throttledCallback2 = throttle(callback2, callback2Delay);

let interval2 = setInterval(function(){
	arg2--;

	if(arg2 > 0){
		throttledCallback2(arg2);
	}else{
		clearInterval(interval2);
	}
}, 30);