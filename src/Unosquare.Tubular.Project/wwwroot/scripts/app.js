﻿(function (angular) {
    "use strict";

    angular.module('app.controllers', ['tubular.services', 'tubular.models'])
        .run(function ($rootScope) {
            $rootScope.$on('handleEmit', function (event, args) {
                $rootScope.$broadcast('handleBroadcast', args);
            });

            $rootScope.$on('titleEmit', function (event, args) {
                $rootScope.$broadcast('titleBroadcast', args);
            });
        });

    angular.module('app', [
        'ngRoute',
        'tubular',
        'ui.bootstrap',
        'app.controllers',
        'toastr'
    ]).config([
        '$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: '/views/home.html',
                    title: 'Home'
                }).when('/Login', {
                    templateUrl: '/views/login.html',
                    title: 'Login'
                });

            $routeProvider.otherwise({
                redirectTo: '/'
            });

            $locationProvider.html5Mode(true);
        }
    ]).config([
        '$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('noCacheInterceptor');
        }
    ]).factory('noCacheInterceptor', function() {
        return {
            request: function (config) {
                if (config.method == 'GET' && config.url.indexOf('.htm') === -1 && config.url.indexOf('blob:') === -1) {
                    var separator = config.url.indexOf('?') === -1 ? '?' : '&';
                    config.url = config.url + separator + 'noCache=' + new Date().getTime();
                }
                return config;
            }
        };
    }).service('alerts', [
        '$filter', 'toastr', function ($filter, toastr) {
            var me = this;

            me.previousError = '';

            me.defaultErrorHandler = function (error) {
                console.info(":( ", error);
                var errorMessage = $filter('errormessage')(error);

                me.previousError = errorMessage;

                // Ignores Unauthorized error because it's redirecting to login
                if (errorMessage != "Unauthorized")
                    toastr.error(errorMessage);
            };
        }
    ]);
})(window.angular);