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
	 * <sce-nested>
	 *     <sce-nested-item></sce-nested-item>
	 *     <sce-nested-item></sce-nested-item>
	 * </sce-nested>
	 *
	 *
	 */

	return [
		{
			name: "sceNested",
			restrict: 'E',
			transclude: true,
			template: '<div>I am the outer<div ng-transclude></div>(end of outer)</div>',
			controller: function ( /*$scope*/ ) {
				this.addItem = function ( val ) {
					console.log( val );
				}
			}
		},
		{
			name: "sceNestedItem",
			restrict: 'E',
			require: '^sceNested',
			template: '<div style="margin-left:30px;">I am a inner</div>',
			link: function ( scope, elem, attr, outerCtrl ) {
				outerCtrl.addItem( 1 );
			}
		}
	];
} );
