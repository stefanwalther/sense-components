define( [
	"angular",
	"jquery",
	"underscore",
	"./external/flatpickr/flatpickr.min",
	"css!./external/flatpickr/flatpickr.min.css",
	"css!./sc-flatpickr-style-override.css"
], function ( angular, $, _ ) {
	'use strict';

	return {
		name: "scDatepicker",
		restrict: 'E',
		replace: true,
		template: '<input class="lui-input scDatepicker" />',
		scope: {
			date: '=',
			width: "@"
		},
		link: function ( scope, elem ) {

			var opts = {};

			elem.css( 'width', scope.width );

			var e = angular.element( elem )[0];
			var datePickr = new window.flatpickr( e, opts );

			datePickr.config.onChange = function ( dateObj ) {
				console.log( dateObj );
			};

		}
	};
} );
