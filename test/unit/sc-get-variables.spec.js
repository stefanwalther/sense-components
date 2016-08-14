'use strict';
define( [
	"angular",
	"src/sc-get-variables/sc-get-variables",
	"lib/utils",
	"angularMocks"
], function ( angular, scGetVariables, testUtils ) {

	describe( "sc-get-variables", function () {
		var qapp,
			$testScope,
			element;

		beforeEach( function () {
			qapp = angular.module( 'qapp', [] );
		} );

		beforeEach( module( 'qapp', function ( _$compileProvider_ ) {
			testUtils.addDirectives( _$compileProvider_, scGetVariables );
		} ) );

		describe( 'with default options', function () {

			beforeEach( inject( function ( _$rootScope_, _$compile_ ) {
				var htmlSkeleton = '<sc-get-variables></sc-get-variables>';
				element = angular.element( htmlSkeleton );

				$testScope = _$rootScope_.$new();
				_$compile_( element )( $testScope );
				$testScope.$digest();
			} ) );

			it( 'qapp is an object and the component(s) are registered', function () {
				expect( qapp ).to.be.an.object;
				expect( qapp.directive.length ).to.be.equal( 2 );
			} );

			it( 'element should be an element without any further properties', function () {
				expect( element ).to.exist;
				expect( element[0].outerHTML).to.be.equal('<sc-get-variables class="ng-scope"></sc-get-variables>');
			} );

		} );

	} );
} );
