let log = require('./log');
let EventDispatcher = require('../../scripts/EventDispatcher');

let eventDispatcher = new EventDispatcher();


let listener1CallsCount = 0;

let listener1 = function(){
	log('someCustomEvent caught by listener #1');

	listener1CallsCount++;

	if(listener1CallsCount == 3){
		log('listener #1 called 3 times, detaching');

		//detach all listeners by skipping the second argument
		eventDispatcher.off('someCustomEvent', listener1);
	}
};

eventDispatcher.on('someCustomEvent', listener1);

eventDispatcher.one('someCustomEvent', function(value1, value2){
	log(`someCustomEvent caught by listener #2, values: ${value1} and ${value2}`);
});

log('sending someDifferentCustomEvent, should be no reaction');

eventDispatcher.notify('someDifferentCustomEvent', 'eventValue1', 'eventValue2');

log('sending someCustomEvent, should be caught by 2 listeners');

eventDispatcher.notify('someCustomEvent', 'eventValue1', 'eventValue2');

log('sending someCustomEvent, should be caught by 1 listener, the other detached after first notification');

eventDispatcher.notify('someCustomEvent', 'eventValue1', 'eventValue2');

log('sending some more someCustomEvent, on 4th notification, no listeners should fire');

eventDispatcher.notify('someCustomEvent', 'eventValue1', 'eventValue2');
eventDispatcher.notify('someCustomEvent', 'eventValue1', 'eventValue2');
eventDispatcher.notify('someCustomEvent', 'eventValue1', 'eventValue2');
eventDispatcher.notify('someCustomEvent', 'eventValue1', 'eventValue2');



log('extending an object with EventDispatcher capabilities');

let ComplexObject = function(){
	this._eventDispatcher = new EventDispatcher();

	this.sum = function(value1, value2){
		log('extra function called, using EventDispatcher to notify listeners');

		this._eventDispatcher.notify('sumResponse', value1 + value2);
	}

	this._eventDispatcher.extend(this);
};

let complexObject = new ComplexObject();

complexObject.one('sumResponse', function(sum){
	log(`listener result: ${sum}`);
});

complexObject.sum(3, 5);