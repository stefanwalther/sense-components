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

	return {
		name: "qwAlert",
		restrict: 'E',
		replace: true,
		transclude: true,
		template: template,
		scope: {
			closable: "=",
			closeOnTimeout: "="
		},
		link: function ( scope, element ) {
			if ( scope.closeOnTimeout ) {
				setTimeout( function () {
					scope.onClose();
				}, scope.closeOnTimeout );
			}

			scope.onClose = function () {
				element.remove();
			};
		}
	};
} );
