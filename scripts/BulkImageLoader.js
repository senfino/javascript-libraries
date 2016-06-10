(function(getNamespace, EventDispatcher) {
	'use strict';

	function BulkImageLoader() {
		this._eventDispatcher = new EventDispatcher();
		this._loadedImagesInformation = [];
		this._loadingImages = [];
	}

	BulkImageLoader.prototype.one = function() {
		this._eventDispatcher.one.apply(this._eventDispatcher, arguments);
	};

	BulkImageLoader.prototype.on = function() {
		this._eventDispatcher.on.apply(this._eventDispatcher, arguments);
	};

	BulkImageLoader.prototype.off = function() {
		this._eventDispatcher.off.apply(this._eventDispatcher, arguments);
	};

	BulkImageLoader.prototype.isAlreadyAttached = function() {
		return this._eventDispatcher.isAlreadyAttached.apply(this._eventDispatcher,
			arguments);
	};

	BulkImageLoader.prototype._notify = function() {
		this._eventDispatcher._notify.apply(this._eventDispatcher, arguments);
	};

	BulkImageLoader.prototype._saveImageInformation = function(imageObject) {
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

	BulkImageLoader.prototype._notifyOnImageLoad = function(information) {
		this._notify('imageLoadDone', information);

		if (this._loadingImages.length === 0) {
			this._notify('allImagesLoad');
		}
	};

	BulkImageLoader.prototype._onImageLoadDone = function(imageObject) {
		var information = this._saveImageInformation(imageObject);

		this._notifyOnImageLoad(information);
	};

	BulkImageLoader.prototype._removeLoadingImage = function(imageObject) {
		var loadingImageIndex = this._loadingImages.indexOf(imageObject);

		this._loadingImages.splice(loadingImageIndex, 1);
	};

	BulkImageLoader.prototype._onImageLoadFail = function(imageObject) {
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

	BulkImageLoader.prototype.getLoadedImagesInformation = function() {
		return this._loadedImagesInformation; //consider cloning for safety
	};

	BulkImageLoader.prototype.getLoadedInformation = function(imageUrl) {
		var information = null;
		var imageInformationIndex = 0;

		while (imageInformationIndex < this._loadedImagesInformation.length &&
			information === null) {

			if (this._loadedImagesInformation[imageInformationIndex].url === imageUrl &&
				information === null) {
				information = this._loadedImagesInformation[imageInformationIndex];
			} else {
				imageInformationIndex++;
			}
		}

		return information;
	};

	BulkImageLoader.prototype.load = function(images) {
		var imagesArray = Array.isArray(images) ? images : [images];

		imagesArray.forEach(function(imageUrl) {
			this._loadSingle(imageUrl);
		}.bind(this));
	};

	BulkImageLoader.prototype._loadSingle = function(imageUrl) {
		var imageObject;
		var savedInformation;

		savedInformation = this.getLoadedInformation();

		if (savedInformation !== null) {
			setTimeout(function() {
				this._notifyOnImageLoad(savedInformation);
			}.bind(this));
		} else {
			imageObject = new Image();

			imageObject.onload = function() {
				setTimeout(function() {
					this._onImageLoadDone(imageObject);
				}.bind(this));
			}.bind(this);

			imageObject.onerror = function() {
				setTimeout(function() {
					this._onImageLoadFail(imageObject);
				}.bind(this));
			}.bind(this);

			this._loadingImages.push(imageObject);

			imageObject.src = imageUrl;
		}
	};

	getNamespace('com.gottocode').BulkImageLoader = BulkImageLoader;
})(window.com.gottocode.getNamespace, window.com.gottocode.EventDispatcher);