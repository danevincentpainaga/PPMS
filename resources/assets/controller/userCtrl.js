'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:userCtrl
 * @description
 * # userCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller('userCtrl',['$scope', '$rootScope', '$cookies', '$ngConfirm', 
                             '$window', '$location', '$timeout', 'apiService', 'debounce', 'swalert', 'socket',
  function ($scope, $rootScope, $cookies, $ngConfirm, $window, $location, $timeout, apiService, debounce, swalert, socket) {

  var au = this;
  au.response = false;
  au.isLoading = false;
  au.disableSave = true;

  departments();
  usertypes();
  users();

  $scope.$watch('au.email', debounce(function() {
     console.log(au.email);
     if(!au.email){
        au.passedOrFail = null;
        au.success = false;
        au.fail = false;
        au.disableSave = true;
     }
     else
     {
        validateEmailIfExist(au.email);
     }
  },500), true);

  socket.on('messageSend', function(data) {
      console.log(data);
  });

  $scope.$on('reloading_userlist', function(){
    users();
  });

  au.addUser = function(){
    if(au.name || au.email || au.password || au.password || au.selectedUserType || au.selectedDepartment){
      var userDetails = {
        name: au.name,
        email: au.email,
        password: au.password,
        usertypeId: au.selectedUserType.usertype_id,
        departmentId: au.selectedDepartment.department_id
      }
      au.disableSave = true;
      swalert.successInfo('<i class="fa fa-spinner fa-spin"></i>Saving...', 'info', );
      addUserDetails(userDetails);
    }
  }

  au.deleteUser = function(user){
    swalert.showAlert(user, userToBeDeleted); 
  }

  au.updateUser = function(user){
    $scope.$emit('userToUpdate', user)
  }

  function departments(){
    apiService.getDepartments().then(function(response){
      console.log(response);
      au.departments = response.data;
      $scope.$emit('departmentsData', au.departments);
    }, function(error){
      console.log(error);
    });
  }

  function usertypes(){
    apiService.getUserTypes($cookies.getObject('auth').userType).then(function(response){
      console.log(response);
      au.userTypes = response.data;
      $scope.$emit('usertypesData', au.userTypes);
    }, function(error){
      console.log(error);
    });
  }

  function addUserDetails(userDetails){
    apiService.addUser(userDetails).then(function(response){
      console.log(response);
      au.message = 'Successfully Added!';
      au.response = true;
      au.name = "";
      au.email = "";
      au.password = "";
      au.selectedUserType = "";
      au.selectedDepartment = "";
      swalert.successInfo('Successfully Added!', 'success', 3000);
    }, function(error){
      console.log(error);
      au.message = 'failed! try again.';
      au.response = true;
    });
  }

  function users(){
    au.isLoading = true;
    apiService.getUsers().then(function(response){
      au.users = response.data;
      au.isLoading = false;
    }, function(error){
      console.log(error);
    });
  }

  function userToBeDeleted(user){
    apiService.deleteUsers(user.id).then(function(response){
      swalert.successAlert("User has been deleted");
      au.users.splice(au.users.indexOf(user), 1);
    }, function(error){
      console.log(error);
      checkIntegrityError(error.status);
    });
  }

  function validateEmailIfExist(deptName){
    apiService.validateEmail(deptName).then(function(response){
      console.log(response);
      au.passedOrFail = true;
      au.fail = false;
      au.success = true;
      au.disableSave = false;
    }, function(error){
      console.log(error);
      au.passedOrFail = false;
      au.success = false;
      au.fail = true;
      au.disableSave = true;
    });
  }

  function checkIntegrityError(constraints){
    constraints == 500 ? 
    swalert.errorAlert('Cannot delete this user. This user name is being use.') : swalert.errorAlert('Failed! retry again.');
  }
}]);

//angularjs debounce
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

app.factory('socket', function ($rootScope) {
var socket = io.connect('127.0.0.1:8000');
return {
    on: function (eventName, callback) {
        socket.on(eventName, function () {
            var args = arguments;
            $rootScope.$apply(function () {
                callback.apply(socket, args);
            });
        });
    },
    emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
                if (callback) {
                    callback.apply(socket, args);
                }
            });
        })
    }
};
});