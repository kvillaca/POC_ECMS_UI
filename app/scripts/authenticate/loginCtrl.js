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
angular.module('ecmsEcmsUiApp').controller('LoginController',
                                    function ($scope,
                                              $rootScope,
                                             $sessionStorage,
                                             ecmsSession,
                                             Restangular,
                                             $location,
                                             updateRestangularHeaders,
                                             $timeout) {


        // Scope defaults
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
            $rootScope.loginError = false;

            // this is what we are passing on to the server for authentication
            var jsonInput = {
                userId:  $scope.credentials.username,
                password:  $scope.credentials.password,
                uri: '/rest/auth/login/validate/'
            };

            // Always clean the password after prepare or after used
            //$scope.credentials.password = undefined;


            // Restangular call for Authenticate user!
            Restangular.one('POC_ECMS_AUTH/rest/auth/login').post('validate/', angular.toJson(jsonInput, true)).
                then(function (response) {
                    $timeout(function () {
                        var sessionKey = response.headers('HEADER');
                        $sessionStorage.$default({session: null});
                        ecmsSession.set(sessionKey, true);
                        updateRestangularHeaders.addSessionId(sessionKey);
                        $rootScope.loginError = false;
                        $rootScope.userLoggedIn = true;
                        $scope.credentials = {
                            username: undefined,
                            password: undefined
                        };
                    });
                }, function (fail) {
                    $timeout(function () {
                        ecmsSession.set(undefined, false);
                        $rootScope.loginError = true;
                        console.log(fail);
                    }, 50);
                });
        };



        //clear form data when user clicks back into login form after an error
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
