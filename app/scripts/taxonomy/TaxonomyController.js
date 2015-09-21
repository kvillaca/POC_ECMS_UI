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

        // Entry fields for service two - lookupClassificationDescription
        $scope.service2 = {classcode : undefined,
                           vocab : undefined };


        // Entry fields for service three - termStartsWith
        $scope.service3 = {termstart : undefined,
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


        $scope.clearFields = function() {
            updateRestangularHeaders.removeSessionId();
            $scope.errorResponse = false;
            $scope.service1 = {company : undefined,
                vocab: undefined};
            $scope.service2 = {classcode : undefined,
                vocab : undefined };
            $scope.service3 = {termstart : undefined,
                vocab : undefined };
            $scope.serviceCalled = undefined;
            $scope.responseAsJson= 'Empty';
        };


        $scope.version2 = function() {
            $location.path('/v2/Taxonomy');
        };



        // Restangular call serviceone!
        $scope.callLookUpCompanyTerm = function() {
            $scope.errorResponse = false;

            // Set Header
            Restangular.setDefaultHeaders({HEADER : angular.toJson($rootScope.header)});
            console.log("old header /taxonomy/rest/tax/synaptica/naic/lookup");
            console.log($rootScope.header);

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
                        var plainResponse = Restangular.stripRestangular(response.data);
                        $scope.responseAsJson = angular.toJson(plainResponse, true);
                        console.log("new /taxonomy/rest/tax/synaptica/naic/lookup");
                        console.log(plainResponse);
                    }, 50);
                }, function (fail) {
                    $timeout(function () {
                        ecmsSession.set(undefined, false);
                        $scope.responseAsJson = 'Empty';
                        $scope.errorResponse = true;
                        console.log(fail);
                    }, 50);
                });
        };


        // Restangular call servicetwo!
        $scope.callLookUpClassificationDescription = function(){
            $scope.errorResponse = false;

            // Set Header
            Restangular.setDefaultHeaders({HEADER : angular.toJson($rootScope.header)});

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
                        var plainResponse = Restangular.stripRestangular(response.data);
                        $scope.responseAsJson = angular.toJson(plainResponse, true);
                        console.log($rootScope.header);
                    }, 50);
                }, function (fail) {
                    $timeout(function () {
                        ecmsSession.set(undefined, false);
                        $scope.errorResponse = true;
                        $scope.responseAsJson = 'Empty';
                            console.log(fail);
                    }, 50);
                });
        };



        // Restangular call servicethree!
        $scope.termStarsWith = function(){
            $scope.errorResponse = false;

            // Set Header
            Restangular.setDefaultHeaders({HEADER : angular.toJson($rootScope.header)});

            // Call service
            Restangular.one('/taxonomy/rest/tax/synaptica/authority/startswith').
                get({classcode : $scope.service3.termstart, vocab : $scope.service3.vocab}).
                then(function (response) {
                    $timeout(function () {
                        var sessionKey = response.headers('HEADER');
                        $sessionStorage.$default({session: null});
                        ecmsSession.set(sessionKey, true);
                        updateRestangularHeaders.addSessionId(sessionKey);
                        $scope.errorResponse = false;
                        var plainResponse = Restangular.stripRestangular(response.data);
                        $scope.responseAsJson = angular.toJson(plainResponse, true);
                        console.log($rootScope.header);
                    }, 50);
                }, function (fail) {
                    $timeout(function () {
                        ecmsSession.set(undefined, false);
                        $scope.errorResponse = true;
                        $scope.responseAsJson = 'Empty';
                        console.log(fail);
                    }, 50);
                });
        };

    });
