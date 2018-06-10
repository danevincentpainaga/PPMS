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
  var dataToEdit = null;
  var OldVenueId = null;
  // vc.venues = [];
  vc.minLength = 60;
  vc.minutes = [];
  vc.response = false;
  vc.Hidden = true;
  vc.eventMessage = 'Show calendar';
  vc.editing = false;

  getAllVenues();
  departments();
  getAllReservations('*');
  getApprovedReservations('*');

  for (var i = 0; i <= vc.minLength; i++) {
    if(i >= 10){
      vc.minutes.push(i.toString());
    }else{
      vc.minutes.push('0'+i);
    }
  }

  var events = [];
  var approvedEvents = [];
  
  vc.eventSources = [events];
  vc.eventSources2 = [approvedEvents];

  var pendingEventClick = function (calEvent,jsEvent,view){
    getAllReservationsDate(calEvent.start.format('YYYY-MM-DD'));
  }
  var approvedEventClick = function (calEvent,jsEvent,view){
    getApprovedReservationsDate(calEvent.start.format('YYYY-MM-DD'));
  }

    vc.uiConfig = {
      calendar:{
        height: 500,
        editable: true,
        header:{
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: function( date, allDay, jsEvent, view ) {
            var start=moment(date).format('YYYY-MM-DD');
            getAllReservationsDate(start);
            console.log(start);
        },
        eventClick: pendingEventClick
      }
    };

    vc.uiConfig2 = {
      calendar2:{
        height: 500,
        editable: true,
        header:{
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: function( date, allDay, jsEvent, view ) {
            var start=moment(date).format('YYYY-MM-DD');
            getApprovedReservationsDate(start);
        },
        eventClick: approvedEventClick
      }
    };

  vc.eMessage = function(){
    if(vc.Hidden){
      vc.Hidden = false;
      vc.eventMessage = 'Hide calendar';
    }else{
      vc.Hidden = true;
      vc.eventMessage = 'Show calendar';
    }
  }

  vc.addVenue = function(){
    if(vc.venue){
      var venueDetails =  { venue_name: vc.venue, user_id: $rootScope.userLoginId };
      apiService.addVenue(venueDetails).then(function(response){
        console.log(response.data[0]);
        vc.response = true;
        vc.message = 'Venue Added Successfully';
      }, function(error){
        vc.response = true;
        vc.message = 'failed! please try again.';
        console.log(error);
      });
    }
  }  

  vc.editVenue = function(venueData){
    vc.editing = true;
    vc.venue = venueData.venue_name;
    OldVenueId = venueData.venue_id;
    console.log(venueData);
  }

  vc.updateVenue = function(venueData){
    var updatedVenue = {
      venue_name: venueData,
      venue_id: OldVenueId
    }
    updateVenueDetails(updatedVenue);
  }

  vc.addReservation = function(){
    if(!vc.requester || !vc.selectedDepartment || !vc.selectedVenue || !vc.purpose 
        || !vc.starthour || !vc.startminutes || !vc.starttimezone || !vc.endhour || !vc.endminutes || !vc.endtimezone  
     ){
        alert('Complete all the Fields');
    }else{
      var reservationDetails = {
        requester_name: vc.requester,
        departmentId: vc.selectedDepartment.department_id,
        venueId: vc.selectedVenue.venue_id,
        purpose: vc.purpose,
        start_date: vc.start_date,
        start_time: convertTime12to24(vc.starthour+':'+vc.startminutes+':'+'00'+' '+vc.starttimezone),
        end_date: vc.end_date,
        end_time: convertTime12to24(vc.endhour+':'+vc.endminutes+':'+'00'+' '+vc.endtimezone),
      }
      reservation(reservationDetails);
    }
  }
  
  vc.updateReservationData = function(reserveData){
    dataToEdit = reserveData;
    vc.editing = true;
    vc.requester = reserveData.client_name;
    vc.selectedDepartment = reserveData.department_name;
    vc.selectedVenue = reserveData.department_name;
    vc.purpose  = reserveData.purpose;
    vc.start_date = reserveData.start_date;
    vc.end_date = reserveData.end_date;
  }

  vc.updateReservation = function(){
    if(!vc.requester || !vc.selectedDepartment || !vc.selectedVenue || !vc.purpose 
        || !vc.starthour || !vc.startminutes || !vc.starttimezone || !vc.endhour || !vc.endminutes || !vc.endtimezone  
     ){
        alert('Complete all the Fields');
    }else{

      var details = {
        client_id: dataToEdit.client_id,
        client_reservation_id: dataToEdit.client_reservation_id,
        requester_name: vc.requester,
        departmentId: vc.selectedDepartment.department_id,
        venueId: vc.selectedVenue.venue_id,
        purpose: vc.purpose,
        start_date: vc.start_date,
        start_time: convertTime12to24(vc.starthour+':'+vc.startminutes+':'+'00'+' '+vc.starttimezone),
        end_date: vc.end_date,
        end_time: convertTime12to24(vc.endhour+':'+vc.endminutes+':'+'00'+' '+vc.endtimezone),
      }
      updateDetails(details);
      console.log(details);
    }
  }

  vc.cancelEdit = function(){
    dataToEdit = null;
    vc.editing = false;
  }

  vc.approvedReservation = function(approvedReservationDetails){
    approvedReservation(approvedReservationDetails);
  }

  vc.close = function(){
      vc.venue = "";
      vc.response = false;
  }

  vc.deleteVenue = function(venue){
      confirmDialog(venue);
      console.log(venue);
  }
  
  vc.deleteReservation = function(reservation){
      // confirmDialog(reservation);
      console.log(reservation);
  }

  vc.showInput = function(){

  }

  function updateVenueDetails(venue){
    apiService.updateVenue(venue).then(function(response){
      console.log(response);
      $ngConfirm({
        title: 'Success' ,
        content: response.data.message,
        type: 'green',
        animationBounce: 1.5
      });
    }, function(error){
      console.log(error);
      $ngConfirm({
          title: error.data.message,
          content: '',
          type: 'blue',
          animationBounce: 1.5
      });
    });
  }

  function getAllReservationsDate(rDate){
    vc.isLoading = true;
    apiService.getReservations(rDate).then(function(response){
      vc.isLoading = false;
      vc.reservations = response.data;
    }, function(error){
      console.log(error);
    });
  }

  function getAllReservations(rDate){
    vc.isLoading = true;
    apiService.getReservations(rDate).then(function(response){
      console.log(response)
      angular.forEach(response.data, function(val, i){
        events.push({
          title: val.purpose,
          start: val.start_date+' '+val.start_time,
          end: val.end_date+' '+val.end_time,
          allDay : false
        });
      });
      vc.isLoading = false;
      vc.reservations = response.data;
    }, function(error){
      console.log(error);
    });
  }

  function approvedReservation(approvedDetails){
    apiService.approvedReservationsDetails(approvedDetails).then(function(response){
      console.log(response);
      $ngConfirm({
        title: 'Success' ,
        content: response.data.message,
        type: 'green',
        animationBounce: 1.5
      });
    }, function(error){
      console.log(error);
      $ngConfirm({
          title: error.data.message,
          content: '',
          type: 'blue',
          animationBounce: 1.5
      });
    });
  }

  function updateDetails(updatedData){
    apiService.updateReservation(updatedData).then(function(response){
      console.log(response);
      $ngConfirm({
        title: 'Success' ,
        content: response.data.message,
        type: 'green',
        animationBounce: 1.5
      });
    }, function(error){
      console.log(error);
      $ngConfirm({
          title: error.data.message,
          content: '',
          type: 'blue',
          animationBounce: 1.5
      });
    });
  }

  function getApprovedReservationsDate(aDate){
    vc.isLoading = true;
    apiService.approvedReservations(aDate).then(function(response){
      vc.isLoading = false;
      vc.approvedReservationsData = response.data;
      console.log(response);
    }, function(error){
      console.log(error);
    });
  }

  function getApprovedReservations(aDate){
    vc.isLoading = true;
    apiService.approvedReservations(aDate).then(function(response){
      console.log(response)
      angular.forEach(response.data, function(val, i){
        approvedEvents.push({
          title: val.purpose,
          start: val.start_date+' '+val.start_time,
          end: val.end_date+' '+val.end_time,
          allDay : false
        });
      });
      vc.isLoading = false;
      vc.approvedReservationsData = response.data;
    }, function(error){
      console.log(error);
    });
  }

  function getAllVenues(){
    vc.isLoading = true;
    apiService.getVenues().then(function(response){
      console.log(response.data);
      vc.isLoading = false;
      vc.venues = response.data;
      // angular.forEach(response.data, function(val, i){
      //   vc.venues.push(val);
      // });
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
      vc.message = 'Reservation Sent';
      vc.response = true;
    }, function(error){
      console.log(error);
    });
  }

  function convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return hours + ':' + minutes+':'+'00';
  }

}]);


