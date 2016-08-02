define( [
	'qlik',
	'underscore',
	'./variable-loader'
], function ( qlik, _, variableLoader ) {
	'use strict';

	var $injector = angular.injector( ['ng'] );
	var $timeout = $injector.get( "$timeout" );

	return {
		name: 'scGetVariables',
		restrict: 'E',
		replace: true,
		controller: ['$scope', '$attrs', function ( $scope, $attrs ) {

			$scope.variables = []; // default value

			variableLoader.load( $attrs.content )
				.then( function ( replies ) {
					$scope.variables = replies;
					console.log( $scope.variables );
				} )
				.catch( function ( err ) {
					window.console.log( err );
				} );

		}]
	};
} );

