// require.config( { baseUrl: "" } );
// require( ["assets/require-config"], function () {
var tests = Object.keys( window.__karma__.files ).filter( function ( file ) {
	return !/\.comp.spec\.js$/.test( file ) && /\.spec\.js$/.test( file );
} );

var require = requirejs.config( {
	baseUrl: "/base",
	// basePath: "/base",
	paths: {
		"angular": "./node_modules/angular/angular"
		// "jquery": "assets/external/jquery/jquery",
		// "chai": "test/libs/chai/chai",
		// "sinon": "test/libs/sinon/sinon"
	},
	shim: {
		// "test/fixtures/angular-mocks": ["angular"]
	},
	// deps: ["test/fixtures/angular-mocks"],
	callback: function () {
		require( [
			// "qvangular",
			// "chai",
			// "test/libs/chai/sinon-chai",
			// "test/libs/chai/chai-jquery",
			// "general.controllers/route-controller"
		].concat( tests ), function ( /*qva, chai, sinonChai, chaiJquery, RouteController*/ ) {
			// RouteController.setUrl = function () {};
			// navigator.language = "en_US";
			// chai.use( sinonChai );
			// chai.use( chaiJquery );
			// chai.config.truncateThreshold = 0;
			window.mocha.ignoreLeaks( true );
			window.mocha.fullTrace( true );
			window.__karma__.start();
		} );
	}
} );
// 	} );
// } );
