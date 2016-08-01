define( [
	"qlik"
], function ( qlik ) {
	'use strict';

	var $injector = angular.injector(['ng']);
	var $compile = $injector.get("$compile");

	return {
		name: 'scVariable',
		restrict: 'E',
		scope: {
			content: '@'
		},
		transclude: true,
		template: '<div ng-transclude></div>',
		link: function ( scope /*, element, attrs */ ) {

			if ( scope.content ) {
				init();
			}

			function init () {
				if ( !scope.variables ) {
					scope.variables = [];
				}
				var app = qlik.currApp();

				var vars = scope.content.split( ',' );

				vars.forEach( function ( item ) {

					app.variable.getContent( item )
						.then( function ( model ) {
							scope.variables[item] = model;
							console.log( 'scope.variables', scope.variables );
						}, function ( errorObject ) {
							console.log( 'err', errorObject );
						} );

				} );


			}
		}
	};
} );

