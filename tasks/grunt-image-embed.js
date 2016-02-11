/*
 * Grunt Image Embed
 * https://github.com/ehynds/grunt-image-embed
 *
 * Copyright (c) 2013 Eric Hynds
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function(grunt) {
	var encode = require('./lib/encode');
	var fs = require('fs');

	grunt.registerMultiTask('imageEmbed', 'Embed images as base64 data URIs inside your stylesheets', function() {
		var opts = this.options();
		var done = this.async();
		var filesCount = this.files.length;
		var doneCount = 0;

		if (filesCount === 0) {
			grunt.log.warn('No files defined');
			return done();
		}

		// Process each src file
		this.files.forEach(function(file) {
			var dest = file.dest;
			var tasks;

			tasks = file.src.map(function (src) {
				return new Promise(function(resolve, reject) {
					if (src) {
						encode.stylesheet(src, opts, function (err, output) {
							fs.writeFile(src, output, function (err) {
								if (err) {
									grunt.log.writeln(err);
									reject();
								} else {
									grunt.log.writeln(src);
									resolve();
								}
							});
						});
					} else {
						reject();
					}
				});
			});

			Promise.all(tasks).then(function (data) {
				done();
			});


		});
	});

};
