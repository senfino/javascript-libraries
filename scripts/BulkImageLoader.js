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

	BulkImageLoader.prototype._onImageLoadDone = function(imageObject) {
		var height = imageObject.height;
		var width = imageObject.width;
		var information = {
			width: width,
			height: height,
			url: imageObject.src
		};

		this._removeLoadingImage(imageObject);

		this._notify('imageLoadDone', information);

		this._loadedImagesInformation.push(information);

		if (this._loadingImages.length === 0) {
			this._notify('allImagesLoadDone');
		}
	};

	BulkImageLoader.prototype._removeLoadingImage = function(imageObject) {
		var loadingImageIndex = this._loadingImages.indexOf(imageObject);

		this._loadingImages.splice(loadingImageIndex, 1);
	};

	BulkImageLoader.prototype._onImageLoadFail = function(imageObject) {
		this._removeLoadingImage(imageObject);

		if (this._loadingImages.length === 0) {
			this._notify('allImagesLoadDone');
		}

		this._notify('imageLoadFail', {
			url: imageObject.src
		});
	};

	BulkImageLoader.prototype.getLoadedInformation = function(imageUrl) {
		var information = null;
		var imageInformationIndex = 0;

		while (imageInformationIndex < this._loadedImagesInformation.length &&
			information === null) {

			if (this._loadedImagesInformation[imageInformationIndex].url === imageUrl) {
				information = this._loadedImagesInformation[imageInformationIndex];
			} else {
				imageInformationIndex++;
			}
		}

		return information;
	};

	BulkImageLoader.prototype.load = function(imageUrl) {
		var imageObject;
		var savedInformation;

		savedInformation = this.getLoadedInformation();

		if (savedInformation !== null) {
			return savedInformation;
		} else {
			imageObject = document.createElement('img');

			imageObject.onload = function() {
				this._onImageLoadDone(imageObject);
			}.bind(this);

			imageObject.onerror = function() {
				this._onImageLoadFail(imageObject);
			}.bind(this);

			this._loadingImages.push(imageObject);

			imageObject.src = imageUrl;
		}
	};

	getNamespace('com.gottocode').BulkImageLoader = BulkImageLoader;
})(window.com.gottocode.getNamespace, window.com.gottocode.EventDispatcher);