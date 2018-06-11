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

  function userCount(){
    apiService.countUsers().then(function(response){
      console.log(response);
      $scope.userCount = response.data.userCount;
      $scope.depertmentCount = response.data.userCount;
      $scope.reservationVenueCount = response.data.userCount;
    }, function(error){
      console.log(error);
    });
  }

}]);

