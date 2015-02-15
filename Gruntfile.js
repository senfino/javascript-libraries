module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		build: {
			scriptsPath: 'scripts',
			scriptsBuildPath: 'build'
		},
		example: {
			entry: 'example/index.html',
			scriptPath: 'example/scripts.js'
		},
		watch: {
			options: {
				atBegin: true,
				interrupt: true,
				livereload: 35726
			},
			onlyRefresh: {
				files: [
					'<%= example.scriptPath %>',
					'<%= example.entry %>'
				],
				tasks: []
			},
			buildScripts: {
				files: [
					'<%= build.scriptsPath %>/**/*.js'
				],
				tasks: [
					'uglify:buildScripts'
				]
			}
		},
		uglify: {
			buildScripts: {
				options: {
					sourceMap: true
				},
				src: [
					'<%= build.scriptsPath %>/getNamespace.js',
					'<%= build.scriptsPath %>/extend.js',
					'<%= build.scriptsPath %>/ViewportIdentifier.js',
					'<%= build.scriptsPath %>/EventDispatcher.js',
					'<%= build.scriptsPath %>/BulkImageLoader.js'
				],
				dest: '<%= build.scriptsBuildPath %>/tn-javascript-extensions.js'
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', [
		'watch'
	]);
};