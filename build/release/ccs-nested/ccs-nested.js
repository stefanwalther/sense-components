/*global define*/
define( [
	'qvangular'
], function ( qvangular ) {
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
	qvangular.directive( 'ccsNestedItem', function () {
		return {
			restrict: 'E',
			require: '^ccsNested',
			template: '<div style="margin-left:30px;">I am a inner</div>',
			link: function ( scope, elem, attr, outerCtrl ) {
				outerCtrl.addItem( 1 );
			}
		}
	} );

	return {
		name: "ccsNested",
		restrict: 'E',
		transclude: true,
		template: '<div>i am a outer<div ng-transclude></div>(end of outer)</div>',
		controller: function ( $scope ) {
			this.addItem = function ( val ) {
				console.log( val );
			}
		}
	};
} );
