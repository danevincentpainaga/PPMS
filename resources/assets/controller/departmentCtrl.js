'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:departmentCtrl
 * @description
 * # departmentCtrl
 * Controller of the myApp
 */
var app = angular.module('myApp')
  app.controller('departmentCtrl',['$scope', '$rootScope', '$cookies',
  '$window', '$location', '$timeout', 'apiService',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, apiService) {

  var dept = this;
  var departmentId;

  departmentData();

  dept.edit = function(deptObject) {
    dept.department = deptObject.department_name;
    departmentId = deptObject.department_id;
    dept.editing = true;
  }

  dept.cancelEdit = function(){
    dept.editing = false;
    dept.alertMessage = false;
  }

  dept.update = function(departmentName){
    var updatedDeptName = {
      department_id: departmentId,
      department_name: departmentName,
    }
    console.log(updatedDeptName);
    updateDepartmentData(updatedDeptName);
  }

  function departmentData() {
    apiService.getDepartments().then(function(response){
      console.log(response);
      dept.departments = response.data;
    }, function(error){
      console.log(error);
    });
  }

  function updateDepartmentData(updatedDetails) {
    apiService.updateDepartment(updatedDetails).then(function(response){
      console.log(response);
      dept.message = response.data.message;
      dept.alertMessage = true;
    }, function(error){
      console.log(error);
      dept.message = error.data;
      dept.alertMessage = true;
    });    
  }

}]);
