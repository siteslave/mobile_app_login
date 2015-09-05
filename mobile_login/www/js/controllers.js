angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, DashServ, $ionicPopup) {

    $scope.logout = function () {
      DashServ.logOut()
        .then(function () {
          // Clear session
          window.localStorage['logged'] = false;
          window.localStorage['username'] = null;
          window.localStorage['session_key'] = null;
          // Redirect
          window.location.href = 'index.html';
        }, function (err) {
          alert(JSON.stringify(err));
        });

    };

    // Get fruit
    DashServ.getFruits()
      .then(function (data) {
        console.log(data);
        if (data.ok) {
          $scope.fruits = data.rows;
        } else {
          $ionicPopup.alert({
            title: 'เกิดข้อผิดพลาด',
            template: JSON.stringify(data.msg)
          });
        }

      }, function (err) {
        alert(JSON.stringify(err));
      });
  })

  .factory('DashServ', function ($q, $http) {
    return {
      getFruits: function () {
        var q = $q.defer();
        var key = window.localStorage['session_key'];
        var username = window.localStorage['username'];

        $http({
          url: 'http://localhost:3000/fruits',
          method: 'POST',
          data: {
            key: key,
            username: username
          }
        })
          .success(function (data) {
            q.resolve(data);
          })
          .error(function (data, status) {
            q.reject('Connection error: ' + status);
          });

        return q.promise;
      },

      logOut: function () {
        var q = $q.defer();
        var username = window.localStorage['username'];

        $http({
          url: 'http://localhost:3000/users/logout',
          method: 'POST',
          data: {
            username: username
          }
        })
          .success(function (data) {
            q.resolve(data);
          })
          .error(function (data, status) {
            q.reject('Connection error: ' + status);
          });

        return q.promise;
      }
    }
  })

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});


  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
