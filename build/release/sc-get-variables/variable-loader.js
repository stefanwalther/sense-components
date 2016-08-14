/*global define*/
/**
 * @todo Break out to sense-extension-utils
 */
define(["angular","qlik","underscore"],function(angular,qlik,_){"use strict";function loadVariables(delimitedVars){var app=qlik.currApp(),promises=[];if(!_.isEmpty(delimitedVars)){var variables=delimitedVars.split(",");variables.forEach(function(variable){promises.push(loadVariable(app,variable))})}return $q.all(promises)}function loadVariable(app,varName){var defer=$q.defer();return app.variable.getContent(varName.trim()).then(function(reply){var r={varName:varName,qContent:reply.qContent};defer.resolve(r)}).catch(function(err){defer.reject(err)}),defer.promise}var $injector=angular.injector(["ng"]),$q=$injector.get("$q");return{load:loadVariables}});