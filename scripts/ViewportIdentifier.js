(function(getNamespace) {
	'use strict';

	function ViewportIdentifier(customOptions) {
		var defaults = {
			detectionType: 'device'
		};

		this._options = this._merge(defaults, customOptions);

		this._viewportHeight = null;
		this._viewportWidth = null;
		this._viewportIdentifier = null;

		this._callbacks = {};

		this.updateViewportSize();
	}

	ViewportIdentifier.prototype._merge = function(targetObject, sourceObject) {
		var key;

		for (key in sourceObject) {
			targetObject[key] = sourceObject[key];
		}

		return targetObject;
	};

	ViewportIdentifier.prototype.on = function(eventName, callback) {
		this._callbacks[eventName] = this._callbacks[eventName] || [];

		if (this._callbacks[eventName].indexOf(callback) == -1) {
			this._callbacks[eventName].push(callback);
		}
	};

	ViewportIdentifier.prototype._notify = function(eventName) {
		var data = Array.prototype.slice.call(arguments, 1);

		if (this._callbacks[eventName]) {
			this._callbacks[eventName].forEach(function(callback) {
				callback.apply(null, data);
			});
		}
	};

	ViewportIdentifier.prototype._onResize = function(event) {
		this.updateViewportSize();
	};

	ViewportIdentifier.prototype.resize = function() {
		this.updateViewportSize();
	};

	ViewportIdentifier.prototype.getViewportIdentifier = function() {
		return this._viewportIdentifier;
	};

	ViewportIdentifier.prototype._identifyByBrowserDimensions = function() {
		var viewportIdentifier;
		var viewportWidth = window.innerWidth;

		if (viewportWidth < 768) {
			viewportIdentifier = 'phone';
		} else if (viewportWidth < 980) {
			viewportIdentifier = 'tablet-portrait';
		} else if (viewportWidth < 1280) {
			viewportIdentifier = 'tablet-landscape';
		} else {
			viewportIdentifier = 'desktop';
		}

		return viewportIdentifier;
	};

	ViewportIdentifier.prototype._identifyByScreenDimensions = function() {
		var viewportWidth = screen.width;
		var viewportIdentifier;

		if (viewportWidth < 768) {
			viewportIdentifier = 'phone';
		} else if (viewportWidth < 980) {
			viewportIdentifier = 'tablet-portrait';
		} else if (viewportWidth < 1280) {
			viewportIdentifier = 'tablet-landscape';
		} else {
			viewportIdentifier = 'desktop';
		}

		return viewportIdentifier;
	};

	ViewportIdentifier.prototype._identifyByDeviceAgent = function() {
		var viewportIdentifier;

		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
			.test(navigator.userAgent)) {

			if (/Mobile/i.test(navigator.userAgent) && !/ipad/i.test(navigator.userAgent)) {
				viewportIdentifier = 'phone';
			} else {
				viewportIdentifier = 'tablet';
			}
		} else {
			viewportIdentifier = null;
		}

		return viewportIdentifier;
	};

	ViewportIdentifier.prototype.updateViewportSize = function() {
		var viewportIdentifier;
		var detectionType = this._options.detectionType;
		var viewportWidth = window.innerWidth;
		var viewportHeight = window.innerHeight;


		if (detectionType === 'screen') {
			viewportIdentifier = this._identifyByScreenDimensions();
		} else if (detectionType === 'browser') {
			viewportIdentifier = this._identifyByBrowserDimensions();
		} else if (detectionType === 'device') {

			var agentViewport = this._identifyByDeviceAgent();
			var screenViewport = this._identifyByScreenDimensions();

			if (agentViewport === null) {
				// no phone or tablet agent recognized
				viewportIdentifier = screenViewport;
			} else {

				if (screenViewport !== 'desktop') {
					viewportIdentifier = screenViewport;
				} else {

					// desktop
					if (agentViewport === 'tablet') {
						viewportIdentifier = 'tablet-landscape';
					} else {
						viewportIdentifier = 'desktop';
					}
				}
			}
		} else {
			throw new Error('detectionType not recognized: ' + detectionType);
		}


		if ((this._viewportWidth !== viewportWidth) || (this._viewportHeight !==
				viewportHeight)) {
			this._viewportWidth = viewportWidth;
			this._viewportHeight = viewportHeight;

			this._notify('resize', viewportWidth, viewportHeight);
		}

		if (this._viewportIdentifier !== viewportIdentifier) {
			this._viewportIdentifier = viewportIdentifier;

			this._notify('viewportIdentifierChange', viewportIdentifier);
		}
	};

	ViewportIdentifier.prototype.getViewportSize = function() {
		return {
			height: this._viewportHeight,
			width: this._viewportWidth
		};
	};

	ViewportIdentifier.prototype.watchStart = function() {
		window.addEventListener('resize', this._onResize.bind(this));
	};

	getNamespace('com.gottocode').ViewportIdentifier = ViewportIdentifier;
})(window.com.gottocode.getNamespace);