'use strict';
define( [
	"angular",
	"src/sc-alert/sc-alert",
	"lib/utils",
	"angularMocks"
], function ( angular, scAlert, testUtils ) {

	describe( "sc-alert", function () {
		var qapp,
			$testScope,
			element;

		beforeEach( function () {
			qapp = angular.module( 'qapp', [] );
		} );

		beforeEach( module( 'qapp', function ( _$compileProvider_ ) {
			testUtils.addDirectives( _$compileProvider_, scAlert );
		} ) );

		describe( 'with default options', function () {

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

			it('should have "autoCloseAfter" not set', function() {
				expect($testScope.autoCloseAfter).to.be.undefined;
			});

			it('should have "closable" not set', function() {
				expect($testScope.closable).to.not.be.true;
			});

			it('should have "type" not set', function() {
				expect($testScope.type).to.be.empty;
			});


			it( 'should have by default class "sc-alert-default" and no other', function () {
				expect( element[0].querySelector( 'div.msg' ) ).to.exist;
				expect( element.hasClass( 'sc-alert-default' ) ).to.be.true;
				expect( element.hasClass( 'sc-alert-success' ) ).to.be.false;
				expect( element.hasClass( 'sc-alert-info' ) ).to.be.false;
				expect( element.hasClass( 'sc-alert-warning' ) ).to.be.false;
				expect( element.hasClass( 'sc-alert-danger' ) ).to.be.false;
				expect( element.hasClass( 'sc-alert-success' ) ).to.be.false;
			} );

			it( 'should by default have not close icon', function () {
				expect( element[0].querySelector( 'span.close-icon' ) ).to.not.exist;
			} )
		} );

		describe( 'with closable set to "true"', function () {
			beforeEach( inject( function ( _$rootScope_, _$compile_ ) {
				var htmlSkeleton = '<sc-alert closable="true"></sc-alert>';
				element = angular.element( htmlSkeleton );

				$testScope = _$rootScope_.$new();
				_$compile_( element )( $testScope );
				$testScope.$digest();
			} ) );

			it( 'the close icons should be shown', function () {
				expect( element[0].querySelector( 'span.close-icon' ) ).to.exist;
			} );

			it('should be hidden after clicking on the close icon', function() {
				element[0].querySelector( 'span.close-icon' ).click();
				$testScope.$digest();
				expect(element.isolateScope().alertVisible).to.be.false;
				expect( element.hasClass('ng-hide') ).to.be.true;
			})
		} );

		describe( 'with autoclose set to "true"', function () {
			beforeEach( inject( function ( _$rootScope_, _$compile_ ) {
				var htmlSkeleton = '<sc-alert auto-close-after="true"></sc-alert>';
				element = angular.element( htmlSkeleton );

				$testScope = _$rootScope_.$new();
				_$compile_( element )( $testScope );
				$testScope.$digest();
			} ) );

			it( 'nothing should happen, only numbers are allowed', function ( done ) {
				setTimeout( function () {
					expect( element ).to.exist;
					expect( element.hasClass('ng-hide') ).to.be.false;
					done();
				}, 300 );
			} )
		} );

		describe( 'with autoclose set to "200"', function () {
			var $timeout;
			beforeEach( inject( function ( _$rootScope_, _$compile_, _$timeout_ ) {
				var htmlSkeleton = '<sc-alert auto-close-after="100"></sc-alert>';
				element = angular.element( htmlSkeleton );

				$testScope = _$rootScope_.$new();
				$timeout = _$timeout_;
				_$compile_( element )( $testScope );
				$testScope.$digest();
			} ) );

			it( 'the element should disappear', function ( ) {

				setTimeout( function () {
					expect( element.hasClass('ng-hide') ).to.be.true;
					done();
				}, 300 );
			} )
		} );

	} );
} );
