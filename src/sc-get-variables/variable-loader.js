/*global define*/
/**
 * @todo Break out to sense-extension-utils
 */
define( [
		'angular',
		'qlik',
		'underscore'
	],
	function ( angular, qlik, _ ) {
		'use strict';

		var $injector = angular.injector( ['ng'] );
		var $q = $injector.get( "$q" );

		/**
		 * Load values of a comma delimited list of variables.
		 *
		 * @param {string} delimitedVars Comma delimited list of variables.
		 * @returns {Promise<[VariableResult],Error>}
		 */
		function loadVariables ( delimitedVars ) {

			var app = qlik.currApp();
			var promises = [];

			if ( !_.isEmpty( delimitedVars ) ) {
				var variables = delimitedVars.split( ',' );
				variables.forEach( function ( variable ) {
					promises.push( loadVariable( app, variable ) );
				} );
			}

			return $q.all( promises );
		}

		/**
		 * @typedef {Object} VariableResult
		 * @property {string} varName The variable name
		 * @property {object} qContent
		 * @property {number} qContent.isNum Whether the variable contains a numeric value or not.
		 * @property {string} qContent.qString The variables value as string.
		 */

		/**
		 * Loads a variable and returns a promise.
		 *
		 * @param {string} varName The name of the variable.
		 * @param {Object} app Instance to the current app.
		 *
		 * @returns {Promise<VariableResult,Error>} Returns a promise containing an array of {@link VariableResult} if resolved,
		 * or an Error if rejected.
		 */
		function loadVariable ( app, varName ) {
			var defer = $q.defer();
			app.variable.getContent( varName.trim() )
				.then( function ( reply ) {
					var r = {
						varName: varName,
						qContent: reply.qContent
					};
					defer.resolve( r );
				} )
				.catch( function ( err ) {
					defer.reject( err );
				} );
			return defer.promise;
		}

		return {
			load: loadVariables
		}

	} );
