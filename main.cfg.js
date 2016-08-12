'use strict';
var tests = Object.keys( window.__karma__.files ).filter( function ( file ) {
	return (/spec\.js$/).test( file );
} );
var require = requirejs.config( {
	baseUrl: "/base",
	// basePath: "/base",
	paths: {
		"angular": "external/angular/angular",
		"angularMocks": "external/angular-mocks/angular-mocks",
		// "jquery": "assets/external/jquery/jquery",
		 "chai": "external/chai/chai"
		// "sinon": "test/libs/sinon/sinon"
	},
	shim: {
		angular: {exports: 'angular'},
		angularMocks: {deps: ['angular']}
		// "test/fixtures/angular-mocks": ["angular"]
	},
	deps: tests,
	callback: function () {
		window.__karma__.start();
	}
} );
