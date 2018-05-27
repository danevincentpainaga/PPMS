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
  '$window', '$location', '$timeout', 'validateUserLogin',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, validateUserLogin) {

  var lg = this;
  lg.valid= true;
  lg.login =function(){
    if(!lg.email && !lg.password){
        console.log('unAuthenticated');
    }else{
      console.log(lg.email);
      console.log(lg.password);
      var credentials = {
        email: lg.email,
        password: lg.password
      }

      validateUserLogin.validateLogin(credentials)
        .then(function(response){
          console.log(response);
          $cookies.put('auth', response.data);
          $location.path('/dashboard');
      }, function(error){
        lg.valid = false; 
          $timeout(function(){
            lg.valid = true;
          },3000);
          console.log(error);
      });
    }
  }


}]);

//Services
app.factory('validateUserLogin', ['$http', '$cookies', function($http, $cookies){
  return{
    validateLogin: function(credData){
      return $http({
        method:'POST',
        url: baseUrl+'api/login',
        data: credData,
        headers: {
          Accept: "application/json",   
        }
      });
    },
    AuthenticatedUser: function(){
      var status = $cookies.get('auth');
        if(status){
          return true;
        }else{
          return false;
        }
    },
  }
}]);


