'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:adduserCtrl
 * @description
 * # adduserCtrl
 * Controller of the mytodoApp
 */
var app = angular.module('myApp')
  app.controller('userCtrl',['$scope', '$rootScope', '$cookies', '$ngConfirm', '$window', '$location', '$timeout', 'apiService',
  function ($scope, $rootScope, $cookies, $ngConfirm, $window, $location, $timeout, apiService) {

  var au = this;
  au.response = false;
  au.isLoading = false;

  departments();
  usertypes();
  users();

  au.addUser = function(){

    if(!au.name || !au.email || !au.password || !au.password || !au.selectedUserType || !au.selectedDepartment){
      alert('Complete all the Required fields');
    }else{
      var userDetails = {
        name: au.name,
        email: au.email,
        password: au.password,
        usertypeId: au.selectedUserType.usertype_id,
        departmentId: au.selectedDepartment.department_id
      }
      addUserDetails(userDetails);
    }
  }

  au.deleteUser = function(user){
    if(user.usertype_id === 1){
      failedDialog();
    }
    else{
      var userId = user.id;
      confirmDialog(userId);    
    }
    
  }

  function departments(){
    apiService.getDepartments().then(function(response){
      console.log(response);
      au.departments = response.data;
    }, function(error){
      console.log(error);
    });
  }

  function usertypes(){
    apiService.getUserTypes().then(function(response){
      console.log(response);
      au.userTypes = response.data;
    }, function(error){
      console.log(error);
    });
  }

  function addUserDetails(userDetails){
    apiService.addUser(userDetails).then(function(response){
      console.log(response);
      au.message = 'Successfully Added!';
      au.response = true;
    }, function(error){
      console.log(error);
      au.message = 'failed! try again.';
      au.response = true;
    });
  }

  function users(){
    au.isLoading = true;
    apiService.getUsers().then(function(response){
      console.log(response);
      au.users = response.data;
      au.isLoading = false;
    }, function(error){
      console.log(error);
    });
  }

  function userToBeDeleted(userId){
    apiService.deleteUsers(userId).then(function(response){
      console.log(response);
    }, function(error){
      console.log(error);
    });
  }
  
  function confirmDialog(userId){
    $ngConfirm({
        title: '',
        content: 'Delete this user?',
        type: 'blue',
        typeAnimated: true,
          buttons: {
            Yes: {
              text: 'Yes',
              btnClass: 'btn-red',
              action: function(){
                userToBeDeleted(userId);
                $ngConfirm('Venue deleted');
              }
            },
            Cancel: {
              text: 'No',
              btnClass: 'btn-blue',
            }
          }
    });
  }

  function failedDialog(){
    $ngConfirm({
        title: 'Error!',
        content: 'Superadmin not Deletable!',
        type: 'red',
        typeAnimated: true,
          buttons: {
            OK: {
              text: 'Ok',
              btnClass: 'btn-red',
            }
          }
    });
  }
}]);
