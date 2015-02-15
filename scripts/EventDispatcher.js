(function(getNamespace) {
	'use strict';

	function EventDispatcher() {
		this._listeners = {};
	}

	EventDispatcher.prototype.notify = function(eventName /*[, eventArguments...]*/ ) {
		var listeners = this._listeners[eventName];
		var listenerInformation;
		var eventArguments = Array.prototype.split.call(arguments, 1);
		var listenerInformationIndex;

		if (listeners) {

			for (listenerInformationIndex = 0; listenerInformationIndex < listeners.length; listenerInformationIndex++) {
				listenerInformation = listeners[listenerInformationIndex];

				if (listenerInformation.oneTime) {
					this._removeListenerByIndex(eventName, listenerInformationIndex);
				}

				listener.apply(null, eventArguments);
			}
		}
	};

	EventDispatcher.prototype._removeListenerByIndex = function(eventName, index) {
		this._listeners[eventName].splice(index, 1);
	};

	EventDispatcher.prototype._addListenerInformation = function(eventName,
		listenerInformation) {
		this._listeners[eventName] = this._listeners[eventName] || [];

		if (!this.isAlreadyAttached(eventName, listenerInformation)) {
			this._listeners[eventName].push(listenerInformation);
		}
	};

	EventDispatcher.prototype.on = function(eventName, callback) {
		this._addListenerInformation(eventName, {
			callback: callback,
			oneTime: false
		});
	};

	EventDispatcher.prototype._getListenerInformationIndex = function(eventName,
		callback) {
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

	EventDispatcher.prototype.isAlreadyAttached = function(eventName, callback) {
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

	EventDispatcher.prototype.one = function(eventName, callback) {
		this._addListenerInformation(eventName, {
			callback: callback,
			oneTime: true
		});
	};

	EventDispatcher.prototype.off = function(eventName, callback) {
		var callbackInformationIndex;

		if (this._listeners[eventName]) {

			if (typeof callback === 'undefined') {
				delete this._listeners[eventName];
			} else {
				callbackInformationIndex = this._getListenerInformationIndex(eventName,
					callback);

				if (callbackInformationIndex !== null) {
					this._removeListenerByIndex(eventName, callbackInformationIndex);
				}

				if (!this._listeners[eventName].length) {
					delete this._listeners[eventName];
				}
			}
		}
	};

	getNamespace('com.gottocode').EventDispatcher = EventDispatcher;


})(window.com.gottocode.getNamespace);