angular.module('starter', ['ionic'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }

    });
  })
  .controller('LoginController', function ($scope, $timeout, $ionicPopup, $ionicLoading, LoginService) {

    var logged = window.localStorage['logged'];

    if (logged === true) {
      $ionicLoading.show({
        template: "Redirecting..."
      });

      $timeout(function () {
        $ionicLoading.hide();
        window.location.href = "home.html";
      }, 3000);
    }

    $scope.doLogin = function () {
      console.log($scope.user.username);
      console.log($scope.user.password);

      var username = $scope.user.username;
      var password = $scope.user.password;

      if (!username) {
        alert('Please enter username');
      } else if (!password) {
        alert('Please enter password');
      } else {
        LoginService.doLogin(username, password)
          .then(function (data) {
            console.log(data);
            if (data.ok) {
              window.localStorage['logged'] = true;
              window.localStorage['username'] = data.username;
              window.localStorage['session_key'] = data.session_key;
              window.location.href = 'home.html';
            } else {
              if (angular.isObject(data.msg)) {
                $ionicPopup.alert({
                  title: 'เกิดข้อผิดพลาด',
                  template: JSON.stringify(data.msg)
                });
              } else {
                $ionicPopup.alert({
                  title: 'เกิดข้อผิดพลาด',
                  template: data.msg
                });
              }
            }
          }, function (err) {
            alert(err);
          })
      }
    };

    $scope.doClear = function () {
      $scope.user.username = '';
      $scope.user.password = '';
    };

  })
  .factory('LoginService', function ($q, $http) {
    return {
      doLogin: function (username, password) {
        var q = $q.defer();

        var options = {
          url: 'http://localhost:3000/users/login',
          method: 'POST',
          data: {
            username: username,
            password: password
          }
        };

        $http(options)
          .success(function (data) {
            q.resolve(data);
          })
          .error(function (data, status) {
            q.reject('Connection error: ' + status);
          });

        return q.promise;

      }
    }
  });
