'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:departmentCtrl
 * @description
 * # departmentCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller('departmentCtrl',['$scope', '$rootScope', '$cookies', '$window',
                                   '$location', '$timeout', 'apiService', 'swalert',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, apiService, swalert) {

  var dept = this;
  var departmentId;
  dept.updating = false;
  departmentData();

  $scope.$on('reloading_department_list', function(){
    departmentData();
  });

  dept.edit = function(deptObject) {
    dept.selectedDept = angular.copy(deptObject);
    dept.department = deptObject;
    departmentId = deptObject.department_id;
    dept.editing = true;
    dept.disableDelete = true;
  }

  dept.cancelEdit = function(){
    dept.editing = false;
    dept.disableDelete = false;
    if (dept.selectedDept.department_name != dept.department.department_name)
            dept.department.department_name = dept.selectedDept.department_name 
  }

  dept.update = function(departmentName){
    var updatedDeptName = {
      department_id: departmentId,
      department_name: departmentName.toUpperCase()
    };
    dept.updating = true;
    dept.disableDelete = false;
    updateDepartmentData(updatedDeptName);
  }

  dept.deleteDepartment = function(delDepartment){
    swalert.showAlert(delDepartment, removeDepartmentData);
  }

  function departmentData() {
    dept.isLoading = true;
    apiService.getDepartments().then(function(response){
      dept.departments = response.data;
      $timeout(function() {
        dept.isLoading = false;
      }, 1000);
    }, function(error){
      console.log(error);
    });
  }

  function updateDepartmentData(updatedDetails) {
    apiService.updateDepartment(updatedDetails).then(function(response){
      dept.editing = false;
      dept.updating = false;
      swalert.successInfo('Department Updated!', 'success', 3000);
    }, function(error){
      console.log(error);
      dept.message = error.data;
    });    
  }

  function removeDepartmentData(departmentObj){
    apiService.removeDepartment(departmentObj).then(function(response){
      dept.departments.splice(dept.departments.indexOf(departmentObj), 1);
      swalert.successInfo('Department has been deleted', 3000);
    }, function(error){
      console.log(error);
      checkIntegrityError(error.status);
    });
  } 

  function checkIntegrityError(constraints){
    constraints == 500 ? 
    swalert.errorAlert('Cannot delete or update parent row. This department name is being use.') : swalert.errorAlert('Failed! retry again.');
  }

}]);

