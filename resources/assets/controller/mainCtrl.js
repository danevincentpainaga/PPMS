'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:mainAppCtrl
 * @description
 * # mainAppCtrl
 * Controller of the PPMS
 */

var app = angular.module('myApp')
app.controller('mainAppCtrl',['$scope', '$rootScope', '$location', '$http', '$ngConfirm',
                              '$filter', '$timeout', '$cookies', '$window', 'apiService', 'swalert',
  function ($scope, $rootScope, $location, $http, $ngConfirm, $filter, $timeout, $cookies, $window, apiService, swalert) {
  
  $scope.selected = 1;
  
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
    $window.location.reload();   
  }
  
  //Recieved Emitted Data from Controllers

  $scope.$on('Authenticated', function(){
    swalert.successInfo("<label class='green'>Welcome Back "+$cookies.getObject('auth').name+"!</label>", 'success', 3000);
  });

  $scope.$on('selected_reservation', function(val, obj){
    $scope.$broadcast('get_selected_reservation', obj );
  });

  $scope.$on('viewAddedReservation', function(val, obj){
    $scope.$broadcast('updateAddedReservation');
  });

  $scope.$on('reload_venue_list', function(){
    $scope.$broadcast('reloading_venue_list');
  });

  $scope.$on('reload_department_list', function(){
    $scope.$broadcast('reloading_department_list');
  });

  $scope.$on('userToUpdate', function(val, obj){
    $scope.$broadcast('user', obj);
  });

  $scope.$on('reload_userlist', function(){
    $scope.$broadcast('reloading_userlist');
  });

  $scope.$on('usertypesData', function(val, obj){
    $scope.$broadcast('usertypesDetails', obj);
  });

  $scope.$on('departmentsData', function(val, obj){
    $scope.$broadcast('departmentDetails', obj);
  });

  $scope.$on('venueData', function(val, obj){
    $scope.$broadcast('venueDetails', obj);
  });

  $scope.$on('emittedItem', function(val, obj){
    $scope.$broadcast('broadcastedItem', obj);
  });

  $scope.$on('emittedRefreshStockTable', function(){
    $scope.$broadcast('refreshStockTable');
  });

  //Recieved from workCtrl
  $scope.$on('itemToBeUpdated', function(val, obj){
    $timeout(function(){
       $scope.$broadcast('emittedItem', obj);
    });
  });

  $scope.$on('newItemDetails', function(val, obj){
    $timeout(function(){
       $scope.$broadcast('emittedNewItem', obj);
    });
  });

  $scope.$on('work_id', function(val, obj){
    $timeout(function(){
       $scope.$broadcast('emittedWorkId', obj);
    });
  });
  
  $scope.$on('EmitRefreshItems', function(){
    $timeout(function(){
       $scope.$broadcast('broadcastedRefreshItems');
    });
  });

}]);

