/*global define,qvangular*/
define([
        'angular',
        'qvangular',
        'qlik'
    ],
    function (angular, qvangular, qlik) {
        'use strict';

        qvangular.service("wiVariableService", ['$q', function ($q) {
            return {

                /**
                 * Get the content of a variable
                 * @param variableName
                 * @returns promise
                 */
                getVariableContent: function(variableName) {

                    var deferred = $q.defer();
                    var app = qlik.currApp();

                    app.variable.getContent(variableName)
                        .then(function (reply) {
                            deferred.resolve(reply);
                        })
                        .catch(function ( error ) {
                            deferred.reject( error );
                        });

                    return deferred.promise;

                },

                /**
                 * Returns the content of two variables
                 * @param var1
                 * @param var2
                 * @returns promise
                 */
                getVariableContents: function (var1, var2) {

                    var deferred = $q.defer();

                    var requests = [];
                    requests[0] = this.getVariableContent(var1);
                    if (var2) {
                        requests[1] = this.getVariableContent(var2);
                    }

                    //console.log('--requests', requests);

                    $q.all(requests)
                        .then(function (replies) {
                            //console.log('reply from QS', replies);
                            deferred.resolve(replies);
                        }).catch(function (err) {

                            //Todo: (B) - Decide whether to do some error handling here or not
                            angular.noop();
                            //console.error(err);
                        }).finally(function () {
                            angular.noop();
                            //console.log('finally');
                        });

                    return deferred.promise;

                },

                /**
                 * Set the content of a variable.
                 * @param variableName
                 * @param variableValue
                 * @returns promise with true if successfull, otherwise false
                 */
                setVariableContent: function ( variableName, variableValue ) {

                    var app = qlik.currApp();
                    var deferred = $q.defer();

                    app.variable.setContent( variableName, variableValue )
                        .then(function (reply) {
                            deferred.resolve( true );
                        })
                        .catch(function (reply) {
                            deferred.reject( false );
                        });
                    return deferred.promise;
                }
            };
        }]);

        // no return
    });