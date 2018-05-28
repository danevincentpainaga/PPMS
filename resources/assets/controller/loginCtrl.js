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
  '$window', '$location', '$timeout', 'apiService',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, apiService) {

  var lg = this;
  lg.valid= true;
  lg.buttonMessage = 'Submit';

  lg.login =function(){
    if(!lg.email || !lg.password){
        console.log('unAuthenticated');
    }else{
      lg.buttonMessage = 'Logging In...';
      var credentials = {
        email: lg.email,
        password: lg.password
      }

      apiService.validateLogin(credentials)
        .then(function(response){
          console.log(response);
          $cookies.putObject('auth', response.data);
          console.log($cookies.getObject('auth'));
          $location.path('/dashboard');
      }, function(error){
        lg.valid = false;
        lg.buttonMessage = 'Submit'; 
          $timeout(function(){
            lg.valid = true;
          },3000);
          console.log(error);
      });
    }
  }


}]);
