'use strict';

define( [
	"angular",
	"src/sce-nested/sce-nested",
	"angularMocks",
	"lib/utils"
], function ( angular, sceNested, ngMocks, testUtils ) {

	describe( "sce-nested", function () {
		var qapp,
			$testScope,
			element;

		beforeEach( function () {
			qapp = angular.module( 'qapp', [] );
		} );

		beforeEach( module( 'qapp', function ( _$compileProvider_ ) {
			testUtils.addDirectives( _$compileProvider_, sceNested);
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

		it('testUtils is a function', function() {
			expect(testUtils).not.to.be.undefined;
			expect(testUtils).to.have.a.property('addDirectives');

		});

		it( 'qapp is an object and has two directives', function () {
			expect( qapp ).to.be.an.object;
			expect( qapp.directive.length ).to.be.equal( 2 );
		} );

		it( 'element should be an element', function () {
			expect( element ).to.exist;
		} );

		it( "should be able to du stuff", function () {
			var c = element.html();
			expect( c ).to.contain( 'I am the outer' );
		} );
	} );
} );
