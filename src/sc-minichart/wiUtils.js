/*global define,document*/
define([
    'jquery',
    'underscore'
],
function ($, _) {

    'use strict';

    // ****************************************************************************************
    // String extensions
    // ****************************************************************************************
    // replace without the annoying /g param
    String.prototype.replaceWith = function(f, t) {
        var regExp = new RegExp(f, "g");
        return this.replace(regExp, t);
    };

    String.prototype.indexOfNth  = function(substring, n) {
        var times = 0, index = null;

        while (times < n && index !== -1) {
            index = this.indexOf(substring, index+1);
            times++;
        }

        return index;
    };

    // Usage:
    // d = new Date();
    // d.yyyymmdd();
    Date.prototype.yyyymmdd = function() {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
        var dd  = this.getDate().toString();
        return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
    };

    // ****************************************************************************************
    // wiUtils
    // ~~
    // A set of useful methods being used throughout all services, directives, etc.
    // ****************************************************************************************
    var wiUtils = {


        // Returns if the given object matches one of the following conditions:
        // - undefined
        // - blank/empty string
        isBlank: function(obj){
            return(!obj || $.trim(obj) === "");
        },

        /**
         * Returns if the given string contains AngularJs bindings {{xx}}.
         * @param obj
         * @return true or false
         */
        hasAngularBindings: function (obj) {

            var hasBindings = false;
            var re = /\{{[^}]*}}/gmi;
            hasBindings = ( (obj.match(re) || []).length > 0);
            //console.log('hasAngularBindings', hasBindings);
            return hasBindings;

        },

        /**
         * Removes all script occurrences from a script
         *
         * Seems to be the best approach to bind the element to a temporary DOM element,
         * seems to be more reliable than using a regex statement.
         *
         * See: http://stackoverflow.com/questions/6659351/removing-all-script-tags-from-html-with-js-regular-expression
         * @param s
         * @returns {*}
         */
        noScript: function(s) {

            var div = document.createElement('div');
            div.innerHTML = s;
            var scripts = div.getElementsByTagName('script');
            var i = scripts.length;
            while (i--) {
                scripts[i].parentNode.removeChild(scripts[i]);
            }
            s = div.innerHTML;
            return s;

        },

        // Extracts from a string, represeting a function the function name:
        // selectValues('test', 'test') ==> selectValues
        // clearall() ==> clearAll
        // forward ==> forward
        // See ==> http://jsfiddle.net/stefanwalther/spGPt/3/
        fnFromString: function ( str ) {
            if ( !_.isEmpty( str ) ) {
                return str.substr( 0, (str.indexOf( '(' ) > -1 ? str.indexOf( '(' ) : undefined) );
            }
            return str;
        },

        // see http://jsfiddle.net/stefanwalther/4skcS/2/
        // see http://www.sitepoint.com/arguments-a-javascript-oddity/
        extractParams: function(str) {
            var paramsPlus = str.match(/\((.*?)\)/g); // returns everything but not the function

            if (typeof paramsPlus === 'object' && paramsPlus !== null) {
                var innerParam =  paramsPlus[0];
                if (!_.isEmpty(innerParam)) {
                    innerParam = innerParam.trim();

                    // Remove ( & )
                    innerParam = innerParam.substr(1, innerParam.length -2);
                }
                return innerParam;
            }
            return null;
        },

        // Add a inline style to the html-header (with a given Id),
        // If the style already exists the existing one will be changed
        addStyleToHeader: function (id, css) {
            var idPattern = 'qwidget_' + id;
            var $headStyle = $('#' + idPattern);
            if ($headStyle.length === 0) {
                // add the style
                $headStyle = $(document.createElement('style'));
                $headStyle.attr('type', 'text/css');
                $headStyle.attr('id', idPattern);
                $('head').append($headStyle);
            }
            // add/change the style
            $headStyle.text(css);
        },

        /**
         * Adds a style to the link header with the given id.
         *
         * If the style with the given key is already part of the header, nothing
         * will happen.
         * @param key of the
         * @param link to the style sheet.
         */
        addStyleLinkToHeader: function (key, link) {

            $(document).ready(function () {

                var idPattern = 'wiStyleLinked_' + key;
                if ($('#' + idPattern).length === 0) {
                    var $lnk = $(document.createElement('link'));
                    $lnk.attr('rel', 'stylesheet');
                    $lnk.attr('href', link);
                    $lnk.attr('id', idPattern);
                    $("head").append($lnk);
                }
            });
        },

        // Encodes a string using encodeURIComponent, additionally the following
        // string will be replaced:
        // - ' (single quotes)
        encode: function(str) {
            // By default encodeURIComponent does not replace the single quote,
            // so do that manually ...
            return encodeURIComponent(str).replace(/'/g, "%27");
        },
        // Same as encode, plus surrounds the resulting string with single quotes
        // to be able to save the resulting string to object properties easily
        encodeForEngine: function(str) {

//            console.info('encodeForEngine.beforeNoScript');
//            console.log(str);

            // always remove scripts first
            str = wiUtils.noScript(str);

//            console.info('encodeForEngine.afterNoScript');
//            console.log(str);

            var t = wiUtils.encode(str);
            if (wiUtils.isBlank(t)) {
                return t;
            } else {
                return "'" + t + "'";
            }
        },

        decode: function(str) {
            return decodeURIComponent(str);
        },
        // Decodes a string, potentially comming from the engine and therefore surrounded
        // with single quotes. If this is the case, the single quotes at the beginning and
        // end of the decoded string will be removed.
        // If single-quotes are not found either at the beginning or the end of the string,
        // the given string will be returned back.
        decodeFromEngine: function (str) {
            if (str !== undefined && str.length > 0) {
                str = wiUtils.decode(str);
                //console.log('str after decode: ' + str);
                if (str !== undefined) {
                    if (str.charAt(0) === "'") {
                        str = str.substr(1);
                    }
                    if (str.charAt(str.length - 1) === "'") {
                        str = str.substr(0, str.length - 1);
                    }
                }
            }
            //console.log('decodeFromEngine: ' + str);
            return str;
        },

        sanitizedFileName: function (s) {
            return s.replace(/[^a-z0-9_\-]/gi, '_');
        },

        // Sourround with single quotes if necessary
        // Todo: (C) - Still used?
        prepForEngine: function(str) {
            if (!wiUtils.isBlank(str)) {
                if (str.charAt(0) !== "'") {
                    str = "'" + str;
                }
                if (str.charAt(str.length - 1) !== "'") {
                    str = str + "'";
                }
            }
            return str;
        },

        // Todo: (C) -  Remove completely, still used?
        stringFromEngine: function (value) {
            if (value !== undefined && value.length > 0) {
                value = unescape(value);
                if (value !== undefined) {
                    if (value.charAt(0) == "'") value = value.substr(1);
                    if (value.charAt(value.length - 1) == "'") value = value.substr(0, value.length - 1);
                }
            }
            return value;
        },

        // Todo: (C) - Still used?
        removeStyles: function (id) {
            
            $("style[qwidget-type='normal']").remove();

        },

        //Todo: (AA) - What the hack, why is this here, this is called by wiEditorsResize ...
        // Resize the editors to a specific size.
        resizeEditors: function (baseCtrlSelector) {

            var animationDuration = 500;

            var cHeader = 140;
            var availHeight = $(baseCtrlSelector).height() - cHeader;
            var heightHtml = parseInt((availHeight / 5) * 3);
            var heightLess = availHeight - heightHtml;

            $('#qWidget_WidgetEditor_HtmlEditor .ace-editor').animate({"min-height": heightHtml + 'px'}, animationDuration);
            $('#qWidget_WidgetEditor_LessEditor .ace-editor').animate({"min-height": heightLess + 'px'}, animationDuration);
        }
    };

    return wiUtils;
});

