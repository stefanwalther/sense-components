'use strict';
var tests = Object.keys( window.__karma__.files ).filter( function ( file ) {
	return (/spec\.js$/).test( file );
} );
var require = requirejs.config( {
	baseUrl: "/base",
	waitSeconds: 0,
	paths: {
		"angular": "node_modules/angular/angular.min",
		"angularMocks": "node_modules/angular-mocks/angular-mocks",
		"underscore": "node_modules/underscore/underscore-min",
		"jquery": "external/jquery/jquery",
		"text": "node_modules/text/text",
		"css": "node_modules/require-css/css.min"
		// "sinon": "test/libs/sinon/sinon"
	},
	shim: {
		angular: {
			exports: 'angular'
		},
		angularMocks: {
			deps: ['angular']
		},
		underscore: {
			exports: "underscore"
		},
		text: {
			exports: 'text'
		},
		css: {
			exports: 'css'
		}
	},
	deps: tests,
	callback: function () {
		window.__karma__.start();
	}
} );
