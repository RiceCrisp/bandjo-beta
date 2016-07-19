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
  $scope.newinfluences = '';
  $scope.newgenres = '';
  $scope.influenceSelectionArray = [];
  $scope.genreSelectionArray = [];
  $scope.influenceMatches = [];
  $scope.genreMatches = [];
  $http.get('/api/user').
    then(function success(res) {
      $scope.results = res.data;
    }, function error(res) {
    }
  );
  $scope.checkgenres = function($event) {
    if ($scope.newgenres=="") {
      $scope.genreMatches = [];
    }
    if ($event.keyCode==13) {
      $scope.addgenres();
    } else {
      $http.get('http://ws.audioscrobbler.com/2.0/?method=artist.search&limit=5&artist=' + $scope.newgenres + '&api_key=4dd5d21f3a4234246c53f582afcdec55&format=json').
        then(function success(res) {
          $scope.genreMatches = res.data.results.artistmatches.artist;
        }, function error(res) {
        }
      );
    }
  }
  $scope.addgenres = function($event) {
    if ($scope.newgenres) {
      $http.post('/api/genres?add=' + $scope.newgenres).
        then(function success(res) {
          $scope.results.genres.push($scope.newgenres);
          $scope.newgenres = '';
          $scope.genreMatches = [];
        }, function error(res) {
        }
      );
    }
  }
  $scope.deletegenres = function($event) {
    $http.delete('/api/genres?delete=' + $scope.genreSelectionArray).
      then(function success(res) {
        $scope.genreSelectionArray.forEach(function(item) {
          var index = $scope.results.genres.indexOf(item);
          $scope.results.genres.splice(index, 1);
        });
        $scope.genreSelectionArray = [];
      }, function error(res) {
      }
    );
  }
  $scope.selectgenres = function selectgenres(selection) {
    var index = $scope.genreSelectionArray.indexOf(selection);
    if (index>=0) {
      $scope.genreSelectionArray.splice(index, 1);
    } else {
      $scope.genreSelectionArray.push(selection);
    }
  };
  $scope.checkinfluences = function($event) {
    if ($scope.newinfluences=="") {
      $scope.influenceMatches = [];
    }
    if ($event.keyCode==13) {
      $scope.addinfluences();
    } else {
      $http.get('http://ws.audioscrobbler.com/2.0/?method=artist.search&limit=5&artist=' + $scope.newinfluences + '&api_key=4dd5d21f3a4234246c53f582afcdec55&format=json').
        then(function success(res) {
          $scope.influenceMatches = res.data.results.artistmatches.artist;
        }, function error(res) {
        }
      );
    }
  }
  $scope.addinfluences = function() {
    if ($scope.newinfluences) {
      $http.post('/api/influences?add=' + $scope.newinfluences).
        then(function success(res) {
          $scope.results.influences.push($scope.newinfluences);
          $scope.newinfluences = '';
          $scope.influenceMatches = [];
        }, function error(res) {
        }
      );
    }
  }
  $scope.updatenewinfluence = function(newVar) {
    $scope.newinfluences = newVar;
    $scope.addinfluences();
  }
  $scope.deleteinfluences = function() {
    $http.delete('/api/influences?delete=' + $scope.influenceSelectionArray).
      then(function success(res) {
        $scope.influenceSelectionArray.forEach(function(item) {
          var index = $scope.results.influences.indexOf(item);
          $scope.results.influences.splice(index, 1);
        });
        $scope.influenceSelectionArray = [];
      }, function error(res) {
      }
    );
  }
  $scope.selectinfluences = function selectinfluences(selection) {
    var index = $scope.influenceSelectionArray.indexOf(selection);
    if (index>=0) {
      $scope.influenceSelectionArray.splice(index, 1);
    } else {
      $scope.influenceSelectionArray.push(selection);
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
