define( [
	"jquery",
	"underscore",
	"text!./sc-alert.ng.html",
	"css!./sc-alert.css"
], function ( $, _, template ) {
	'use strict';

	/**
	 *
	 * @usage
	 *
	 * <cc-alert closable="true" auto-close-after="10">This is the alert message</cc-alert>
	 *
	 */
	return {
		name: "scAlert",
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
