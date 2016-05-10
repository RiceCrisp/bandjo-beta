'use strict';
var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/home'
    }).
    when('/test', {
      templateUrl: 'partials/login'
    }).
    otherwise({
      redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
});
