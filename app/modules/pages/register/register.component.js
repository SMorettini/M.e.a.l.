angular.module('mealApp').component('register', {
  templateUrl: 'modules/pages/register/register.template.html',
  controller: ['$scope', '$location', 'UserService',
              function ($scope, $location, UserService) {

                $scope.register = function () {

                  // initial values
                  $scope.error = false;
                  $scope.disabled = true;

                  // call register from service
                  UserService.register($scope.registerForm)
                    // handle success
                    .then(function () {
                      $location.path('/login');
                      $scope.disabled = false;
                      $scope.registerForm = {};
                    })
                    // handle error
                    .catch(function () {
                      $scope.error = true;
                      $scope.errorMessage = "Something went wrong!";
                      $scope.disabled = false;
                      $scope.registerForm = {};
                    });

                };
              }]

  
});