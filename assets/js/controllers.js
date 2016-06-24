'use strict';

function GetUserCtrl($scope, $http, $routeParams) {
  if ($routeParams.id) {
    $http.get('/api/user?id=' + $routeParams.id).
      then(function success(res) {
        $scope.results = res.data;
      }, function error(res) {
      }
    );
  } else {
    $http.get('/api/user?url=' + $routeParams.link).
      then(function success(res) {
        $scope.results = res.data;
      }, function error(res) {
      }
    );
  }
}

function EditUserCtrl($scope, $http) {
  $http.get('/api/user').
    then(function success(res) {
      $scope.results = res.data;
    }, function error(res) {
    }
  );
}

function LoginCtrl($scope, $rootScope, $http, $location) {
  $http.get('/api/autologin/').
    then(function success(res) {
      if (res.data!='0') {
        $rootScope.loggedIn = true;
        $rootScope.firstName = res.data.firstName;
        $rootScope.lastName = res.data.lastName;
        $rootScope.loggedInImage = res.data.photo;
      }
    }, function error(res) {
    }
  );
  $scope.logout = function() {
    $http.get('/api/logout/').
      then(function success(res) {
        $rootScope.loggedIn = false;
        $rootScope.firstName = null;
        $rootScope.lastName = null;
        $rootScope.loggedInImage = null;
        $location.path('/');
      }, function error(res) {
      }
    );
  };
  $scope.login = function() {
    $http.post('/api/login/', {email: $scope.email, password: $scope.password}).
      then(function success(res) {
        if (res.data=='0') {
          $scope.errMsg = true;
          $scope.password = '';
        } else {
          $rootScope.loggedIn = true;
          $rootScope.firstName = res.data.firstName;
          $rootScope.lastName = res.data.lastName;
          $rootScope.loggedInImage = res.data.photo;
          $location.path('/profile');
        }
      }, function error(res) {
      }
    );
  };
  $scope.goHome = function() {
    $location.path('/');
  }
}
