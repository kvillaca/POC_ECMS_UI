'use strict';
/**
 * @ngdoc controller
 * @name login
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */
angular.module('ecmsEcmsUiApp').controller('LoginController', function ($scope,
                                             $rootScope,
                                             $state,
                                             $sessionStorage,
                                             ecmsSession,
                                             Restangular,
                                             updateRestangularHeaders,
                                             $timeout) {


        var $this = this;   // alias for this controller

        // Scope defaults
        $rootScope.loginError = false;
        $rootScope.userLoggedIn = ecmsSession.getUserLoggedIn() || false;

        // This is scoped because once the user is valid
        $scope.credentials = {
            username: 'dummy',//undefined,
            password: '12345678'//undefined
        };


        /*
         * Authenticate the user, calling a rest service!
         */
        $scope.authenticateUser = function () {

            // clear out any previous error messages
            $scope.loginError = false;

            // this is what we are passing on to the server for authentication
            var jsonInput = {
                userId:  $scope.credentials.username,
                password:  $scope.credentials.password,
                uri: '/rest/auth/login/validate/'
            };

            // Always clean the password after prepare or after used
            $scope.credentials.password = undefined;


            // Restangular call for Authenticate user!
            Restangular.one('/POC_ECMS_AUTH/rest/auth/login').post('authenticate', angular.toJson(jsonInput, true)).
                then(function (response) {
                    $timeout(function () {
                        $this.sessionKey = response.headers('HEADER_VALUES');
                        $sessionStorage.$default({session: null});
                        ecmsSession.set($this.sessionKey, true);
                        updateRestangularHeaders.addSessionId($this.sessionKey);
                        $rootScope.loginError = false;
                        $rootScope.userLoggedIn = true;

                        $scope.credentials = {
                            username: undefined,
                            password: undefined
                        };
                    });
                }, function (fail) {
                    $timeout(function () {
                        $rootScope.loginError = true;
                        $rootScope.errorMessage = {errorCode : fail.status,
                                                   message: fail.data.message };
                        ecmsSession.set(undefined, false);
                        console.log(fail);
                    });
                });
        };


        // clear form data when user clicks back into login form after an error
        $scope.clear = function () {
            if ($rootScope.loginError) {
                $rootScope.loginError = false;
                $rootScope.credentials = {
                    username: null,
                    password: null
                };
            }
        };
    });
