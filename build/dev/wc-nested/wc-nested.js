/*global define*/
define( [
	'qvangular'
], function ( qvangular ) {
	'use strict';

	qvangular.directive( 'wcNestedItem', function () {
		return {
			restrict: 'E',
			require: '^wcNested',
			template: '<div style="margin-left:30px;">i am a inner</div>',
			link: function ( scope, elem, attr, outerCtrl ) {
				outerCtrl.addItem( 1 );
			}
		}
	} );

	return {
		name: "wcNested",
		restrict: 'E',
		transclude: true,
		template: '<div>i am a outer<div ng-transclude></div>end of outer</div>',
		controller: function ( $scope ) {
			this.addItem = function ( val ) {
				console.log( val );
			}
		}
	};
} );
