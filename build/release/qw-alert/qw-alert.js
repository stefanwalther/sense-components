/**
 * @owner Jose Fernandez (jfz)
 * @triad Web Toolkit
 */
define( [
	"jquery",
	"underscore",
	"text!./qw-alert.ng.html",
	"css!./qw-alert.css"
], function ( $, _, template ) {
	'use strict';

	/**
	 *
	 * @usage
	 *
	 * <qw-alert closable="true" auto-close-after="10">This is the alert message</qw-alert>
	 *
	 * @todo
	 * - Error handling in case autoCloseAfter is not a numeric value
	 * - Convert the .css to a .less file
	 *
	 */
	return {
		name: "qwAlert",
		restrict: 'E',
		replace: true,
		transclude: true,
		template: template,
		scope: {
			closable: "=",
			autoCloseAfter: "=",
			design: "@"
		},
		link: function ( scope, element ) {
			if ( scope.autoCloseAfter && _.isNumber(scope.autoCloseAfter) && scope.autoCloseAfter > 0 ) {
				setTimeout( function () {
					scope.onClose();
				}, parseInt(scope.autoCloseAfter) );
			}


			scope.onClose = function () {
				element.remove();
			};
		}
	};
} );
