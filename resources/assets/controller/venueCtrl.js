'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:venueCtrl
 * @description
 * # venueCtrl
 * Controller of the PPMS
 */

var app = angular.module('myApp')
app.controller('venueCtrl', ['$scope', '$rootScope', '$location', '$http', '$ngConfirm',
                             '$filter', '$timeout', '$cookies', 'apiService', 'swalert',
    function ($scope, $rootScope, $location, $http, $ngConfirm, $filter, $timeout, $cookies, apiService, swalert) {
  
  var vc = this;
  var dataToEdit = null;
  var OldVenueId = null;
  vc.minLength = 60;
  vc.minutes = [];
  vc.response = false;
  vc.Hidden = true;
  vc.editing = false;
  vc.eventMessage = 'Show calendar';
  var events = [];
  vc.eventSources = [events];

  getAllVenues();
  departments();
  getAllReservations('*');

  $scope.$on('reloading_venue_list', function(){
    getAllVenues();
  });

  $scope.$on('updateAddedReservation', function(val, obj){
    getAllReservations('*');
  });

  vc.uiConfig = {
    calendar:{
      height: 475,
      editable: true,
      eventLimit: 2,
      header:{
        left: 'month agendaWeek agendaDay',
        center: 'title',
        right: 'today prev,next'
      },
      dayClick: function( date, allDay, jsEvent, view ) {
          var start=moment(date).format('YYYY-MM-DD');
          if(vc.selectedvenueList != undefined){
            getAllReservationsDate(start, vc.selectedvenueList.venue_id);
          }
          else{
            getAllReservationsDate(start);
          }
          console.log(start);
      },
      eventClick: pendingEventClick
    }
  };

  for (var i = 0; i <= vc.minLength; i++) {
    if(i >= 10){
      vc.minutes.push(i.toString());
    }else{
      vc.minutes.push('0'+i);
    }
  }

  var pendingEventClick = function (calEvent,jsEvent,view){
    if(vc.selectedvenueList != undefined){
      getAllReservationsDate(calEvent.start.format('YYYY-MM-DD'), vc.selectedvenueList.venue_id);
    }
    else{
      getAllReservationsDate(calEvent.start.format('YYYY-MM-DD'));
    }
  }

  vc.eMessage = function(){
    if(vc.Hidden){
      vc.Hidden = false;
      vc.eventMessage = 'Hide calendar';
    }else{
      vc.Hidden = true;
      vc.eventMessage = 'Show calendar';
    }
  }

  vc.editVenue = function(venueData){
    vc.selected_venue = angular.copy(venueData);
    vc.editing = true;
    vc.disableDeleteBtn = true;
    vc.venue = venueData;
    OldVenueId = venueData.venue_id;
  }

  vc.updateVenue = function(venueData){
    var updatedVenue = {
      venue_name: venueData,
      venue_id: OldVenueId
    }
    vc.updating = true;
    updateVenueDetails(updatedVenue);
  }

  vc.deleteVenue = function(venue){
      swalert.showAlert(venue, deleteVenue);
      console.log(venue);
  }
  
  vc.updateReservationData = function(reserveData){
    dataToEdit = reserveData;
    vc.editing = true;
    vc.requester = reserveData.client_name;
    vc.selectedDepartment = reserveData.department_name;
    vc.purpose  = reserveData.purpose;
    vc.start_date = reserveData.start_date;
    vc.end_date = reserveData.end_date;
    vc.starthour = tConvHour(reserveData.start_time);
    vc.startminutes = tConvHour(reserveData.start_time);
    vc.endhour = tConvHour(reserveData.end_time);
    vc.endminutes = tConvHour(reserveData.end_time);
    angular.forEach(vc.venues, function(val, i){
      if(val.venue_id == reserveData.venueId){
        vc.selectedVenue = val;
      }
    });
    angular.forEach(vc.departments, function(val, i){
      if(val.department_id == reserveData.departmentId){
        vc.selectedDepartment = val;
      }
    });
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
    }
  }

  vc.cancelEdit = function(){
    dataToEdit = null;
    vc.editing = false;
    vc.disableDeleteBtn = false;
    if (vc.selected_venue.venue_name  != vc.venue.venue_name)
            vc.venue.venue_name = vc.selected_venue.venue_name; 
  }

  vc.viewDetails = function(selectedReservation){
    var viewReservation = selectedReservation;
    $scope.$emit('selected_reservation', viewReservation );
  }

  vc.showInput = function(){

  }

  vc.selectedVenueId = function(){
    if(vc.selectedvenueList != undefined){
      getAllReservations('*', vc.selectedvenueList.venue_id);
    }
    else{
      getAllReservations('*');
    }
  }

  function updateVenueDetails(venue){
    apiService.updateVenue(venue).then(function(response){
      vc.editing = false;
      vc.updating = false;
      swalert.successInfo(response.data.message, 'success', 3000);
    }, function(error){
      swalert.errorAlert(error.data.message);
    });
  }

  function getAllReservationsDate(rDate, venueid = ""){
    vc.isLoading = true;
    apiService.getReservations(rDate, $cookies.getObject('auth').departmentId, venueid).then(function(response){
      vc.isLoading = false;
      vc.reservations = response.data;
      console.log(response.data)
    }, function(error){
      console.log(error);
    });
  }

  function getAllReservations(rDate, venueid = ""){
    vc.isLoading = true;
    apiService.getReservations(rDate, $cookies.getObject('auth').departmentId, venueid).then(function(response){
      events.length = 0;
      angular.forEach(response.data, function(val, i){
        events.push({
          title: val.purpose,
          start: val.start_date+' '+val.start_time,
          end: val.end_date+' '+val.end_time,
          allDay : false
        });
      });
      vc.isLoading = false;
      console.log(response.data);
      vc.reservations = response.data;
    }, function(error){
      console.log(error);
    });
  }

  function removeReservationData(reservationObj){
      apiService.removeReservation(reservationObj).then(function(response){
        console.log(response);
      vc.reservations.splice(vc.reservations.indexOf(reservationObj), 1);
      swalert.successAlert(response.data.message);
    }, function(error){
      console.log(error);
    });
  }

  function updateDetails(updatedData){
    apiService.updateReservation(updatedData).then(function(response){
      console.log(response);
      getAllReservations('*');
      swalert.successAlert(response.data.message);
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

  function getAllVenues(){
    vc.isLoading = true;
    apiService.getVenues().then(function(response){
      $timeout(function() {
        vc.isLoading = false;
      }, 300);
      vc.venues = response.data;
      vc.venueList = response.data;
      $scope.$emit('venueData', vc.venues);
    }, function(error){
      console.log(error);
    });
  }

  function deleteVenue(venue){
    apiService.deleteVenue(venue.venue_id).then(function(response){
      vc.venues.splice(vc.venues.indexOf(venue), 1);
      swalert.successAlert('Venue deleted');$ngC
    }, function(error){
      console.log(error);
      checkIntegrityError(error.status);
    })
  }

  function departments(){
    apiService.getDepartments().then(function(response){
      vc.departments = response.data;
      $scope.$emit('departmentsData', vc.departments);
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

  function tConvHour(time24) {
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h = (H % 12) || 12;
    h = (h < 10)?("0"+h):h;
    return h;
  };

  function tConvMin(time24) {
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h = (H % 12) || 12;
    h = (h < 10)?("0"+h):h;  
    return ts.substr(3, 2);
  };

  function checkIntegrityError(constraints){
    constraints == 500 ? 
    swalert.errorAlert('Cannot delete or update parent row. This Venue name is being use.') : swalert.errorAlert('Failed! retry again.');
  }
  
}]);


app.filter('fullDate', function(){
  return function(stringDate){
      var month = new Array();

      month[0] = "January"; month[1] = "February"; month[2] = "March"; 
      month[3] = "April";month[4] = "May"; month[5] = "June"; month[6] = "July";
      month[7] = "August"; month[8] = "September"; month[9] = "October";
      month[10] = "November"; month[11] = "December";

    var date = new Date(stringDate);
    return month[date.getMonth()+1]+' '+date.getDate()+', '+date.getFullYear();
  }
});

app.filter('timeFormat', function(){
  return function(stringDate){
        function tConv24(time24) {
          if(time24){
            var ts = time24;
            var H = +ts.substr(0, 2);
            var h = (H % 12) || 12;
            h = (h < 10)?("0"+h):h;
            var ampm = H < 12 ? " AM" : " PM";
            ts = h + ts.substr(2, 3) + ampm;
            return ts;
          }
        };

      return tConv24(stringDate);
  }
});