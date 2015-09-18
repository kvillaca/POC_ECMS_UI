/**
 * Created by kvillaca on 9/18/2015.
 */
angular.module('ecmsEcmsUiApp').controller('NotFoundController', function ($scope,
                                                 $rootScope,
                                                 $state,
                                                 $sessionStorage,
                                                 ecmsSession,
                                                 signout) {

       'use strict';
       signout.out();
    });
