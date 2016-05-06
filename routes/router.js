'use strict';

angular.module('myApp', ['ngRoute', 'controllers.js']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/profile',
        controller: IndexCtrl
      }).
      when('/test', {
        templateUrl: 'views/profile',
        controller: IndexCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);
