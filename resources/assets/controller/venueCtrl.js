'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:venueCtrl
 * @description
 * # venueCtrl
 * Controller of the mytodoApp
 */

var app = angular.module('myApp')
app.controller('venueCtrl',['$scope', '$rootScope', '$location', '$http', '$ngConfirm','$filter', '$timeout', 'apiService',
 function ($scope, $rootScope, $location, $http, $ngConfirm, $filter, $timeout, apiService) {
  
  var vc = this;
  vc.response = false;
  getAllVenues();
  departments();
  getAllReservations();

  vc.addVenue = function(){
    if(vc.venue){
      var venueDetails =  { venue_name: vc.venue, user_id: $rootScope.userLoginId };
      apiService.addVenue(venueDetails).then(function(response){
        console.log(response);
        vc.response = true;
        vc.message = 'Venue Added Successfully';
      }, function(error){
        vc.response = true;
        vc.message = 'failed! please try again.';
        console.log(error);
      });
    }
  }  

  vc.addReservation = function(){
    if(!vc.requester || !vc.selectedDepartment || !vc.selectedVenue || !vc.purpose ){
        alert('Complete all the Fields');
    }else{
      var reservationDetails = {
        requester_name: vc.requester,
        departmentId: vc.selectedDepartment.department_id,
        venueId: vc.selectedVenue.venue_id,
        purpose: vc.purpose,
        reservationDate: vc.reservation_date,
      }
      reservation(reservationDetails);
    }
  }

  vc.close = function(){
      vc.venue = "";
      vc.response = false;
  }

  vc.deleteVenue = function(venue){
      confirmDialog(venue);
      console.log(venue);
  }

  function getAllVenues(){
    vc.isLoading = true;
    apiService.getVenues().then(function(response){
      console.log(response.data);
      vc.isLoading = false;
      vc.venues = response.data;
    }, function(error){
      console.log(error);
    });
  }

  function confirmDialog(venue){
    $ngConfirm({
        title: '',
        content: 'Delete this venue?',
        type: 'blue',
        typeAnimated: true,
          buttons: {
            Yes: {
              text: 'Yes',
              btnClass: 'btn-red',
              action: function(){
                deleteVenue(venue);
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

  function deleteVenue(venue){
    apiService.deleteVenue(venue.venue_id).then(function(response){
      vc.venues.splice(vc.venues.indexOf(venue), 1);
    }, function(error){
      console.log(error);
    })
  }

  function departments(){
    apiService.getDepartments().then(function(response){
      console.log(response);
      vc.departments = response.data;
    }, function(error){
      console.log(error);
    });
  }

  function reservation(reservationDetails){
    apiService.addReservation(reservationDetails).then(function(response){
      console.log(response)
    }, function(error){
      console.log(error);
    });
  }

  function getAllReservations(){
    apiService.getReservations().then(function(response){
      console.log(response)
      vc.reservations = response.data;
    }, function(error){
      console.log(error);
    });
  }
}]);


