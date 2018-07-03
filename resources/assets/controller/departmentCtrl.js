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
  '$window', '$location', '$timeout', '$ngConfirm', 'apiService',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, $ngConfirm, apiService) {

  var dept = this;
  var departmentId;

  departmentData();

  dept.edit = function(deptObject) {
    dept.department = deptObject.department_name;
    departmentId = deptObject.department_id;
    dept.editing = true;
    dept.disableDelete = true;
  }

  dept.cancelEdit = function(){
    dept.editing = false;
    dept.alertMessage = false;
    dept.disableDelete = false;
  }

  dept.update = function(departmentName){
    var updatedDeptName = {
      department_id: departmentId,
      department_name: departmentName,
    }
    console.log(updatedDeptName);
    updateDepartmentData(updatedDeptName);
  }

  dept.addDepartment = function(deptValue){
    var deptVal = { department_name: deptValue };
    addedDepartment(deptVal);
  }

  dept.deleteDepartment = function(delDepartment){
    console.log(delDepartment);
    confirmDialog(delDepartment);
  }

  function departmentData() {
    dept.isLoading = true;
    apiService.getDepartments().then(function(response){
      console.log(response);
      dept.isLoading = false;
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

  function addedDepartment(deptValue){
    apiService.addDepartment(deptValue).then(function(response){
      dept.response = true;
      dept.message = 'Successfully Added';
      console.log(response);
    }, function(error){
      console.log(error);
      dept.message = error.data;
    });
  }

  function removeDepartmentData(departmentObj){
    apiService.removeDepartment(departmentObj).then(function(response){
      console.log(response);
      dept.departments.splice(dept.departments.indexOf(departmentObj), 1);
      $ngConfirm('Department deleted');
    }, function(error){
      console.log(error);
      checkIntegrityError(error.status);
    });
  }

  function confirmDialog(deptObj){
    $ngConfirm({
      title: '',
      content: 'Delete this Department?',
      type: 'blue',
      typeAnimated: true,
        buttons: {
          Yes: {
            text: 'Yes',
            btnClass: 'btn-red',
            action: function(){
              removeDepartmentData(deptObj);
            }
          },
          Cancel: {
            text: 'No',
            btnClass: 'btn-blue',
          }
        }
    });
  }

  function failedDialog(errorMessage){
    $ngConfirm({
      title: '',
      content: errorMessage,
      type: 'red',
      typeAnimated: true,
    });
  }  

  function checkIntegrityError(constraints){
    constraints == 500 ? 
    failedDialog('Cannot delete or update parent row. This department name is being used.') : failedDialog('Failed! retry again.');
  }

}]);
