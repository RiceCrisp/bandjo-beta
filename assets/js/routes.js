'use strict';

var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/home'
    }).
    when('/:link', {
      templateUrl: 'partials/profile',
      controller: GetUserCtrl
    }).
    when('/profile/:id', {
      templateUrl: 'partials/profile',
      controller: GetUserCtrl
    }).
    when('/test', {
      templateUrl: 'partials/login'
    }).
    otherwise({
      redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
});
