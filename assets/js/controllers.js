'use strict';

function GetUserCtrl($scope, $http, $routeParams) {
  if ($routeParams.id) {
    $http.get('/api/user?id=' + $routeParams.id).
      success(function(data) {
        $scope.results = data;
      });
  } else {
    $http.get('/api/user?url=' + $routeParams.link).
      success(function(data) {
        $scope.results = data;
      });
  }
}

function EditUserCtrl($scope, $http) {
  var test = $cookies.get('userID');
  //alert(LoggedInID);
  alert(test);
  $http.get('/api/user?id=' + '5734a889181538fe31b86227').
    success(function(data) {
      $scope.results = data;
    });
}

function LoginCtrl($scope, $http) {
  $scope.submit = function() {
    $http.post('/api/login', {email: $scope.email, password: $scope.password}).
      success(function(data) {
        alert(data);
        $scope.results = data;
      });
  };
}
