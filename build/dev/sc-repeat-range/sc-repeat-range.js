/*global define,require,console*/
define( [],
	function () {
		'use strict';

		var $injector = angular.injector(['ng']);
		var $compile = $injector.get("$compile");

		return {
			name: 'scRepeatRange',
			replace: true,
			scope: {
				from: '=',
				to: '=',
				step: '='
			},
			link: function ( scope, element, attrs ) {

				// returns an array with the range of numbers
				// you can use _.range instead if you use underscore
				function range(from, to, step) {
					var array = [];
					while (from + step <= to)
						array[array.length] = from += step;

					return array;
				}

				// prepare range options
				var from = scope.from || 0;
				var step = scope.step || 1;
				var to   = scope.to || attrs.ngRepeatRange;

				// get range of numbers, convert to the string and add ng-repeat
				var rangeString = range(from, to + 1, step).join(',');
				angular.element(element).attr('ng-repeat', 'n in [' + rangeString + ']');
				angular.element(element).removeAttr('ng-repeat-range');

				$compile(element)(scope);
			}
		};
	} );
