'use strict';
define( ["angular", "src/sc-alert/sc-alert", "angularMocks"], function ( angular, scAlert ) {

	describe.only( "sc-alert", function () {
		var qapp,
			$testScope,
			element;

		beforeEach( function () {
			qapp = angular.module( 'qapp', [] );
		} );

		beforeEach( module( 'qapp', function ( $compileProvider ) {
			var directives = [];
			if (Array.isArray(scAlert)) {
				scAlert.forEach( function( directive) {
					directives.push(directive);
				})
			} else {
				directives.push(scAlert);
			}
			directives.forEach( function ( component ) {
				$compileProvider.directive( component.name, function () { return component;} );
			} );
		} ) );

		beforeEach( inject( function ( _$rootScope_, _$compile_ ) {
			var htmlSkeleton = '<sc-alert></sc-alert>';
			element = angular.element( htmlSkeleton );

			$testScope = _$rootScope_.$new();
			_$compile_( element )( $testScope );
			$testScope.$digest();
		} ) );

		it( 'qapp is an object and the component(s) are registered', function () {
			expect( qapp ).to.be.an.object;
			expect( qapp.directive.length ).to.be.equal( 2 );
		} );

		it( 'element should be an element', function () {
			expect( element ).to.exist;
		} );

	} );
} );
