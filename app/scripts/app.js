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
    'ui.grid',       // replaces ngGrid
    'ui.grid.pagination',
    'ui.grid.selection',
    'ui.grid.resizeColumns',
    'ui.grid.autoResize',
    'ui.grid.saveState',
    'ui.codemirror',
    'ui.bootstrap',
    'ngRoute',
    'restangular'
]);

pocEcmsApp.config(['$routerProvider', 'RestangularProvider',
    function ($routeProvider,  RestangularProvider ) {

        // Restangular initial configs
        //RestangularProvider.setBaseUrl('');
        RestangularProvider.setFullResponse(true);


        // config for ui-Router
        $urlRouterProvider.otherwise('/login');

        $routeProvider
            .$routeProvider.
            when('/Login', {
                            templateUrl: 'fragments/login/login.html',
                            controller: 'LoginController'
            })
            .when('/notFound', {
                                templateUrl: '404.html',
                                controller: 'NotFoundController',
                                resolve : {
                                    checkLogged : function(FactoryLogged) {
                                        return FactoryLogged.hasTokenAndIsLogged();
                                    }
                                }
            })
            .state('serverError', {
                url: '/serverError',
                module: 'public',
                templateUrl: '500.html',
                controller: 'ServerErrorController',
                resolve: {
                    setPage: function ($rootScope) {
                        $rootScope.page = 'serverError';
                    }
                }
            })
            .state('taxonomy', {
                url: '/taxonomy',
                module: 'private',
                templateUrl: 'scripts/search/search.html',
                controller: 'TaxonomyController',
                resolve: {
                    setPage: function ($rootScope) {
                        $rootScope.page = 'taxonomy';
                    }
                }
            });
    }]);

pocEcmsApp.run(function ($rootScope, $location, $state, isPrivateService, terminate, getIPService,
                      Restangular, signout, $sessionStorage, spinner) {
    // Root variables, mean module public variables.
    var OK_RESPONSE = 200;

    // I couldn't make the LoginCtrl see the parent $scope.
    $rootScope.loginError = false;
    $rootScope.userLoggedIn = false;
    $rootScope.credentials = {
        username: undefined,
        password: undefined,
        rememberMe: false
    };
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
            spinner.off();
            switch (response.status) {
                case 500:
                    $rootScope.errorMessage = {errorCode : response.status,
                                               message: response.data };
                    $state.go('serverError', {});
                    return false;
                    break;
                case 404:
                case 0:
                    $rootScope.errorMessage = {errorCode : response.status,
                                               message: response.data };
                    $state.go('notFound', {});
                    return false;
                    break;
                default:
                    $rootScope.errorMessage = {errorCode : response.status,
                                               message: response.data };
                    return true;
            }
        } else {
            $rootScope.errorMessage = {errorCode : response.status,
                                       message: response.data };
            return true;
        }
    });
});
