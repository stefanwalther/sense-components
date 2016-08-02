/*global define,qvangular*/
define([
		'qlik'
	],
	function (qlik) {
		'use strict';

		function load( $scope, delimitedVars) {

			var app = qlik.currApp();
			var variables = delimitedVars.split(','); // Todo: optimize & error check

			variables.forEach( function ( variable ) {

				app.variable.getContent( variable )
					.then( function ( model ) {
						$scope.variables[variable] = model;
						console.log('--');
						console.log('$scope', $scope);
						console.log( 'scope.variables', $scope.variables );
					}, function ( errorObject ) {
						console.log( 'err', errorObject );
					} );

			} );
		}

		return {
			load: load
		}


	});
