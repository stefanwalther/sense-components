'use strict';

define( [], function () {
	'use strict';

	function addDirectives ( compileProvider, component ) {

		var directives = [];
		if (Array.isArray(component)) {
			component.forEach( function( directive) {
				directives.push(directive);
			})
		} else {
			directives.push(component);
		}
		directives.forEach( function ( directive ) {
			compileProvider.directive( directive.name, function () { return directive;} );
		} );
		}

	return {
		addDirectives: addDirectives
	};

} );

