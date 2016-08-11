/**
 * Slider component
 *
 * @todo rtl not fully tested
 * @todo Default settings for rtl-support
 */
/*global define,_*/
define( [
		'angular',
		'qlik',
		'text!./sc-slider.ng.html',
		'./variable-utils',
		'./external/loglevel/loglevel.min',
		'./external/nouislider/nouislider.min',
		'./external/wnumb/wNumb',
		'css!./external/nouislider/nouislider.min.css',
		'css!./sc-slider.css'
	],
	function ( angular, qlik, ngTemplate, varUtils, loglevel, noUiSlider, wNumb ) {
		'use strict';

		var $injector = angular.injector( ['ng'] );
		var $timeout = $injector.get( "$timeout" );
		var $q = $injector.get( "$q" );
		var app = null;

		return {
			name: 'scSlider',
			restrict: 'E',
			replace: true,
			template: ngTemplate,
			scope: {
				type: '@',
				min: '@',
				max: '@',
				start: '@',
				startLower: '@',
				startUpper: '@',
				step: '=',
				qsVar: '@',
				qsVarLower: '@',
				qsVarUpper: '@',
				orientation: '@',
				direction: '@', 	//todo - Not fully working, yet
				tooltips: '=',
				hideLabel: '=',
				initFromQs: '@',
				debugLevel: '@'
			},
			controller: function ( $scope ) {

				$scope.initValues = function () {
					$scope.min = ($scope.min) ? $scope.min : 0;
					$scope.max = ($scope.max) ? $scope.max : 100;
					$scope.start = ($scope.start) ? $scope.start : Math.ceil( $scope.max / 2 );
					$scope.startLower = ($scope.startLower) ? $scope.startLower : $scope.min;
					$scope.startUpper = ($scope.startUpper) ? $scope.startUpper : $scope.max;
					$scope._type = (['range', 'single'].indexOf( $scope.type ) >= 0 ? $scope.type : 'single');
				};
				$scope.initValues();

			},
			link: function ( scope, element, attrs ) {

				ensureApp();
				console.log( varUtils );

				var opts = null;
				var sliderInstance = null;

				// Todo: can probably be omitted, since the watcher is triggered anyhow all the time.
				initLocalOpts();

				scope.$watchGroup(
					[
						'type',
						'min',
						'max',
						'start',
						'startLower',
						'startUpper',
						'step',
						'qsVar',
						'qsVarLower',
						'qsVarUpper',
						'orientation',
						'direction',
						'tooltips',
						'hideLabel',
						'initFromQs'
					], function ( newVal, oldVal ) {
						console.log( 'new settings recognized', newVal );
						scope.initValues();
						initLocalOpts();
						console.log( 'after initLocalOpts', opts.type, scope._type );
						initSlider( getSliderConfig() );
					} );

				scope.$watch( 'logLevel', function ( newVal, oldVal ) {
					if ( newVal && newVal !== oldVal ) {
						if ( ['off', 'error', 'warn', 'info', 'log'].indexOf( scope.debugLevel ) > -1 ) {
							//Logger.setLevel( newVal );

						}
					}
				} );

				// *****************************************************************************************************

				/**
				 * Create the slider and apply options if the slider is not instantiated, otherwise the existing slider
				 * will be updated with the given configuration.
				 *
				 * @param config
				 * @private
				 */
				function initSlider ( config ) {
					if ( sliderRequirementsCheck( config ) ) {

						var sliderElem = element.find( '.sc-slider-item' )[0];

						// Since there are only a few options which can be updated with .updateOptions,
						// let's destroy and re-create the slider
						if ( sliderElem.noUiSlider ) {
							sliderElem.noUiSlider.off();
							sliderElem.noUiSlider.destroy();
						}
						sliderInstance = noUiSlider.create( sliderElem, config );
						sliderInstance.on( 'change', slider_ChangeHandler );
						sliderInstance.on( 'update', slider_UpdateHandler );
						slider_OnInit();
					}
				}

				function slider_OnInit () {
					initSliderValues()
						.then( function ( result ) {
							console.log( 'initValues', result );
						} )
						.catch( function ( err ) {
							console.log( 'initValues: ', err );
						} )
				}

				function slider_ChangeHandler ( values, handle ) {
					console.log( 'new values', values );
					ensureApp()
						.then( varUtils.updateEngineVars.bind( null, app, getVarDefs() ) )
						.catch( function ( err ) {
							window.console.error( 'initSlider: ', err ); //Todo: Could be a errorHandler we use everywhere
						} )
				}

				function slider_UpdateHandler ( values, handle ) {
					setLabel( values );
				}

				/**
				 * Initializes the global variable app.
				 * @returns {Promise}
				 */
				function ensureApp () {
					return ensureApp();
				}

				/**
				 * Initializes the slider values from the Engine's variable values.
				 *
				 * @description
				 * This is only applicable if variables are defined and they have a valid value:
				 *    - inside min & max
				 *    - lower variable's value not higher then the upper variable's value, etc.
				 *
				 *    Fetching the initial values can also be turned off by the setting `initFromQs`
				 */
				function initSliderValues () {
					var defer = $q.defer();
					var varDefs = getVarDefs();
					if ( opts.initFromQs ) {
						varUtils.getEngineVarListValues( app, varDefs.map( function ( v ) { return v.name} ) )
							.then( function ( reply ) {

								console.log( 'getEngineVarListValues: ', reply );
								// var values = [];
								// result.forEach( function( varModel) {
								// 	values.push(varModel.layout.qNum);
								// });
								// console.log('values', values);
								// Todo: Check errors in the result, the promise always returns true!!!

								if ( reply.result ) {
									if ( opts.type === 'single' ) {
										scope.start = Math.ceil( reply[0].result.layout.qNum );
									} else {
										scope.startLower = Math.ceil( reply[0].result.layout.qNum );
										scope.startUpper = Math.ceil( reply[1].result.layout.qNum );
									}
								}
							} )
							.catch( function ( err ) {
								console.log( err ); //Todo: completely unnecessary, since the promise always returns true!!!
							} );

						//defer.resolve();
					} else {
						defer.resolve();
					}
					return defer.promise;
				}

				/**
				 * Set the local options, based on the scope properties, but with some default-value logic.
				 *
				 * Todo: We can get rid of this code, just put all the defaults to the controller.
				 *
				 * @private
				 */
				function initLocalOpts () {

					opts = {
						type: scope._type,
						min: angular.isDefined( scope.min ) ? scope.min : 0,
						max: angular.isDefined( scope.max ) ? scope.max : 100,
						step: (scope.step && _.isNumber( scope.step )) ? parseFloat( scope.step ) : 1,
						startLower: (scope._type === 'single') ? scope.start : scope.startLower,
						startUpper: scope.startUpper,
						qsVarLower: (scope._type === 'single') ? scope.qsVar : scope.qsVarLower,
						qsVarUpper: scope.qsVarUpper,
						orientation: (['horizontal', 'vertical'].indexOf( scope.orientation ) > -1) ? scope.orientation : 'horizontal',
						direction: (['ltr', 'rtl'].indexOf( scope.direction ) > -1) ? scope.direction : 'ltr',
						tooltips: scope.tooltips,
						initFromQs: true // todo: make that dynamic
					};
				}

				/**
				 * Checks if the required options for the slider are available or not.
				 *
				 * @param config
				 * @returns {boolean} Whether the required options are met or not.
				 * @public
				 */
				function sliderRequirementsCheck ( config ) {
					if ( !config.start ) {
						return false;
					}
					return true;
				}

				/**
				 * Get the options for the slider.
				 *
				 * @returns {object} The configuration object for the slider.
				 * @private
				 */
				function getSliderConfig () {

					return {
						start: getSliderConfig_start(),
						connect: (scope._type === 'range') ? true : false,
						range: {
							'min': parseInt( opts.min ),
							'max': parseInt( opts.max )
						},
						orientation: opts.orientation,
						format: wNumb( {
							decimals: 0
						} ),
						step: opts.step,
						//,
						//direction: opts.direction
						tooltips: opts.tooltips
					};
				}

				function getSliderConfig_start () {
					return (scope._type === 'range') ? [parseInt( opts.startLower ), parseInt( opts.startUpper )] : [parseInt( opts.startLower )];
				}

				/**
				 * @type VariableDefinition
				 */

				/**
				 * Returns a list of values in the following format:
				 *
				 * @todo: doc more in detail
				 *
				 * @param values
				 * @returns {Array<VariableDefinition>}
				 */
				function getVarDefs ( values ) {

					if ( !values ) {
						values = sliderInstance.get();
					}

					var d = [];
					d.push( {
						name: opts.qsVarLower,
						value: values[0]
					} );
					if ( opts.type === 'range' ) {
						d.push( {
							name: opts.qsVarUpper,
							value: values[1]
						} )
					}
					return d;
				}

				/**
				 * Set the values for labels.
				 *
				 * @param values {Array<number>} Array of values
				 * @private
				 */
				function setLabel ( values ) {
					var labelValue = '';
					if ( values && !scope.hideLabel ) {
						labelValue = values[0];
						if ( scope._type === 'range' ) {
							labelValue += ' - ' + values[1];
						}
						element.find( '.sc-slider-label' )[0].innerHTML = labelValue;
					}
				}

				//Todo: Move this to initApp ... breaking out does not make it more readable in this case
				function ensureApp () {
					var defer = $q.defer();
					if ( !app ) {
						// Todo: Might be changed later on to reflect enigma's logic to fetch the current app
						// (returning always a promise)
						app = qlik.currApp();
					}
					defer.resolve( app );
					return defer.promise;
				}

				scope.$on( '$destroy', function () {
					if ( sliderInstance ) {
						sliderInstance.off();
						sliderInstance.destroy();
					}
				} );
			}
		};

	} );
