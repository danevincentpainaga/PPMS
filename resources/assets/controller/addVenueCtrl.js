'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:addVenueCtrl
 * @description
 * # addVenueCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller('addVenueCtrl',
      ['$scope', '$rootScope', '$location', '$http', '$ngConfirm','$filter', '$timeout', 'apiService', 'debounce',
        function ($scope, $rootScope, $location, $http, $ngConfirm, $filter, $timeout, apiService, debounce) {

  var ad = this;

  $scope.$watch('ad.venue', debounce(function() {
     if(!ad.venue){
        ad.passedOrFail = null;
        ad.success = false;
        ad.fail = false;
        ad.disableSave = true;
     }
     else
     {
        validateVenueIfExist(ad.venue);
     }
  },500), true);

  ad.addVenueDetails = function(){
    if(ad.venue){
      var venueDetails =  { venue_name: ad.venue, user_id: $rootScope.userLoginId };
      apiService.addVenue(venueDetails).then(function(response){
        console.log(response.data[0]);
        ad.response = true;
        ad.message = 'Venue Added Successfully';
        $scope.$emit("reload_venue_list");
      }, function(error){
        ad.response = true;
        ad.message = 'failed! please try again.';
        console.log(error);
      });
    }
  }  

  ad.close = function(){
      ad.venue = "";
      ad.response = false;
  }

  function validateVenueIfExist(deptName){
    apiService.validateVenue(deptName).then(function(response){
      ad.passedOrFail = true;
      ad.fail = false;
      ad.success = true;
      ad.disableSave = false;
    }, function(error){
      console.log(error);
      ad.passedOrFail = false;
      ad.success = false;
      ad.fail = true;
      ad.disableSave = true;
    });
  }


}]);

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