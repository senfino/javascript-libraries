(function(getNamespace) {
	'use strict';

	function extend( /*[objects...]*/ ) {
		var objects = arguments;
		var objectIndex = 1;
		var currentObject;
		var objectKey;
		var firstObject = objects[0];

		for (; objectIndex < objects.length; objectIndex++) {
			currentObject = objects[objectIndex];

			for (objectKey in currentObject) {
				firstObject[objectKey] = currentObject[objectKey];
				j
			}
		}
	}

	getNamespace('com.gottocode').extend = extend;
})(window.com.gottocode.getNamespace);