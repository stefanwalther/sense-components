'use strict';
define( ["angular", "src/sce-nested/sce-nested", "angularMocks"], function ( angular, sceNested ) {

	describe( "Sense nested component", function () {
		var qapp,
			$rootScope,
			$testScope,
			$injector,
			$compile,
			element;

		// $parentScope = qapp.$rootScope.$new( true );

		beforeEach( function () {
			qapp = angular.module( 'qapp', [] );
		} );

		beforeEach( module( 'qapp', function ( $compileProvider ) {
			sceNested.forEach( function ( component ) {
				$compileProvider.directive( component.name, function () { return component;} );
			} );
		} ) );

		beforeEach( inject( function ( _$rootScope_, _$compile_ ) {
			var nestedItem = '<sce-nested><sce-nested-item></sce-nested-item><sce-nested-item></sce-nested-item></sce-nested>';
			element = angular.element( nestedItem );

			$testScope = _$rootScope_.$new();
			_$compile_( element )( $testScope );
			$testScope.$digest();
		} ) );

		after( function () {

		} );

		it( 'just a chai test', function () {
			expect( 'foo' ).to.not.contain( 'bar' );
			expect( 'foo' ).to.contain( 'foo' );
		} );

		it( 'qapp is an object and has two directives', function () {
			expect( qapp ).to.be.an.object;
			expect( qapp.directive.length ).to.be.equal( 2 );
		} );

		it( 'element should be an element', function () {
			expect( element ).to.exist;
		} );

		it( "should be able to du stuff", function () {
			var c = element.html();
			expect( c ).to.contain( 'i am a outer' );
		} );
	} );
} );
