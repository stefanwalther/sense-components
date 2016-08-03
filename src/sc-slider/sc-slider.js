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
		'./external/nouislider/nouislider.min',
		'./external/wnumb/wNumb',
		'css!./external/nouislider/nouislider.min.css',
		'css!./sc-slider.css'
	],
	function ( angular, qlik, ngTemplate, noUiSlider, wNumb ) {
		'use strict';

		var $injector = angular.injector( ['ng'] );
		var $timeout = $injector.get( "$timeout" );
		var $q = $injector.get( "$q" );

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
				hideLabels: '@' 	//todo - Not fully working, yet
			},
			link: function ( $scope, element, attrs ) {

				// Default value // todo still doesn' work properly ...
				$scope.hideLabels = angular.isDefined( $scope.hideLabels ) ? $scope.hideLabels == 'true' : false;

				var sliderType = (['range', 'single'].indexOf( $scope.sliderType ) >= 0 ? $scope.sliderType : 'single');
				var opts = null;
				var sliderInstance = null;
				setLocalOpts();

				// Set the labels, initially
				setLabels( getSliderConfig_start() ); //Todo: should be the value, not the min & max

				initSlider( getSliderConfig() );
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
						'hideLabels'
					], function ( newVal, oldVal ) {
						console.log( 'new settings recognized', newVal );
						setLocalOpts();
						initSlider( getSliderConfig() );
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
								updateEngineVars( getVarDefs( values ) );
							} );
						} else {
							console.log( 'slider already there, setting the values', config );
							sliderInstance.updateOptions( config );

						}
					}
				}

				/**
				 * Set the local options, based on the scope properties, but with some default-value logic.
				 *
				 * @private
				 */
				function setLocalOpts () {
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

				function getVarDefs ( values ) {

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

					var app = qlik.currApp();
					varDefs.forEach( function ( varDef ) {
						console.log( 'setvalue', varDef );

						ensureEngineVarExists( app, varDef.name )
							.then( function ( isVarExisting ) {
								if ( !_.isEmpty( varDef.name ) ) {
									app.variable.setContent( varDef.name, varDef.value )
										.then( function ( reply ) {
											angular.noop();
											console.log( 'Value set for variable ' + varDef.name + '. ', 'Return: ', reply );
										} );
								}
							} );

					} )
				}

				/**
				 * Checks if an engine var exists or not, if not a session var will be created.
				 * @param app
				 * @param varName
				 * @returns {*}
				 */
				function ensureEngineVarExists ( app, varName ) {

					var defer = $q.defer();
					engineVarExists( app, varName ).then( function ( result ) {
						if ( result ) {
							defer.resolve();
						} else {
							return createEngineSessionVar( app, varName );
						}
					} );
					return defer.promise;
				}

				function createEngineSessionVar ( app, varName ) {
					return app.variable.create( {qName: varName} );
				}

				/**
				 * Returns a promise containing the information whether a variable exists.
				 *
				 * @param {object} app The current app.
				 * @param {string} varName The variable name.
				 * @returns {Promise} A promise containing the model of the variable, otherwise null..
				 */
				function engineVarExists ( app, varName ) {
					var defer = $q.defer();
					app.variable.getByName( varName )
						.then( function ( model ) {
							defer.resolve( model );
						}, function ( errorObject ) {
							console.log( 'engineVarExists', errorObject );
							defer.resolve( null );
						} );

					return defer.promise;
				}

				/**
				 * Get the values for given variables.
				 *
				 * @param {string[]} vars The variable names.
				 * @private
				 */
				function getEngineVarVals ( vars ) {

				}
			}
		};

	} );
