(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./scripts/exampleThrottle');
require('./scripts/exampleEventDispatcher');
require('./scripts/exampleBulkImageLoader');

},{"./scripts/exampleBulkImageLoader":2,"./scripts/exampleEventDispatcher":3,"./scripts/exampleThrottle":4}],2:[function(require,module,exports){
let BulkImageLoader = require('../../scripts/BulkImageLoader');
let bulkImageLoader = new BulkImageLoader();
let log = require('./log');

function onImageLoad(imageInformation) {
	log('image loaded (' + JSON.stringify(imageInformation) + ')');
}

function onImageFail(imageInformation) {
	log('image not loaded (' + JSON.stringify(imageInformation) + ')');
}

function allImagesLoadDone() {
	log('all images loaded (' + bulkImageLoader.getLoadedImagesInformation().length + ' images)');
}

bulkImageLoader.load(['images/bulk-loader-1.jpg', 'images/bulk-loader-2.jpg']);
bulkImageLoader.load('images/bulk-loader-1.jpg');
bulkImageLoader.load('images/no-image-here.jpg');

bulkImageLoader.on('imageLoadDone', onImageLoad);
bulkImageLoader.on('imageLoadFail', onImageFail);
bulkImageLoader.on('allImagesLoad', allImagesLoadDone);

log('loading four images, one is non-existent');
log('events: imageLoadDone, imageLoadFail, allImagesLoad');

},{"../../scripts/BulkImageLoader":6,"./log":5}],3:[function(require,module,exports){
let log = require('./log');
let EventDispatcher = require('../../scripts/EventDispatcher');

let eventDispatcher = new EventDispatcher();

let listener1CallsCount = 0;

let listener1 = function () {
	log('someCustomEvent caught by listener #1');

	listener1CallsCount++;

	if (listener1CallsCount == 3) {
		log('listener #1 called 3 times, detaching');

		//detach all listeners by skipping the second argument
		eventDispatcher.off('someCustomEvent', listener1);
	}
};

eventDispatcher.on('someCustomEvent', listener1);

eventDispatcher.one('someCustomEvent', function (value1, value2) {
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

let ComplexObject = function () {
	this._eventDispatcher = new EventDispatcher();

	this.sum = function (value1, value2) {
		log('extra function called, using EventDispatcher to notify listeners');

		this._eventDispatcher.notify('sumResponse', value1 + value2);
	};

	this._eventDispatcher.extend(this);
};

let complexObject = new ComplexObject();

complexObject.one('sumResponse', function (sum) {
	log(`listener result: ${sum}`);
});

complexObject.sum(3, 5);

},{"../../scripts/EventDispatcher":7,"./log":5}],4:[function(require,module,exports){
let log = require('./log');
let throttle = require('../../scripts/throttle');

log('catching the last event after a delay');

let callback1Delay = 1000;
let startingArg1 = 5;
let arg1 = startingArg1;
let callback1 = function (arg1) {
	log(`throttled callback called after ${startingArg1} calls and a ${callback1Delay} idle time, arg1 = ${arg1}`);
};

let throttledCallback = throttle(callback1, callback1Delay, true);

let interval1 = setInterval(function () {
	arg1--;

	if (arg1 > 0) {
		throttledCallback(arg1);
	} else {
		clearInterval(interval1);
	}
}, 200);

log('catching intermediary events in a regular interval');

let callback2 = function (arg2) {
	log(`finished throttling with regular intervals, ${arg2}`);
};

let callback2Delay = 200;
let startingArg2 = 30;
let arg2 = startingArg2;

let throttledCallback2 = throttle(callback2, callback2Delay);

let interval2 = setInterval(function () {
	arg2--;

	if (arg2 > 0) {
		throttledCallback2(arg2);
	} else {
		clearInterval(interval2);
	}
}, 30);

},{"../../scripts/throttle":8,"./log":5}],5:[function(require,module,exports){
function log(message) {
	document.querySelector('pre').innerHTML += message + '\n';
}

module.exports = log;

},{}],6:[function(require,module,exports){
var EventDispatcher = require('./EventDispatcher');

function BulkImageLoader() {
	this._eventDispatcher = new EventDispatcher();
	this._loadedImagesInformation = [];
	this._loadingImages = [];

	this._eventDispatcher.extend(this);
}

BulkImageLoader.prototype._notify = function () {
	this._eventDispatcher.notify.apply(this._eventDispatcher, arguments);
};

BulkImageLoader.prototype._saveImageInformation = function (imageObject) {
	var height = imageObject.height;
	var width = imageObject.width;
	var information = {
		width: width,
		height: height,
		url: imageObject.src
	};

	this._loadedImagesInformation.push(information);
	this._removeLoadingImage(imageObject);

	return information;
};

BulkImageLoader.prototype._notifyOnImageLoad = function (information) {
	this._notify('imageLoadDone', information);

	if (this._loadingImages.length === 0) {
		this._notify('allImagesLoad');
	}
};

BulkImageLoader.prototype._onImageLoadDone = function (imageObject) {
	var information = this._saveImageInformation(imageObject);

	this._notifyOnImageLoad(information);
};

BulkImageLoader.prototype._removeLoadingImage = function (imageObject) {
	var loadingImageIndex = this._loadingImages.indexOf(imageObject);

	this._loadingImages.splice(loadingImageIndex, 1);
};

BulkImageLoader.prototype._onImageLoadFail = function (imageObject) {
	this._removeLoadingImage(imageObject);

	this._notify('imageLoadFail', {
		width: null,
		height: null,
		url: imageObject.src
	});

	if (this._loadingImages.length === 0) {
		this._notify('allImagesLoad');
	}
};

BulkImageLoader.prototype.getLoadedImagesInformation = function () {
	return this._loadedImagesInformation; //consider cloning for safety
};

BulkImageLoader.prototype.getLoadedInformation = function (imageUrl) {
	var information = null;
	var imageInformationIndex = 0;

	while (imageInformationIndex < this._loadedImagesInformation.length && information === null) {

		if (this._loadedImagesInformation[imageInformationIndex].url === imageUrl && information === null) {
			information = this._loadedImagesInformation[imageInformationIndex];
		} else {
			imageInformationIndex++;
		}
	}

	return information;
};

BulkImageLoader.prototype.load = function (images) {
	var imagesArray = Array.isArray(images) ? images : [images];

	imagesArray.forEach(function (imageUrl) {
		this._loadSingle(imageUrl);
	}.bind(this));
};

BulkImageLoader.prototype._loadSingle = function (imageUrl) {
	var imageObject;
	var savedInformation;

	savedInformation = this.getLoadedInformation();

	if (savedInformation !== null) {
		setTimeout(function () {
			this._notifyOnImageLoad(savedInformation);
		}.bind(this));
	} else {
		imageObject = new Image();

		imageObject.onload = function () {
			setTimeout(function () {
				this._onImageLoadDone(imageObject);
			}.bind(this));
		}.bind(this);

		imageObject.onerror = function () {
			setTimeout(function () {
				this._onImageLoadFail(imageObject);
			}.bind(this));
		}.bind(this);

		this._loadingImages.push(imageObject);

		imageObject.src = imageUrl;
	}
};

module.exports = BulkImageLoader;

},{"./EventDispatcher":7}],7:[function(require,module,exports){
function EventDispatcher() {
	this._listeners = {};
}

EventDispatcher.prototype.notify = function (eventName /*[, eventArguments...]*/) {
	var listeners = this._listeners[eventName];
	var listenerInformation;
	var eventArguments = Array.prototype.slice.call(arguments, 1);
	var listenerInformationIndex;

	if (listeners) {

		for (listenerInformationIndex = 0; listenerInformationIndex < listeners.length; listenerInformationIndex++) {
			listenerInformation = listeners[listenerInformationIndex];

			if (listenerInformation.oneTime) {
				this._removeListenerByIndex(eventName, listenerInformationIndex);
			}

			listenerInformation.callback.apply(null, eventArguments);
		}
	}
};

EventDispatcher.prototype._removeListenerByIndex = function (eventName, index) {
	this._listeners[eventName].splice(index, 1);
};

EventDispatcher.prototype._addListenerInformation = function (eventName, listenerInformation) {
	this._listeners[eventName] = this._listeners[eventName] || [];

	if (!this.isAlreadyAttached(eventName, listenerInformation)) {
		this._listeners[eventName].push(listenerInformation);
	}
};

EventDispatcher.prototype.on = function (eventName, callback) {
	this._addListenerInformation(eventName, {
		callback: callback,
		oneTime: false
	});
};

EventDispatcher.prototype._getListenerInformationIndex = function (eventName, callback) {
	var callbackIndex = 0;
	var informationIndex = null;
	var listeners = this._listeners[eventName] || [];

	while (callbackIndex < listeners.length && informationIndex === null) {

		if (listeners[callbackIndex].callback === callback) {
			informationIndex = callbackIndex;
		} else {
			callbackIndex++;
		}
	}

	return informationIndex;
};

EventDispatcher.prototype.isAlreadyAttached = function (eventName, callback) {
	var listenerIndex = 0;
	var eventListeners = this._listeners[eventName];
	var listener;
	var alreadyAttached = false;

	if (!eventListeners) {
		return false;
	}

	while (listenerIndex < eventListeners.length && !alreadyAttached) {
		listener = eventListeners[listenerIndex];

		if (listener.callback === callback) {
			alreadyAttached = true;
		} else {
			listenerIndex++;
		}
	}

	return alreadyAttached;
};

EventDispatcher.prototype.one = function (eventName, callback) {
	this._addListenerInformation(eventName, {
		callback: callback,
		oneTime: true
	});
};

EventDispatcher.prototype.off = function (eventName, callback) {
	var callbackInformationIndex;

	if (this._listeners[eventName]) {

		if (typeof callback === 'undefined') {
			delete this._listeners[eventName];
		} else {
			callbackInformationIndex = this._getListenerInformationIndex(eventName, callback);

			if (callbackInformationIndex !== null) {
				this._removeListenerByIndex(eventName, callbackInformationIndex);
			}

			if (!this._listeners[eventName].length) {
				delete this._listeners[eventName];
			}
		}
	}
};

EventDispatcher.prototype.extend = function (targetObject) {
	targetObject.on = this.on.bind(this);
	targetObject.off = this.off.bind(this);
	targetObject.one = this.one.bind(this);
	targetObject.isAlreadyAttached = this.isAlreadyAttached.bind(this);
};

module.exports = EventDispatcher;

},{}],8:[function(require,module,exports){
let throttle = function (callback, timeDelay, discardIntermediary) {
	let timeout = null;
	let lastArgs;

	if (discardIntermediary !== true) {

		return function () {
			lastArgs = arguments;

			if (timeout === null) {
				timeout = setTimeout(function () {
					timeout = null;

					callback.apply(null, lastArgs);
				}, timeDelay);
			}
		};
	} else {

		return function () {
			lastArgs = arguments;

			clearTimeout(timeout);

			timeout = setTimeout(function () {
				timeout = null;

				callback.apply(null, lastArgs);
			}, timeDelay);
		};
	}
};

module.exports = throttle;

},{}]},{},[1])
//# sourceMappingURL=main.target.js.map
