function log(message) {
	document.querySelector('pre').innerHTML += message + '\n';
}

module.exports = log;