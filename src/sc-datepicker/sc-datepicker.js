/**
 * @todo
 * - allowInput: doesn't seem to work ...
 */
/*global define*/
define( [
	"angular",
	"jquery",
	"underscore",
	"text!./sc-datepicker.ng.html",
	"./external/flatpickr/flatpickr.min",
	"css!./external/flatpickr/flatpickr.material_orange.min.css",
	"css!./sc-flatpickr-style-override.css"
], function ( angular, $, _, ngTemplate ) {
	'use strict';

	function isTrue ( o ) {
		return o && o.toLowerCase() === 'true';
	}

	return {
		name: "scDatepicker",
		restrict: 'E',
		replace: true,
		template: ngTemplate,
		scope: {
			width: '@',				// Width of the input element
			inline: '='
		},
		link: function ( scope, elem, attrs ) {

			var opts = {
				allowInput: false,
				weekNumbers: scope.$eval( attrs.weekNumbers ),
				inline: scope.inline
			};
			// console.log('opts', opts);

			// Element styling
			elem.css( 'width', scope.width );

			var e = angular.element( elem )[0];
			var datePickr = new Flatpickr( e, opts );

			datePickr.config.onChange = function ( dateObj ) {
				scope.selectedDate = dateObj;
				//Todo: Set to variable or whatever
			};

		}
	};
} );
