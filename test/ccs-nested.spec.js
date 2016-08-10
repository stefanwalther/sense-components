define( ["angular", "src/sce-nested/sce-nested", "angularMocks"], function ( angular, sceNested ) {

	describe( "Sense nested component", function () {
		var qapp, $rootScope, $testScope, $injector, $compile, element;
		qapp = angular.module( 'qapp', [] );
		angular.bootstrap( document, ['qapp'] );

		// $parentScope = qapp.$rootScope.$new( true );
		$injector = angular.element( document ).injector();
		$rootScope = angular.element( document ).scope().$root;//$injector.get( "$rootScope" );
		$compile = $injector.get( "$compile" );

		before( function () {
			$testScope = $rootScope.$new( true );
			sceNested.forEach( function ( component ) {
				console.log( component.name, component );
				qapp.directive( component.name, function () { return component;} );
			} );

			element = $compile( '<sce-nested>' +
				'<sce-nested-item></sce-nested-item>' +
				'<sce-nested-item></sce-nested-item>' +
				'</sce-nested>' )( $testScope );
			$rootScope.$apply();
		} );

		after( function () {

		} );

		it( "should be able to du stuff", function () {
			console.log($rootScope);
			console.log( $injector.has( "sceNestedDirective" ) );
			console.log( element );
		} );
	} );
} );
