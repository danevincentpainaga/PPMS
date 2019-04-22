'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:viewVenueCtrl
 * @description
 * # viewVenueCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller('viewVenueCtrl',['$scope', '$rootScope', '$cookies',
  '$window', '$location', '$timeout', 'apiService',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, apiService) {

  var v = this;

  // Display View Details from Request
  $scope.$on('get_selected_reservation', function(val, obj){
    v.viewReservation = obj;
  });

}]);

app.filter('fullDate', function(){
	return function(stringDate){
  	var month = new Array();
    month[0] = "January"; month[1] = "February"; month[2] = "March"; 
    month[3] = "April";month[4] = "May"; month[5] = "June"; month[6] = "July";
    month[7] = "August"; month[8] = "September"; month[9] = "October";
    month[10] = "November"; month[11] = "December";
		var date = new Date(stringDate);
		return month[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear();
	}
});