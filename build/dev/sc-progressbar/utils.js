/*global define,document*/
define( [
		'jquery',
		'underscore'
	],
	function ( $, _ ) {
		'use strict';

		var utils = {

			// Add a inline style to the html-header (with a given Id),
			// If the style already exists the existing one will be changed
			addStyleToHeader: function ( id, css ) {
				var idPattern = 'style_' + id;
				var $headStyle = $( '#' + idPattern );
				if ( $headStyle.length === 0 ) {
					// add the style element
					$headStyle = $( document.createElement( 'style' ) );
					$headStyle.attr( 'type', 'text/css' );
					$headStyle.attr( 'id', idPattern );
					$( 'head' ).append( $headStyle );
				}
				// add/change the style
				$headStyle.text( css );
			},

			/**
			 * Adds a style to the link header with the given id.
			 *
			 * If the style with the given key is already part of the header, nothing
			 * will happen.
			 * @param key of the
			 * @param link to the style sheet.
			 */
			addStyleLinkToHeader: function ( key, link ) {

				$( document ).ready( function () {

					var idPattern = 'linked_style_' + key;
					if ( $( '#' + idPattern ).length === 0 ) {
						var $lnk = $( document.createElement( 'link' ) );
						$lnk.attr( 'rel', 'stylesheet' );
						$lnk.attr( 'href', link );
						$lnk.attr( 'id', idPattern );
						$( "head" ).append( $lnk );
					}
				} );
			}
		};

		return utils;
	} );

