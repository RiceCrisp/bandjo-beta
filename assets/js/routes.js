'use strict';

angular.module('myApp', ['ngRoute']).
  config(['$routeProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/partials/home',
        controller: IndexCtrl
      }).
      when('/test', {
        templateUrl: 'views/partials/home',
        controller: IndexCtrl
      }).
      otherwise({
        redirectTo: '/dumb'
      });
  }]);
