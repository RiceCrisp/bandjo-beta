'use strict';

var app = angular.module('myApp', ['ngRoute']);
//app.controller('LoginCtrl', [$scope, function($scope) {
  //$scope.submit = function() {
    //alert('yo');
    //$http.get('/api/login?email=' + $scope.email + '&password=' + $scope.password).
      //success(function(data) {
        //$scope.results = data;
      //});
  //};
//}]);
app.config(function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/home',
      controller: LoginCtrl
    }).
    when('/profile', {
      templateUrl: 'partials/profile',
      controller: EditUserCtrl
    }).
    when('/profile/:id', {
      templateUrl: 'partials/profile',
      controller: GetUserCtrl
    }).
    when('/test', {
      templateUrl: 'partials/login'
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
