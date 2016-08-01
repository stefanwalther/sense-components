/*global define,_*/
define( [
		'jquery',
		'qvangular',
		'qlik',
		'objects.extension/base-controller',
		'angular',

		'./wiVariableService',
		'./external/jquery-ui-slider-pips.modified',
		'css!./less/sc-slider.css'
	],
	function ( $, qvangular, qlik, BaseController, angular, wiVariableService ) {
		'use strict';

		var $injector = angular.injector(['ng']);
		var $timeout = $injector.get("$timeout");

		var wiSliderObjectController = function ( $scope ) {

			$scope.defaultValue = undefined;
			$scope.defaultValueMin = undefined;
			$scope.defaultValueMax = undefined;

			$scope.value = undefined;    // Holding the value if we only have a single one
			$scope.valueMin = undefined; // Range: min-value
			$scope.valueMax = undefined; // Range: max-value

			$scope.valuesInitialized = false;

			// Default values
			$scope.defaults = {
				min: 0,
				max: 100,
				step: 1,
				orientation: 'horizontal',
				useDecimals: false,
				range: false,
				inits: 'qs',

				// ticks are called ticks here, but in the plugin this refers to pips
				ticks: {
					enabled: true,

					labels: false,      // false or an Array
					first: 'label',     // First value, either 'pip', 'label' or false
					last: 'label',      // Last value, either 'pip', 'label' or false
					rest: 'pip',        // Rest values, either 'pip', 'label' or false
					prefix: '',
					suffix: '',
					step: 1
				},
				tooltips: {
					enabled: true,

					handle: true,
					pips: true,
					labels: true
				}
			};

			$scope.previousValue = {
				val: null,
				min: null,
				max: null
			};

		};

		// ****************************************************************************************
		// wiSlider Component
		// ~~
		// Properties:
		//  - min
		//  - max
		//  - step
		//  - orientation
		//  - range
		//  - bindLocal
		//  - bindLocalMin
		//  - bindLocalMax
		//  - bindQsVarMin
		//  - bindQsVarMax
		//  - inits
		// ****************************************************************************************
		qvangular.directive( 'wiSliderObject', ['wiVariableService', function ( wiSliderService ) {

			var compile = function ( tElement, tAttributes ) {

				function parseNumber ( n, decimals ) {
					return (decimals) ? parseFloat( n ) : parseInt( n );
				}

				function parseBool ( val ) {
					return (val === true || val === 'true');
				}

				// Weird implementation of parsing a string if there is a boolean value in it
				// Returns:
				//  - true if "true" is defined
				//  - false if "false" is defined
				//  - false if "" is defined
				//  - otherwise the defaultValue will be returned
				function parseBoolWeird ( val, defaultVal ) {
					if ( val === true || val === 'true' ) {
						return true;
					}
					else if ( val === false || val === 'false' ) {
						return false;
					}
					else {
						return defaultVal;
					}
				}

				var link = function ( $scope, element, attrs ) {

					var options = {};
					var timers = [];

					// We need this twice because we need it in the inner fn, not ideal ;-)
					var useDecimals = false; //(angular.isDefined(attrs.useDecimals) ? parseBool(attrs.useDecimals) : $scope.defaults.useDecimals);

					getOptions();

					// ****************************************************************************************
					// Main rendering method
					// ****************************************************************************************
					function render () {

						//console.log('--inside init');

						// Defining the value(s)
						// ---------------------------------------------
						// 1st get a best-guess by using the settings
						if ( !options.range && !angular.isDefined( $scope.defaultValue ) ) {

							//Todo: (B) - deal with decimals here
							$scope.defaultValue = parseNumber( (options.max - (options.min * -1)) / 2, useDecimals );
						}
						if ( options.range && (!angular.isDefined( $scope.defaultValueMin ) && !angular.isDefined( $scope.defaultValueMax )) ) {
							$scope.defaultValueMin = parseNumber( options.max - ((options.max - (options.min * -1)) / 3 * 2), useDecimals );
							$scope.defaultValueMax = parseNumber( options.max - ((options.max - (options.min * -1)) / 3 * 1), useDecimals );
							//console.log('defaultValueMin', $scope.defaultValueMin);
							//console.log('defaultValueMax', $scope.defaultValueMax);
						}

						//console.log('--:init:slider options', options);

						// Render the slider
						element.slider( options );

						setSliderValues();

						// Ticks
						//console.log('Ticks options', options.ticks);
						if ( options.ticks.enabled ) {

							// We call it "ticks", the plugin calls it "pips"
							element.slider( 'pips', options.ticks );
						}

						// Floats
						//console.log('floats options', options.tooltips);
						if ( options.tooltips.enabled ) {
							element.slider( 'float', options.tooltips );
						}

					} // render method

					function setSliderValues () {
						// Set Values
						if ( !options.range ) {
							element.slider( "value", $scope.value || $scope.defaultValue );
						} else {
							element.slider( "values", [$scope.valueMin || $scope.defaultValueMin, $scope.valueMax || $scope.defaultValueMax] );
						}
					}

					function getOptions () {

						options = {
							min: (angular.isDefined( attrs.min ) ? parseNumber( $scope.$parent.$eval( attrs.min ), useDecimals ) : $scope.defaults.min),
							max: (angular.isDefined( attrs.max ) ? parseNumber( $scope.$parent.$eval( attrs.max ), useDecimals ) : $scope.defaults.max),
							step: (angular.isDefined( attrs.step ) ? parseNumber( $scope.$parent.$eval( attrs.step ), useDecimals ) : $scope.defaults.step),
							orientation: (attrs.orientation === 'vertical' ? 'vertical' : $scope.defaults.orientation),
							range: (angular.isDefined( attrs.range ) ? parseBool( attrs.range ) : $scope.defaults.range),
							useDecimals: (angular.isDefined( attrs.useDecimals ) ? parseBool( attrs.useDecimals ) : $scope.defaults.useDecimals),
							ticks: {
								enabled: (angular.isDefined( attrs.ticks ) ? parseBoolWeird( $scope.$parent.$eval( attrs.ticks ), $scope.defaults.ticks.enabled ) : $scope.defaults.ticks.enabled),
								labels: (angular.isDefined( attrs.ticksLabels ) ? $scope.$parent.$eval( attrs.ticksLabels ) : $scope.defaults.ticks.labels),
								first: (angular.isDefined( attrs.ticksFirst ) ? parseBoolWeird( attrs.ticksFirst, $scope.defaults.ticks.first ) : $scope.defaults.ticks.first),
								last: (angular.isDefined( attrs.ticksLast ) ? parseBoolWeird( attrs.ticksLast, $scope.defaults.ticks.first ) : $scope.defaults.ticks.last),
								rest: (angular.isDefined( attrs.ticksRest ) ? parseBoolWeird( attrs.ticksRest, $scope.defaults.ticks.first ) : $scope.defaults.ticks.rest),
								prefix: (angular.isDefined( attrs.ticksPrefix ) ? attrs.ticksPrefix : $scope.defaults.ticks.prefix),
								suffix: (angular.isDefined( attrs.ticksSuffix ) ? attrs.ticksSuffix : $scope.defaults.ticks.suffix),
								step: (angular.isDefined( attrs.ticksStep ) ? parseNumber( attrs.ticksStep, useDecimals ) : $scope.defaults.ticks.step)
							},
							tooltips: {
								enabled: true,
								handle: (angular.isDefined( attrs.tooltipsHandle ) ? $scope.$parent.$eval( attrs.tooltipsHandle ) : $scope.defaults.tooltips.handle),
								pips: (angular.isDefined( attrs.tooltipsPips ) ? $scope.$parent.$eval( attrs.tooltipsPips ) : $scope.defaults.tooltips.pips),
								labels: (angular.isDefined( attrs.tooltipsLabels ) ? $scope.$parent.$eval( attrs.tooltipsLabels ) : $scope.defaults.tooltips.labels),
								prefix: (angular.isDefined( attrs.tooltipsPrefix ) ? attrs.tooltipsPrefix : $scope.defaults.tooltips.prefix),
								suffix: (angular.isDefined( attrs.tooltipsSuffix ) ? attrs.tooltipsSuffix : $scope.defaults.tooltips.suffix)
							}
						};

						if ( options.orientation === 'vertical' ) {
							//options.ticks.enabled = false;
							options.tooltips.enabled = false;
						}

						// Some validations
						if ( !_.isNumber( options.step ) || options.step === 0 ) {
							options.step = $scope.defaults.step;
						}

						// Prevent to many ticks
						if ( (options.max / options.step) > 100 ) {
							options.step = Math.floor( options.max / 100 );
							//console.log('Overruled range', options.step);
						}

						// Weird replacement
						// Todo: (B) - Weird again, optimize this
						if ( _.isString( options.ticks.first ) ) {
							options.ticks.first.replace( 'tick', 'pip' );
						}
						if ( _.isString( options.ticks.last ) ) {
							options.ticks.last.replace( 'tick', 'pip' );
						}
						if ( _.isString( options.ticks.rest ) ) {
							options.ticks.rest.replace( 'tick', 'pip' );
						}
					}

					//                    $scope.$watch(function () {
					//                        return {
					//                            min: attrs.min,
					//                            max: attrs.max,
					//                            step: attrs.step,
					//                            orientation: attrs.orientation,
					//                            range: $scope.$eval(attrs.range)
					//                        };
					//                    }, function (newVal, oldVal) {
					//
					//                        console.log('watcher:', newVal);
					//                        if (newVal !== undefined) {
					//                            console.log('call init from watcher');
					//                            render();
					//                        }
					//                    }, true);

					// Late-bind to prevent compiler clobbering
					timers.push( $timeout( function () {
						render();
					}, 0, true ) );

					// Retrieve the initial value(s)
					if (
						!$scope.valuesInitialized &&
						(
							(options.range && angular.isDefined( attrs.bindQsVarMin ) && angular.isDefined( attrs.bindQsVarMax )) ||
							(!options.range && angular.isDefined( attrs.bindQsVar ))
						)
					) {

						//console.log('OK, lets retrieve the values ...');

						var varMin = (options.range) ? attrs.bindQsVarMin : attrs.bindQsVar;
						var varMax = (options.range) ? attrs.bindQsVarMax : undefined;

						wiSliderService.getVariableContents( varMin, varMax )
							.then( function ( replies ) {

								var min, max;
								// Value or Min-Value
								if ( replies[0] && replies[0].qContent && replies[0].qContent.qIsNum ) {
									min = parseNumber( replies[0].qContent.qString, useDecimals );
								}
								// Nothing or Max-Value
								if ( replies[1] && replies[1].qContent && replies[1].qContent.qIsNum ) {
									max = parseNumber( replies[1].qContent.qString, useDecimals );
								}

								if ( options.range ) {
									$scope.valueMin = min;
									$scope.valueMax = max;
								} else {
									$scope.value = min;
								}

								//console.log('OK, lets set the slider values ...');
								setSliderValues();

							} )
							.catch( function ( err ) {
								// Todo: (A) - Add error handling here, as soon as the variable.getContent promise works correctly
								angular.noop();
							} )
							.finally( function () {
								$scope.valuesInitialized = true;
							} );

					}

					// Retrieve change-event from slider
					element.bind( 'slidechange', function ( event, ui ) {

						//console.log('--slide event', (ui.values || ui.value));
						if ( ui.values ) {
							if ( $scope.bindLocalMin ) {
								$scope.bindLocalMin = ui.values[0];
							}
							if ( $scope.bindLocalMax ) {
								$scope.bindLocalMax = ui.values[1];
							}
						} else {
							if ( $scope.bindLocal ) {
								$scope.bindLocal = ui.value;
							}
						}

						if ( $scope.valuesInitialized ) {
							updateQsValues( ui.values || ui.value );
						}
						//$scope.$apply();
					} );

					//Todo: (B) - As soon as the API calls are more robust add some error handling and optimize this code
					function updateQsValues ( sliderResult ) {

						var app = qlik.currApp();
						if ( _.isArray( sliderResult ) ) {

							//console.log('updateQsVariable:range', $scope.previousValue);
							if ( $scope.previousValue.min !== sliderResult[0] && _.isNumber( sliderResult[0] ) ) {

								//console.log('--update min');

								// Todo: (A) - Move to service
								app.variable.setContent( $scope.bindQsVarMin, '=(' + sliderResult[0] + ')' )
									.then( function ( reply ) {
										//Todo: (B) - Promise doesn't work in 0.96
										//console.log('--qsReturn:min', reply);
										if ( reply && reply.qReturn ) {
											$scope.previousValue.min = sliderResult[0];
										}
									} )
									.catch( function ( err ) {
										//Todo: (B) - Promise doesn't work in 0.96
										angular.noop();
										//console.error(err);
									} );
							} else {
								angular.noop();
								//console.error('sliderResult.min not valid or equal to previous value', sliderResult[0]);
							}

							if ( $scope.previousValue.max !== sliderResult[1] && _.isNumber( sliderResult[1] ) ) {

								//console.log('--update max');

								app.variable.setContent( $scope.bindQsVarMax, '=(' + sliderResult[1] + ')' )
									.then( function ( reply ) {
										//Todo: (B) - Promise doesn't work in 0.96
										//console.log('--qsReturn:max', reply);
										if ( reply && reply.qReturn ) {
											$scope.previousValue.max = sliderResult[1];
										}
									} )
									.catch( function ( err ) {
										//Todo: (B) - Promise doesn't work in 0.96
										console.error( err );
									} );
							} else {
								angular.noop();
								//console.error( 'sliderResult.max not valid or equal to previous value', sliderResult[1]);
							}

						} else {

							//console.log('updateQsVariable:single value', $scope.previousValue.val);
							if ( $scope.previousValue.val !== sliderResult && _.isNumber( sliderResult ) ) {

								//console.log('--update single');
								app.variable.setContent( $scope.bindQsVar, '=(' + sliderResult + ')' )
									.then( function ( reply ) {
										//Todo: (B) - Promise doesn't work in 0.96
										//console.log('--qsReturn:val', reply);
										if ( reply && reply.qReturn ) {
											$scope.previousValue.val = sliderResult;
										}
									} )
									.catch( function ( reply ) {
										angular.noop();
										//Todo: (B) - Promise doesn't work in 0.96
										//console.error(reply);
									} );
							} else {
								angular.noop();
								//console.error('sliderResult.single not valid or equal to previous value', sliderResult);
							}
						}
					}

					// Instead of a scope watcher bind to the window-resize the jQuery way
					$( window ).resize( function () {
						//console.log('window.resize, so render again');
						render();
					} );

					//                    element.on( 'resize', function () {
					//                        console.log('element resize');
					//                    });

					function destroyFn () {
						element.slider( 'destroy' );
						_.each( timers, function ( ctx ) {
							if ( angular.isFunction( ctx ) ) {
								ctx();
							}
						} );
					}
					element.bind( '$destroy', destroyFn );

				};
				return ( link );
			}; // (/compile)

			// Return the directive configuration
			return ({
				compile: compile,
				restrict: 'AE',
				controller: ['$scope', wiSliderObjectController],
				scope: {
					min: '=',
					max: '=',
					bindLocal: '=',
					bindLocalMin: '=',
					bindLocalMax: '=',
					bindQsVar: '@',
					bindQsVarMin: '@',
					bindQsVarMax: '@',
					inits: '@',
					useDecimals: '@',

					// Pips (Ticks)
					ticks: '@',         // (true | false), default: true
					ticksLabels: '@',   // (false | []), default: false
					ticksFirst: '@',    // (false | label | ticks), "ticks" to be renamed to pips
					ticksLast: '@',     // (false | label | ticks), "ticks" to be renamed to pips
					ticksRest: '@',     // (false | label | ticks), "ticks" to be renamed to pips
					ticksPrefix: '@',
					ticksSuffix: '@',
					ticksStep: '@',

					// Float
					tooltips: '@',
					tooltipsHandle: '@',
					tooltipsPips: '@',
					tooltipsLabels: '@',
					tooltipsPrefix: '@',
					tooltipsSuffix: '@'
				}
			});
		}] );

		return {
			name: 'scSlider',
			restrict: 'E',
			template: '<div wi-slider-object></div>',
			replace: true,
			link: function ( $scope, element /*, attrs */ ) {
				var className = 'scSlider';
				element.wrap( '<div class="' + className + '"></div>' );
			}
		};

	} );
