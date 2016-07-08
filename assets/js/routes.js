'use strict';

var app = angular.module('myApp', ['ngRoute', 'ngAnimate']);

app.controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', LoginCtrl]);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/home'
    }).
    when('/profile', {
      templateUrl: 'partials/edit',
      controller: EditUserCtrl
    }).
    when('/profile/:id', {
      templateUrl: 'partials/profile',
      controller: GetUserCtrl
    }).
    when('/signup', {
      templateUrl: 'partials/signup'
    }).
    when('/test', {
      templateUrl: 'partials/login'
    }).
    when('/logout', {
      templateUrl: 'partials/home'
    }).
    when('/:link', {
      templateUrl: 'partials/profile',
      controller: GetUserCtrl
    }).
    otherwise({
      redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
});
