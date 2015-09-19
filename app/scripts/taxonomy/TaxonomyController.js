'use strict';
/**
 * Created by kvillaca on 9/19/2015.
 */
angular.module('ecmsEcmsUiApp')
    .controller('TaxonomyController', function ($scope, Restangular,
                                                terminate, $location,
                                                updateRestangularHeaders, ecmsSession,
                                                $sessionStorage, $rootScope,
                                                $timeout) {

        $scope.errorResponse = false;

        // Entry fields for service one - lookupCompanyTerm
        $scope.service1 = {company : undefined,
                           vocab: undefined};

        // Entry fields for service two - lookupAuthorityTerm
        $scope.service2 = {classcode : undefined,
                           vocab : undefined };

        // Display service name called
        $scope.serviceCalled = undefined;

        // Display the response
        $scope.responseAsJson= 'Empty';


        $scope.goBack = function() {
            terminate();
            $location.path('/Login');
        };


        $scope.revokeToken = function() {
            updateRestangularHeaders.removeSessionId();
            ecmsSession.set(undefined, false);
        };


        // Restangular call serviceone!
        $scope.callLookUpCompanyTerm = function() {
            $scope.errorResponse = false;

            // Set Header
            //RestangularProvider.setDefaultHeaders({HEADER : angular.toJson($rootScope.header)});

            // Call service
            //var valueToJson = angular.toJson($scope.service1, false);
            Restangular.one('/taxonomy/rest/tax/synaptica/naic/lookup').
                get({company: $scope.service1.company, vocab : $scope.service1.vocab}).
                then(function (response) {
                    $timeout(function () {
                        var sessionKey = response.headers('HEADER');
                        $sessionStorage.$default({session: null});
                        ecmsSession.set(sessionKey, true);
                        updateRestangularHeaders.addSessionId(sessionKey);
                        $scope.errorResponse = false;

                        console.log($rootScope.header);
                    }, 50);
                }, function (fail) {
                    $timeout(function () {
                        ecmsSession.set(undefined, false);
                        $scope.errorResponse = true;
                        console.log(fail);
                    }, 50);
                });
        };


        // Restangular call servicetwo!
        $scope.callLookUpClassificationDescription = function(){
            $scope.errorResponse = false;

            // Call service
            Restangular.one('/taxonomy/rest/tax/synaptica/authority/lookup').
                get({classcode : $scope.service2.classcode, vocab : $scope.service2.vocab}).
                then(function (response) {
                    $timeout(function () {
                        var sessionKey = response.headers('HEADER');
                        $sessionStorage.$default({session: null});
                        ecmsSession.set(sessionKey, true);
                        updateRestangularHeaders.addSessionId(sessionKey);
                        $scope.errorResponse = false;
                        console.log($rootScope.header);
                    }, 50);
                }, function (fail) {
                    $timeout(function () {
                        ecmsSession.set(undefined, false);
                        $scope.errorResponse = true;
                        console.log(fail);
                    }, 50);
                });
        };

    });
