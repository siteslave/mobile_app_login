angular.module('app', [])
    .controller('LoginController', function ($scope, $window, LoginService) {
        $scope.doLogin = function () {
            var username = $scope.username;
            var password = $scope.password;

            if (!username) {
                alert('Please enter username');
            } else if (!password) {
                alert('Please enter password');
            } else {
                LoginService.login(username, password)
                    .then(function (data) {
                        console.log(data);
                        if (data.ok) {
                            alert('Login success');
                            $window.location.href = '/';
                        } else {
                            alert(JSON.stringify(data.msg));
                        }
                    }, function (err) {
                        alert(err);
                    })
            }
        }
    })
    .factory('LoginService', function ($q, $http) {
        return {
            login: function (username, password) {

                var q = $q.defer();

                var options = {
                    url: '/users/login',
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