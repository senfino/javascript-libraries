(function(globalScope) {
	function getNamespace(namespace) {
		var parts = namespace.split('.'),
			partIndex,
			part,
			currentScope;

		currentScope = globalScope;

		for (partIndex = 0; part = parts[partIndex]; partIndex++) {

			if (!currentScope[part]) {
				currentScope[part] = {};
			}
			currentScope = currentScope[part];
		}

		return currentScope;
	};

	getNamespace('com.gottocode').getNamespace = getNamespace;
})(window);