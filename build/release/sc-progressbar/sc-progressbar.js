/*global define*/
/**
 * @todo
 * - Discuss what actually the best practice is:
 *    - in qWidget templateUrl was used, but templateUrl has the drawback of a weak url (thinking of forwards-compatibility)
 * - Loading of wiBootstrap.css should be a central component or at least optimized ... talk to aaz
 */
define( [
	'jquery',
	'angular',
	'underscore',

	'./utils',

	'text!./template/bar.html',
	'text!./template/progress.html',
	'text!./template/progressbar.html',

	'text!./wiBootstrap.css'


	// templates
], function ( $, angular, _, utils, ngBar, ngProgress, ngProgressbar, cssBootstrap ) {

	'use strict';

	// Default Values
	var config = {
		animate: false,
		max: 100
	};

	var ProgressController = function ( $scope, $attrs ) {
		var self = this;
		var animate = angular.isDefined( $attrs.animate ) ? $scope.$parent.$eval( $attrs.animate ) : config.animate;

		this.bars = [];
		$scope.max = angular.isDefined( $attrs.max ) ? $scope.$parent.$eval( $attrs.max ) : config.max;

		this.addBar = function ( bar, element ) {
			if ( !animate ) {
				element.css( {'transition': 'none'} );
			}

			this.bars.push( bar );

			bar.$watch( 'value', function ( value ) {
				bar.percent = +(100 * value / $scope.max).toFixed( 2 );
			} );

			bar.$on( '$destroy', function () {
				element = null;
				self.removeBar( bar );
			} );
		};

		this.removeBar = function ( bar ) {
			this.bars.splice( this.bars.indexOf( bar ), 1 );
		};
	};

	/**
	 * wc-progressbar component.
	 */
	var components = [
		{
			name: "ccProgressbar",
			restrict: 'E',
			replace: true,
			transclude: true,
			controller: ["$scope", "$attrs", ProgressController],
			scope: {
				value: '=',
				type: '@'
			},
			template: ngProgressbar,
			compile: function ( element, attributes, transclude ) {

				// Todo: Just load within another compoment, would be cleaner ...
				utils.addStyleToHeader( 'wcBootstrap', cssBootstrap );

				return {
					pre: function ( scope, element, attributes, controller, transcludeFn ) {

						var $bootstrapContainer = $( document.createElement( 'div' ) );
						$bootstrapContainer.addClass( 'wi-bs' ); //Todo: Change prefix to wc
						element.wrap( $bootstrapContainer );

					},
					post: function ( scope, element, attributes, progressCtrl, transcludeFn ) {
						progressCtrl.addBar( scope, angular.element( element.children()[0] ) );
					}
				};
			}
		},
		{
			name: "scProgress",
			restrict: 'E',
			replace: true,
			transclude: true,
			controller: ["$scope", "$attrs", ProgressController],
			require: 'scProgress',
			scope: {},
			template: ngProgress
		},
		{
			name: "scBar",
			restrict: 'E',
			replace: true,
			transclude: true,
			require: '^scProgress',
			scope: {
				value: '=',
				design: '@'
			},
			template: ngBar,
			link: function ( scope, element, attrs, progressCtrl ) {
				progressCtrl.addBar( scope, element );
			}
		}
	];

	return components;

} );
