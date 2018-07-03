'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:myCtrl
 * @description
 * # myCtrl
 * Controller of the mytodoApp
 */

var app = angular.module('myApp')
app.controller('mainAppCtrl',['$scope', '$rootScope', '$location', '$http', '$ngConfirm','$filter', '$timeout', '$cookies', 'apiService',
  function ($scope, $rootScope, $location, $http, $ngConfirm, $filter, $timeout, $cookies, apiService) {
  
  $scope.selected = 1;

  userCount();
  
  $scope.redirectTo = function(location){
    $location.path(location);
  }

  $scope.isActivated = function(destination){
    return destination == $location.path();
  }

  $scope.selectedTown = function(selected){
    $scope.selected = selected;
  }

  $scope.isSelected = function(selectedId){
    return $scope.selected === selectedId;
  }

  $scope.logout= function(){
    $cookies.remove('auth');
    $rootScope.header = false;
    $location.path('/');
  }
  
  //Recieved Selected View Details from Request
  $scope.$on('selected_reservation', function(val, obj){
    $scope.$broadcast('get_selected_reservation', obj );
  });

  function userCount(){
    apiService.countUsers().then(function(response){
      console.log(response);
      $scope.userCount = response.data.userCount;
      $scope.depertmentCount = response.data.departmentCount;
      $scope.reservationVenueCount = response.data.client_reservation;
    }, function(error){
      console.log(error);
    });
  }

}]);

