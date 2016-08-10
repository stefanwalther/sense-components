/**
 * Slider component
 *
 * @todo Watch the attributes
 * @todo Handles exceptions if start, startUpper, startLower is not set
 * @todo There is a weird bug if setting hideLabels ... ?!
 * @todo rtl not fully tested
 * @todo Default settings for rtl-support
 */
/*global define,_*/
define( [
		'angular',
		'qlik',
		'text!./sc-slider.ng.html',
		'./external/loglevel/loglevel.min',
		'./external/nouislider/nouislider.min',
		'./external/wnumb/wNumb',
		'css!./external/nouislider/nouislider.min.css',
		'css!./sc-slider.css'
	],
	function ( angular, qlik, ngTemplate, loglevel, noUiSlider, wNumb ) {
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
				sliderType: '@',
				min: '@',
				max: '@',
				start: '@',
				startLower: '@',
				startUpper: '@',
				qsVar: '@',
				qsVarLower: '@',
				qsVarUpper: '@',
				orientation: '@',
				direction: '@', 	//todo - Not fully working, yet
				tooltips: '@', 		//todo - Not fully working, yet
				hideLabels: '@', 	//todo - Not fully working, yet
				initFromQs: '@',
				debugLevel: '@'
			},
			link: function ( $scope, element, attrs ) {


				// Default value // todo still doesn' work properly ...
				$scope.hideLabels = angular.isDefined( $scope.hideLabels ) ? $scope.hideLabels == 'true' : false;

				var sliderType = (['range', 'single'].indexOf( $scope.sliderType ) >= 0 ? $scope.sliderType : 'single');
				var opts = null;
				var sliderInstance = null;

				// Todo: can probably be omitted, since the watcher is triggered anyhow all the time.
				initLocalOpts();

				// Set the labels, initially
				setLabels( getSliderConfig_start() ); //Todo: should be the value, not the min & max

				//Todo: I think this can be omitted, since the watcher is always triggered anyhow
				//initSlider( getSliderConfig() );

				$scope.$watchGroup(
					[
						'sliderType',
						'min',
						'max',
						'start',
						'startLower',
						'startUpper',
						'qsVar',
						'qsVarLower',
						'qsVarUpper',
						'orientation',
						'direction',
						'tooltips',
						'hideLabels',
						'initFromQs'
					], function ( newVal, oldVal ) {
						console.log( 'new settings recognized', newVal );
						initLocalOpts();
						initSlider( getSliderConfig() );
					} );

				$scope.$watch( 'logLevel', function ( newVal, oldVal ) {
					if ( newVal && newVal !== oldVal ) {
						if ( ['off', 'error', 'warn', 'info', 'log'].indexOf( $scope.debugLevel ) > -1 ) {
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
						if ( !sliderInstance ) {
							console.log( 'Initializing slider', config );
							var sliderElem = element.find( '.sc-slider-item' )[0];
							sliderInstance = noUiSlider.create( sliderElem, config );
							sliderInstance.on( 'change', function ( values, handle ) {
								console.log( 'new values', values );
								setLabels( values );
								initApp()
									.then( updateEngineVars.bind( null, getVarDefs() ) )
									.then( initSliderValues )
									.then( function () {

									} )
									.catch( function ( err ) {
										window.console.error( err ); //Todo: Could be a errorHandler we use everywhere
									} )
							} );
						} else {
							console.log( 'slider already there, setting the values', config );
							sliderInstance.updateOptions( config );

						}
					}
				}

				/**
				 * Initializes the global variable app.
				 * @returns {Promise}
				 */
				function initApp () {
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
					if ( opts.initFromQs ) {
						//getEngineVarListValues()
						defer.resolve();
					} else {
						defer.resolve();
					}
					return defer.promise;
				}

				/**
				 * Set the local options, based on the scope properties, but with some default-value logic.
				 *
				 * @private
				 */
				function initLocalOpts () {
					opts = {
						type: sliderType,
						min: angular.isDefined( $scope.min ) ? $scope.min : 0,
						max: angular.isDefined( $scope.max ) ? $scope.max : 100,
						startLower: (sliderType === 'single') ? $scope.start : $scope.startLower,
						startUpper: $scope.startUpper,
						qsVarLower: (sliderType === 'single') ? $scope.qsVar : $scope.qsVarLower,
						qsVarUpper: $scope.qsVarUpper,
						orientation: (['horizontal', 'vertical'].indexOf( $scope.orientation ) > -1) ? $scope.orientation : 'horizontal',
						direction: (['ltr', 'rtl'].indexOf( $scope.direction ) > -1) ? $scope.direction : 'ltr',
						tooltips: _.isBoolean( $scope.tooltips ) ? $scope.tooltips : true
					};
				}

				/**
				 * Checks if the required options for the slider are available or not.
				 *
				 * @param config
				 * @returns {boolean} Whether the required options are met or not.
				 * @private
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

					var toolTipConfig = [];
					return {
						start: getSliderConfig_start(),
						connect: (sliderType === 'range') ? true : false,
						range: {
							'min': parseInt( opts.min ),
							'max': parseInt( opts.max )
						},
						orientation: opts.orientation,
						format: wNumb( {
							decimals: 0,
							thousand: ',',
							postfix: ''
						} )
						//,
						//direction: opts.direction
						//tooltips: (opts.tooltips) ? [wNumb({ decimals: 0 })] : [false]
					};
				}

				function getSliderConfig_start () {
					return (sliderType === 'range') ? [parseInt( opts.startLower ), parseInt( opts.startUpper )] : [parseInt( opts.startLower )];
				}

				/**
				 * Returns a list of values in the following format:
				 *
				 * @todo: doc more in detail
				 *
				 * @param values
				 * @returns {Array}
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
				 * @param values
				 * @private
				 */
				function setLabels ( values ) {
					if ( values && !$scope.hideLabels === true ) {
						if ( sliderType === 'range' ) {
							element.find( '.sc-slider-label-left' )[0].innerHTML = values[0];
							if ( values.length === 2 ) {element.find( '.sc-slider-label-right' )[0].innerHTML = values[1];}
						} else {
							element.find( '.sc-slider-label-middle' )[0].innerHTML = values[0];
						}
					}
				}

				/**
				 * Update the defined Qlik Sense variables based on the values of the slider.
				 *
				 * @todo Handle non existing variables
				 *
				 * @param values
				 * @private
				 */
				function updateEngineVars ( varDefs ) {

					varDefs.forEach( function ( varDef ) {
						console.log( 'updateEngineVars:setvalue', varDef );

						ensureEngineVarExists( varDef.name )
							.then( function ( isVarExisting ) {
								app.variable.setContent( varDef.name, varDef.value )
									.then( function ( reply ) {
										angular.noop();
										console.log( 'Value set for variable ' + varDef.name + '. ', 'Return: ', reply );
									} );
							} )
							.catch( function ( err ) {
								window.console.error( 'updateEngineVars:error', err );
							} );

					} )
				}

				/**
				 * Checks if an engine var exists or not, if not a session var will be created.
				 *
				 * @param app
				 * @param varName
				 * @returns {*}
				 */
				function ensureEngineVarExists ( varName ) {

					var defer = $q.defer();
					engineVarExists( varName )
						.then( function ( result ) {
							if ( result ) {
								defer.resolve( true );
							} else {
								return createEngineSessionVar( varName );
							}
						} )
						.catch( function ( err ) {
							defer.reject( err );
						} );
					return defer.promise;
				}

				function createEngineSessionVar ( varName ) {
					return app.variable.create( {qName: varName} );
				}

				/**
				 * Returns a promise containing the information whether a variable exists.
				 *
				 * @param {object} app The current app.
				 * @param {string} varName The variable name.
				 * @returns {Promise} A promise containing the model of the variable, otherwise null..
				 */
				function engineVarExists ( varName ) {
					var defer = $q.defer();

					app.variable.getByName( varName )
						.then( function ( model ) {
							defer.resolve( model );
						}, function ( errorObject ) {
							window.console.error( 'engineVarExists: ', errorObject );
							defer.resolve( null );
						} );

					return defer.promise;
				}

				/**
				 * Retrieve the values of a list of variables.
				 *
				 * @description Since $q.all fails on the first error, we have to resolve all first
				 *
				 * @param {string[]} varList The variable names.
				 * @private
				 */
				function getEngineVarListValues ( varList ) {

					if ( varList && Array.isArray( varList ) ) {
						var promises = [];
						varList.forEach( function ( variable ) {
							promises.push( getEngineVarValue( variable ) )
						} );
						return $q.all( promises );
					}
					return $q.reject( new Error( 'getEngineVarListValues variable list passed.' ) );
				}

				/**
				 * Retrieve the value of a variable.
				 *
				 * @param {object} app The current Qlik Sense app instance.
				 * @param {string} varName The variable name.
				 * @returns {Promise} - Always returns a resolved promise, to be used in a $q.all scenario, which
				 * shouldn't fail if one of the variables doesn't exist.
				 * @private
				 */
				function getEngineVarValue ( varName ) {
					var defer = $q.defer();

					app.variable.getByName( varName )
						.then( function ( result ) {
							defer.resolve( {
								success: true,
								varName: varName,
								result: result
							} )
						} )
						.catch( function ( err ) {
							defer.resolve( {
								success: false,
								varName: varName,
								err: err
							} );
						} );
					return defer.promise;
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
			}
		};

	} );
