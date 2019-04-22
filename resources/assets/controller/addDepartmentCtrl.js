'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:addDepartmentCtrl
 * @description
 * # addDepartmentCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller('addDepartmentCtrl',['$scope', '$rootScope', '$cookies',
  '$window', '$location', '$timeout', '$ngConfirm', 'apiService', 'debounce',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, $ngConfirm, apiService, debounce) {

  var adept = this;
  adept.disableSave = true;

  $scope.$watch('adept.department', debounce(function() {
     console.log(adept.department);
     if(!adept.department){
        adept.passedOrFail = null;
        adept.success = false;
        adept.fail = false;
        adept.disableSave = true;
     }
     else
     {
        validateDepartmentIfExist(adept.department);
     }
  },500), true);
 
  adept.addDepartment = function(deptValue){
    let deptVal = { department_name: deptValue.toUpperCase() };
    if(deptValue && adept.success == true){
      confirmDialog(deptVal);
    }
  }

  adept.closeModal = function(){
    adept.department = "";
    adept.passedOrFail = null;
    adept.success = false;
    adept.fail = false;
    adept.disableSave = true;
  }

  function validateDepartmentIfExist(deptName){
    apiService.validateDepartment(deptName).then(function(response){
      console.log(response);
      adept.passedOrFail = true;
      adept.fail = false;
      adept.success = true;
      adept.disableSave = false;
    }, function(error){
      console.log(error);
      adept.passedOrFail = false;
      adept.success = false;
      adept.fail = true;
      adept.disableSave = true;
    });
  }

  function addedDepartment(deptValue){
    apiService.addDepartment(deptValue).then(function(response){
      adept.department = "";
      adept.response = true;
      $scope.$emit('reload_department_list');
      adept.message = 'Successfully Added';
      $timeout(function(){
        adept.response = true;
      }, 1000);
    }, function(error){
      console.log(error);
      adept.message = error.data;
    });
  }

  function confirmDialog(deptVal){
    $ngConfirm({
      title: '',
      content: 'SAVE?',
      type: 'green',
      theme:'seamless',
        buttons: {
          Yes: {
            text: 'Yes',
            btnClass: 'btn-green',
            action: function(){
              addedDepartment(deptVal);
            }
          },
          Cancel: {
            text: 'No',
            btnClass: 'btn-blue',
          }
        }
    });
  }

}]);
  
app.factory('debounce', function($timeout) {
    return function(callback, interval) {
        var timeout = null;
        return function() {
            $timeout.cancel(timeout);
            timeout = $timeout(function () { 
                callback.apply(this, arguments); 
            }, interval);
        };
    }; 
});