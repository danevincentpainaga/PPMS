'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:profileCtrl
 * @description
 * # profileCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller('profileCtrl',
      ['$scope', '$rootScope', '$cookies', '$location', '$http', '$ngConfirm','$filter', '$timeout', '$q', 'apiService', 'swalert',
        function ($scope, $rootScope, $cookies, $location, $http, $ngConfirm, $filter, $timeout, $q, apiService, swalert) {

  var pc = this;
  pc.isLoading = true;
  var auth = $cookies.getObject('auth');
  auth.userType == 1? pc.hideDepartment = true : pc.hideDepartment = false;

  loadProfile();

  pc.updateuser = function(){
    if(pc._name && pc.email && pc.selectedDepartment){
      var updatedUserDetails = {
        id: auth.user_id,
        name: pc._name,
        email: pc.email,
        usertypeId: auth.userType,
        departmentId: pc.selectedDepartment.department_id,
      }
      swalert.updateAlert(updatedUserDetails, updatedUserData);
    }
  }

  pc.updatePassword = function(){
    if(pc.password && pc.newpassword){
      var credentials = {
        id: auth.user_id,
        password: pc.password,
        newpassword: pc.newpassword,
      }
      updatedUserPassword(credentials);
    }
  }

  function updatedUserData(userData){
    apiService.updateUser(userData).then(function(response){
      $rootScope.userLogName = pc._name;
      let newCookie = {
        departmentId: auth.departmentId,
        name: pc._name,
        success: {
          token: auth.success.token
        },
        userType: auth.userType,
        user_id: auth.user_id,
      };
      $cookies.putObject('auth', newCookie);
      swalert.successAlert('User details updated!');
    }, function(error){
      console.log(error);
      swalert.errorAlert('try again');
    });
  }

  function updatedUserPassword(credentials){
    apiService.updatedPassword(credentials).then(function(response){
      swalert.successAlert('Password updated!');
    }, function(error){
      console.log(error);
      swalert.errorAlert('Current Password Incorrect!');
    });
  }

  function loadProfile(){
    $q.all([apiService.getProfile(), apiService.getDepartments()]).then(function(response){
      pc._name = response[0].data[0].name;
      pc.email = response[0].data[0].email;
      pc.departments = response[1].data;
      giveInitialValueToDept(response[1].data);
    }, function(error){
      console.log(error);
    });
  }

  function giveInitialValueToDept(dept){
    angular.forEach(dept, function(val, i){
      auth.departmentId == val.department_id ? pc.selectedDepartment = val : null;
    });
    pc.isLoading = false;
  }

}]);
