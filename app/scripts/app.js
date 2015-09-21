'use strict';

/**
 * @ngdoc overview
 * @name ecmsEcmsUiApp
 * @description
 * # ecmsEcmsUiApp
 *
 * Main module of the application.
 */
var pocEcmsApp = angular.module('ecmsEcmsUiApp', [
    'ngAnimate',
    'ngSanitize',
    'ngStorage',
    'ui.bootstrap',
    'ngRoute',
    'restangular'
]);


/**
 * Restangular Provider Config
 */
pocEcmsApp.config(['RestangularProvider',
    function (RestangularProvider) {
        // Restangular initial configs
        //RestangularProvider.setBaseUrl('');
        RestangularProvider.setFullResponse(true);
    }]);


/**
 * $routeProvider
 */
pocEcmsApp.config(function($routeProvider) {


    $routeProvider
            .when('/Login', {
                            templateUrl: '/fragments/login/login.html',
                            controller: 'LoginController'
            })
            .when('/NotFound', {
                                templateUrl: '/fragments/errors/404.html',
                                controller: 'NotFoundController'
            })
            .when('/ServerError', {
                                    templateUrl: '/fragments/errors/500.html',
                                    controller: 'ServerErrorController'
            })
            .when('/Taxonomy', {
                                templateUrl: '/fragments/taxonomy/taxonomy.html',
                                controller: 'TaxonomyController',
            })
            .when('/v2/Taxonomy', {
                templateUrl: '/fragments/taxonomy/taxonomyv2.html',
                controller: 'Taxonomyv2Controller',
            })
            .otherwise({
                    redirectTo : '/Login'
            });
    });



//pocEcmsApp.run(['$log', '$rootScope', '$route', function ($log, $rootScope, $route) {
//    // nothing
//}]);


pocEcmsApp.run(function ($rootScope, $location, terminate, $window, getIPService,
                         Restangular, signout, $sessionStorage, spinner) {
    // Root variables, mean module public variables.
    var OK_RESPONSE = 200;

    // I couldn't make the LoginCtrl see the parent $scope.
    $rootScope.loginError = false;
    $rootScope.userLoggedIn = false;

    $rootScope.loginErrorText = undefined;
    $rootScope.errorMessage = { errorCode : undefined,
                                message : undefined};
    $rootScope.header = undefined;


    /*
     * Restangular error interceptor, for errors that may impact the application in ways
     * that the user shouldn't be to continue.
     */
    Restangular.setErrorInterceptor(function (response) {
        if (response.status !== OK_RESPONSE) {
            $rootScope.errorMessage = {errorCode : response.status,
                message: response.data };
            spinner.off();

            if (response.status === 500 || response.status === 0) {
                $location.path('/ServerError');
            } else if (response.status === 404) {
                $location.path('/NotFound');
            }
        } else {
            $rootScope.errorMessage = {errorCode : response.status,
                                       message: response.data };
        }
    });
});
