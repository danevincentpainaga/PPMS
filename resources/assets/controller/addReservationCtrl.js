'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:addReservationCtrl
 * @description
 * # addReservationCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller('addReservationCtrl',
      ['$scope', '$rootScope', '$location', '$http', '$ngConfirm','$filter','$cookies', '$timeout', 'apiService',
        function ($scope, $rootScope, $location, $http, $ngConfirm, $filter, $cookies, $timeout, apiService) {

  var ar = this;
  var d = new Date();
  ar.minLength = 60;
  ar.minutes = [];
  ar.endtimezone="PM";
  ar.starttimezone="PM";

  $scope.$on('departmentDetails', function(val, obj){
    ar.departments = obj;
    console.log(obj);
    angular.forEach(ar.departments, function(val, i){
      if(val.department_id == $cookies.getObject('auth').departmentId){
        ar.selectedDepartment = val;
      }
    });
  });

  $scope.$on('venueDetails', function(val, obj){
    ar.venues = obj;
  });

  for (var i = 0; i <= ar.minLength; i++) {
    if(i >= 10){
      ar.minutes.push(i.toString());
    }else{
      ar.minutes.push('0'+i);
    }
  }

  ar.addReservation = function(){
    if(!ar.requester || !ar.selectedDepartment || !ar.selectedVenue || !ar.purpose 
        || !ar.starthour || !ar.startminutes || ! ar.starttimezone || !ar.endhour || !ar.endminutes || !ar.endtimezone  
     ){
        // $ngConfirm('Complete all the Fields');
    }else{
      var reservationDetails = {
        requester_name: ar.requester,
        departmentId: ar.selectedDepartment.department_id,
        venueId: ar.selectedVenue.venue_id,
        purpose: ar.purpose,
        start_date: ar.start_date,
        start_time: convertTime12to24(ar.starthour+':'+ar.startminutes+':'+'00'+' '+ar.starttimezone),
        end_date: ar.end_date,
        end_time: convertTime12to24(ar.endhour+':'+ar.endminutes+':'+'00'+' '+ar.endtimezone),
        requested_date: d.toISOString().split('T')[0]
      }
      reservation(reservationDetails); 
    }
  }
  
  function reservation(reservationDetails){
    apiService.addReservation(reservationDetails).then(function(response){
      console.log(response)
      ar.selectedVenue = "";
      ar.requester = "";
      ar.start_date = "";
      ar.end_date = "";
      ar.startminutes="";
      ar.starthour = "";
      ar.starttimezone="PM";
      ar.endminutes="";
      ar.endhour = "";
      ar.endtimezone="PM";
      ar.purpose="";
      $scope.$emit('viewAddedReservation');
      $ngConfirm(response.data.message);
    }, function(error){
      console.log(error);
      $ngConfirm(error.data.message);
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
