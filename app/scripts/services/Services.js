'use strict';

/**
 * @ngdoc service
 * @name
 * @description
 * _Please update the description and dependencies._
 *
 * */
var app = angular.module('ecmsEcmsUiApp');


/**
 * Save state to session
 */
app.service('updateSession', function ($sessionStorage) {
    this.session = function (scopeState) {
        $sessionStorage.lastState = scopeState;
    };
});


/**
 * Terminate the app
 */
app.service('terminate', function ($rootScope, $sessionStorage, ecmsSession, updateRestangularHeaders, updateSession) {
    return function () {

        updateSession.session($rootScope.state);
        $rootScope.loginError = false;
        $rootScope.userLoggedIn = false;
        $sessionStorage.userLoggedIn = false;
        $rootScope.credentials = {
            username: undefined,
            password: undefined,
            rememberMe: false
        };

        $rootScope.header = undefined;
        $rootScope.sessionKey = undefined;
        delete $sessionStorage.session;

        ecmsSession.set(undefined, false);
        updateRestangularHeaders.removeSessionId();

    };
});



/**
 * Session from/to $sessionStorage - Get and Set.
 */
app.service('ecmsSession', function ($sessionStorage) {
    this.getSession = function () {
        return $sessionStorage.session;
    };

    this.getUserLoggedIn = function () {
        return $sessionStorage.userLoggedIn;
    };

    this.set = function (sessionToSet) {
        $sessionStorage.session = sessionToSet;
    };

    this.set = function (sessionToSet, userLoggedInToSet) {
        $sessionStorage.session = sessionToSet;
        $sessionStorage.userLoggedIn = userLoggedInToSet;
    };
});


/**
 * @ngdoc function
 * @name ecmsEcmsUiApp.service:isPrivateService
 * @description returns True if the view is private and user is not logged in; False in all other cases
 */
app.service('isPrivateService', function (ecmsSession) {
    return {
        check: function (toState) {
            if (toState.name !== 'login' && !ecmsSession.getSession()) {
                if (toState.module === 'private') {
                    return true;
                }
            }
            return false;
        }
    };
});


/**
 * @ngdoc function
 * @name ecmsEcmsUiApp.service:getIPService
 * @description retrieves data from the search endpoint
 */
app.service('getIPService', function ($http, $q) {
    return {
        getIP: function () {
            var requestUrl = 'http://freegeoip.net/json/';
            var deferred = $q.defer();
            var config = {
                url: requestUrl,
                headers: {'Content-Type': 'application/json'}
            };
            $http(config)
                .then(function (result) {
                    deferred.resolve(result);
                }, function () {
                    deferred.reject('getIPService error');
                });
            return deferred.promise;
        }
    };
});


/**
 * @ngdoc function
 * @name ecmsEcmsUiApp.service:updateRestangularHeaders
 * @description updates headers in Restangular
 */
app.service('updateRestangularHeaders', function (Restangular, $rootScope) {
    return {
        addSessionId: function (header) {
            return Restangular.withConfig(function(RestangularConfigurer) {
                $rootScope.header = angular.fromJson(header);
                console.log("Setting header");
                console.log($rootScope.header);

                RestangularConfigurer.setDefaultHeaders({
                    'Content-Type': 'application/json',
                    'HEADER': header
                });
            });
        },
        removeSessionId: function () {
            return Restangular.withConfig(function(RestangularConfigurer) {
                console.log("Removing header");
                $rootScope.header = undefined;
                RestangularConfigurer.setDefaultHeaders({
                    'Content-Type': 'application/json'
                });
            });
        }
    };
});



/*****************************************
 * SIGN OUT
 *****************************************/
app.service('signout', function ($rootScope, $sessionStorage, terminate, $location) {
    this.out = function () {
        terminate();
        $location.path('/');
    };
});


/**
 * @ngdoc function
 * @name ecmsEcmsUiApp.service:updateRestangularHeaders
 * @description updates headers in Restangular
 */
app.service('paramsToString', function () {
    return {
        implode: function (object) {
            var params = '';
            for (var paramName in object) {
                params += paramName + '=' + object[paramName] + '&';
            }
            params = params.substring(0, params.length - 1);    // remove last &
            return params;
        }
    };
});


/**
 * @ngdoc function
 * @name ecmsEcmsUiApp.service:spinner
 * @description toggles the loading spinner on and off
 */
app.service('spinner', function ($rootScope) {
    return {
        on: function () {
            $rootScope.loading = true;
        },
        off: function () {
            $rootScope.loading = false;
        }
    };
});


