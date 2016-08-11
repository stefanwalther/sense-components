/*global define*/
define( [
		'angular',
		'underscore',
		'./wiUtils',

		// no return value
		'./external/jquery-sparkline/jquery.sparkline.min'
	],
	function ( angular, _, wiUtils ) {
		"use strict";

		// Note:
		// A more generic approach could have been chosen to implement all the features
		// of jQuery sparklings (e.g. just passing a JSON object and resolve it), but
		// this didn't work since this caused problems in the ACE9 editor, so this is
		// the more stable implementation ...
		return {
			name: 'scMinichart',
			restrict: "AE",
			replace: true,
			scope: false, // we don't need a scope in this directive
			template: '<div></div>',
			link: function ( scope, element, attrs ) {


				//Todo: As soon as Angular 1.3 is available in Qlik Sense $watchGroup could be used ...
				scope.$watch( function () {
						return angular.toJson( [

							// Common Options
							attrs.data,
							attrs.type,
							attrs.width,
							attrs.height,
							attrs.lineColor,
							attrs.fillColor,
							attrs.chartRangeMin,
							attrs.chartRangeMax,
							attrs.composite,
							attrs.enableTagOptions,
							attrs.tagOptionPrefix,
							attrs.tagValuesAttribute,
							attrs.disableHiddenCheck,

							// Line Chart Options
							attrs.defaultPixelsPerValue,
							attrs.spotColor,
							attrs.minSpotColor,
							attrs.maxSpotColor,
							attrs.spotRadius,
							attrs.valueSpots,
							attrs.highlightSpotColor,
							attrs.highlightLineColor,
							attrs.lineWidth,
							attrs.normalRangeMin,
							attrs.normalRangeMax,
							attrs.drawNormalOnTop,
							attrs.xvalues,
							attrs.chartRangeClip,
							attrs.chartRangeMinX,
							attrs.chartRangeMaxX,

							// Bar Chart Options
							attrs.barColor,
							attrs.negBarColor,
							attrs.zeroColor,
							attrs.nullColor,
							attrs.barWidth,
							attrs.barSpacing,
							attrs.zeroAxis,
							attrs.colorMap,
							attrs.stackedBarColor,

							// Tristate Charts
							attrs.posBarColor,
							attrs.negBarColor,
							attrs.zeroBarColor,
							attrs.barWidth,
							attrs.barSpacing,
							attrs.colorMap,

							// Discrete Charts
							attrs.lineHeight,
							attrs.thresholdValue,
							attrs.thresholdColor,

							// Bullet Graphs
							attrs.targetColor,
							attrs.targetWidth,
							attrs.performanceColor,
							attrs.performanceColor,

							// Pie Charts
							attrs.sliceColors,
							attrs.offset,
							attrs.borderWidth,
							attrs.borderColor,

							// Box Plots
							attrs.raw,
							attrs.showOutliers,
							attrs.outlierIQR,
							attrs.boxLineColor,
							attrs.boxFillColor,
							attrs.whiskerColor,
							attrs.outlierLineColor,
							attrs.outlierFillColor,
							attrs.spotRadius,
							attrs.medianColor,
							attrs.target,
							attrs.targetColor,
							attrs.minValue,
							attrs.maxValue

							// Shared Usage

						] );
					},
					function () {
						render();
					} );

				var render = function () {

					// Getting the data
					var data;
					if ( attrs.data ) {
						// Todo deal with white-spaces
						data = attrs.data.split( ',' );
					}

					// Default values to make the experience even better
					if ( wiUtils.isBlank( attrs.type ) ) { attrs.type = 'bar'; }

					element.sparkline( data, {

						// Common Options
						type: attrs.type,
						width: attrs.width,
						height: attrs.height,
						lineColor: attrs.lineColor,
						fillColor: attrs.fillColor,
						chartRangeMin: attrs.chartRangeMin,
						chartRangeMax: attrs.chartRangeMax,
						composite: attrs.composite,
						enableTagOptions: attrs.enableTagOptions,
						tagOptionPrefix: attrs.tagOptionPrefix,
						tagValuesAttribute: attrs.tagValuesAttribute,
						disableHiddenCheck: attrs.disableHiddenCheck,

						// Line Chart
						defaultPixelsPerValue: attrs.defaultPixelsPerValue,
						spotColor: attrs.spotColor,
						minSpotColor: attrs.minSpotColor,
						maxSpotColor: attrs.maxSpotColor,
						valueSpots: attrs.valueSpots,
						highlightSpotColor: attrs.highlightSpotColor,
						highlightLineColor: attrs.highlightLineColor,
						lineWidth: attrs.lineWidth,
						normalRangeMin: attrs.normalRangeMin,
						normalRangeMax: attrs.normalRangeMax,
						drawNormalOnTop: attrs.drawNormalOnTop,
						xvalues: attrs.xvalues,
						chartRangeClip: attrs.chartRangeClip,
						chartRangeMinX: attrs.chartRangeMinX,
						chartRangeMaxX: attrs.chartRangeMaxX,

						// Bar Chart
						barColor: attrs.barColor,

						zeroColor: attrs.zeroColor,
						nullColor: attrs.nullColor,
						zeroAxis: attrs.zeroAxis,
						stackedBarColor: attrs.stackedBarColor,

						// Tristate Charts
						posBarColor: attrs.posBarColor,
						zeroBarColor: attrs.zeroBarColor,

						// Discrete Charts
						lineHeight: attrs.lineHeight,
						thresholdValue: attrs.thresholdValue,
						thresholdColor: attrs.thresholdColor,

						// Bullet Graphs
						targetWidth: attrs.targetWidth,
						performanceColor: attrs.performanceColor,
						rangeColors: attrs.rangeColors,

						// Pie Charts
						sliceColors: attrs.sliceColors,
						offset: attrs.offset,
						borderWidth: attrs.borderWidth,
						borderColor: attrs.borderColor,

						// Box Plots
						raw: attrs.raw,
						showOutliers: attrs.showOutliers,
						outlierIQR: attrs.outlierIQR,
						boxLineColor: attrs.boxLineColor,
						boxFillColor: attrs.boxFillColor,
						whiskerColor: attrs.whiskerColor,
						outlierLineColor: attrs.outlierLineColor,
						outlierFillColor: attrs.outlierFillColor,
						medianColor: attrs.medianColor,
						target: attrs.target,
						minValue: attrs.minValue,
						maxValue: attrs.maxValue,

						// Shared Usage:
						negBarColor: attrs.negBarColor,    		// Bar Chart, Tristate Chart
						barWidth: attrs.barWidth,          		// Bar Chart, Tristate chart
						barSpacing: attrs.barSpacing,      		// Bar Chart, Tristate chart
						colorMap: attrs.colorMap,           	// Bar Chart, Tristate chart
						targetColor: attrs.targetColor,    		// Bullet Graphs, Box Plot
						spotRadius: attrs.spotRadius      		// Line Chart, Box Plots

					} );

					// Additional options
					// Didn't want to change the jQuery plugin, this way makes it easier to
					// update the plugin ...
					var $can = element.find( ':first-child' );
					if ( attrs.opacity ) { $can.css( 'opacity', attrs.opacity ); }

				};

			}
		};
	} );
