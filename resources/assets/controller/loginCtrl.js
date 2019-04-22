'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:loginCtrl
 * @description
 * # loginCtrl
 * Controller of the mytodoApp
 */ 
var app = angular.module('myApp')
  app.controller('loginCtrl',['$scope', '$rootScope', '$cookies',
  '$window', '$location', '$timeout', 'apiService', 'swalert',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, apiService, swalert) {

  var lg = this;
  lg.valid= true;
  lg.buttonMessage = 'Sign In';
  lg.loginBtn = false;

  lg.login =function(){
    lg.loginBtn = true;
    if(!lg.email || !lg.password){
        console.log('unAuthenticated');
    }else{
      lg.buttonMessage = 'Signing In...';
      swalert.successInfo("<label class='green'>Checking Identity...</label>", 'info', );
      var credentials = {
        email: lg.email,
        password: lg.password
      }

      apiService.validateLogin(credentials)
        .then(function(response){
          console.log(response);
          $cookies.putObject('auth', response.data);
          $scope.$emit("Authenticated");
          $location.path('/dashboard');
          lg.loginBtn = false;
          
      }, function(error){
        swalert.successInfo("<label class='red'>Whoopss!...</label>", 'error', );
        lg.valid = false;
        lg.loginBtn = false;
        lg.buttonMessage = 'Sign In'; 
          $timeout(function(){
            lg.valid = true;
          }, 3000);
          console.log(error);
      });
    }
  }


}]);
