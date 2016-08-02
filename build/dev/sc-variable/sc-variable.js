define( [
	'qlik',
	'./sc-variable-loader'
], function ( qlik, variableLoader ) {
	'use strict';

	return {
		name: 'scVariable',
		restrict: 'E',
		replace: true,
		controller: ['$scope', function ( $scope ) {

			$scope.variables = []; // default value
			this.load = function ( attrs ) {
				variableLoader.load( $scope, attrs.content );
			};




		}],
		link: function ( scope, element ,attrs, ctrl ) {

			ctrl.load( attrs );

		}
	};
} );

