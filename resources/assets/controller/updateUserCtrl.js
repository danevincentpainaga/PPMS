'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:updateUserCtrl
 * @description
 * # updateUserCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller('updateUserCtrl',['$scope', '$rootScope', '$cookies', '$window',
                                  '$location', '$timeout', 'apiService', 'swalert',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, apiService, swalert) {

  var ud = this;
  $scope.$on('departmentDetails', function(val, obj){
    ud.departments = obj;
  });

  $scope.$on('usertypesDetails', function(val, obj){
    ud.userTypes = obj;
  });

  $scope.$on('user', function(val, obj){
    ud.user = obj;
    angular.forEach(ud.userTypes, function(val, i){
      if (ud.user.usertype_id == val.usertype_id) { 
        ud.selectedUserType = val;
      }
    });
    angular.forEach(ud.departments, function(val, i){
      if (ud.user.department_name == val.department_name) {
        ud.selectedDepartment = val;
      }
    });
  });


  ud.updateuser = function(){
    if(ud.user.name && ud.user.email && ud.selectedUserType && ud.selectedDepartment){
      var updatedUserDetails = {
        id: ud.user.id,
        name: ud.user.name,
        email: ud.user.email,
        usertypeId: ud.selectedUserType.usertype_id,
        departmentId: ud.selectedDepartment.department_id,
      }
      updatedUserData(updatedUserDetails);
    }
    else
    {
      swalert.errorAlert('Complete the form');
    }
  }

  ud.resetPassword = function(){
    if(ud.newpassword){
      var credentials = {
        id: ud.user.id,
        newpassword: ud.newpassword,
      }
      resetUserPassword(credentials);
    }
  }

  function updatedUserData(userData){
    apiService.updateUser(userData).then(function(response){
      console.log(response);
      swalert.successAlert('User updated!');
      $scope.$emit('reload_userlist');
    }, function(error){
      console.log(error);
      swalert.errorAlert('try again');
    });
  }

  function resetUserPassword(credentials){
    apiService.resetPassword(credentials).then(function(response){
      console.log(response);
      swalert.successAlert(response.data.status);
    }, function(error){
      console.log(error);
      swalert.errorAlert('Current Password Incorrect!');
    });
  }
}]);
