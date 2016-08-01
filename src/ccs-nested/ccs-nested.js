/*global define*/
define( [], function () {
	'use strict';

	/**
	 *
	 * @description
	 *
	 * Note: The prefix ccs stands for "Custom Component Sample"
	 *
	 * @example
	 *
	 * <ccs-nested>
	 *     <ccs-nested-item></ccs-nested-item>
	 *     <ccs-nested-item></ccs-nested-item>
	 * </ccs-nested>
	 *
	 *
	 */

	return [
		{
			name: "ccsNested",
			restrict: 'E',
			transclude: true,
			template: '<div>i am a outer<div ng-transclude></div>(end of outer)</div>',
			controller: function ( $scope ) {
				this.addItem = function ( val ) {
					console.log( val );
				}
			}
		},
		{
			name: "ccsNestedItem",
			restrict: 'E',
			require: '^ccsNested',
			template: '<div style="margin-left:30px;">I am a inner</div>',
			link: function ( scope, elem, attr, outerCtrl ) {
				outerCtrl.addItem( 1 );
			}
		}
	];
} );
