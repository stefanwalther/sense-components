/**
 * @owner Jose Fernandez (jfz)
 * @triad Web Toolkit
 */
define( [
	"jquery",
	"text!./qw-alert.ng.html",
	"css!./qw-alert.css"
], function ( $, template ) {
	'use strict';

	/**
	 *
	 * @usage
	 *
	 * <qw-alert closable="true" auto-close-after="10">This is the alert message</qw-alert>
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
			autoCloseAfter: "="
		},
		link: function ( scope, element ) {
			if ( scope.autoCloseAfter ) {
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
