'use strict';

function GetUserCtrl($scope, $http, $routeParams) {
  $scope.firstName = 'test';
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

function LoginCtrl($scope, $http, $routeParams) {
  $http.get('/api/login/' + $routeParams).
    success(function(data) {
      $scope.results = data;
    });
}
/*
function AddPostCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitPost = function () {
    $http.post('/api/post', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}

function ReadPostCtrl($scope, $http, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });
}

function EditPostCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.post;
    });

  $scope.editPost = function () {
    $http.put('/api/post/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function DeletePostCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });

  $scope.deletePost = function () {
    $http.delete('/api/post/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}
*/
