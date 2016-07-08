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
  $scope.selectionArray = [];
  $http.get('/api/user').
    then(function success(res) {
      $scope.results = res.data;
    }, function error(res) {
    }
  );
  $scope.addinfluences = function() {
    if ($scope.newinfluences) {
      $http.post('/api/influences?add=' + $scope.newinfluences).
        then(function success(res) {
          $scope.results.influences.push($scope.newinfluences);
          $scope.newinfluences = '';
        }, function error(res) {
        }
      );
    }
  };
  $scope.deleteinfluences = function() {
    $http.delete('/api/influences?delete=' + $scope.influences).
      then(function success(res) {
        alert(res);
        $scope.selectionArray.forEach(function(item) {
          var index = $scope.results.influences.indexOf(item);
          $scope.results.influences.splice(index, 1);
        });
        $scope.selectionArray = [];
      }, function error(res) {
      }
    );
  };
  $scope.selectinfluences = function selectinfluences(selection) {
    var index = $scope.selectionArray.indexOf(selection);
    if (index>=0) {
      $scope.selectionArray.splice(index, 1);
    } else {
      $scope.selectionArray.push(selection);
    }
  };
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
          $location.path('/profile');
          $rootScope.loggedIn = true;
          $rootScope.firstName = res.data.firstName;
          $rootScope.lastName = res.data.lastName;
          $rootScope.loggedInImage = res.data.photo;
          $scope.errMsg = false;
          $scope.password = '';
        }
      }, function error(res) {
      }
    );
  };
  $scope.goHome = function() {
    $location.path('/');
  }
}
