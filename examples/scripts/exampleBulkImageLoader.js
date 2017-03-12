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
	log('all images loaded (' + bulkImageLoader.getLoadedImagesInformation().length +
		' images)');
}

bulkImageLoader.load(['images/bulk-loader-1.jpg', 'images/bulk-loader-2.jpg']);
bulkImageLoader.load('images/bulk-loader-1.jpg');
bulkImageLoader.load('images/no-image-here.jpg');

bulkImageLoader.on('imageLoadDone', onImageLoad);
bulkImageLoader.on('imageLoadFail', onImageFail);
bulkImageLoader.on('allImagesLoad', allImagesLoadDone);

log('loading four images, one is non-existent');
log('events: imageLoadDone, imageLoadFail, allImagesLoad');