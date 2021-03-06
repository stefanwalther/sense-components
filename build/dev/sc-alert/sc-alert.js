define( [
	"underscore",
	"text!./sc-alert.ng.html",
	"css!./sc-alert.css"
], function ( _, template ) {
	'use strict';

	/**
	 * @name Alert component
	 * @description Render an alert in different colors within Qlik Sense.
	 * @example
	 * ```html
	 * <sc-alert closable="true" auto-close-after="10">This is the alert message</sc-alert>
	 * ```
	 *
	 * @todo Remove dependency from Leonardo-UI
	 *
	 * @param {boolean} `closable` - Whether the alert should be closable or not.
	 * @param {number} `autoCloseAfter` - If defined and greater than zero, the alert automatically hides after the
	 * value defined in milliseconds.
	 * @param {string} `type` - Chosen design. Possible values are `primary`, `info`, `success`, `warning`, `danger`, `inverse`. *(Default: null)*
	 *
	 * @api public
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
			type: "@"
		},
		controller: ['$scope', '$element', '$timeout', function ( $scope, $element, $timeout ) {

			$scope.alertVisible = true;
			$scope.onClose = function() {
				$scope.alertVisible = false;
			};

			if ( $scope.autoCloseAfter && _.isNumber( $scope.autoCloseAfter ) && $scope.autoCloseAfter > 0 ) {
				$timeout( function () {
					$scope.alertVisible = false;
				}, parseInt( $scope.autoCloseAfter ) );
			}
		}]
	};
} );
