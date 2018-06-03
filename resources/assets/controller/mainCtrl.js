'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:myCtrl
 * @description
 * # myCtrl
 * Controller of the mytodoApp
 */

var app = angular.module('myApp')
app.controller('mainCtrl',['$scope', '$rootScope', '$location', '$http', '$ngConfirm','$filter', '$timeout', '$cookies', 'apiService',
  function ($scope, $rootScope, $location, $http, $ngConfirm, $filter, $timeout, $cookies, apiService) {
  
  $scope.selected = 1;
  // var events = [];
        //   title: "Yehey Test",
        // start: '2018-05-02 08:00:00',// moment().subtract(6, "hours"),
        // end: '2018-05-02' //moment().subtract(6, "hours").add(30, "minutes")
  
  // $scope.eventSources = [events];

  //   $scope.uiConfig = {
  //     calendar:{
  //       height: 500,
  //       editable: true,
  //       header:{
  //         left: 'month agendaWeek agendaDay ',
  //         center: 'title',
  //         right: 'today prev,next'
  //       },
  //       dayClick: function( date, allDay, jsEvent, view ) {
  //           var start=moment(date).format('YYYY-MM-DD hh:mm');
  //           console.log(start);
  //       },
  //       eventClick: function (event) {
  //           console.log(event);
  //       }
  //     }
  //   };


  $scope.redirectTo = function(location){
    $location.path(location);
  }

  $scope.isActivated = function(destination){
    return destination == $location.path();
  }

  $scope.selectedTown = function(selected){
    $scope.selected = selected;
  }

  $scope.isSelected = function(selectedId){
    return $scope.selected === selectedId;
  }

  $scope.logout= function(){
    $cookies.remove('auth');
    $rootScope.header = false;
    $location.path('/');
  }

  // apiService.getReservations().then(function(response){
  //   angular.forEach(response.data, function(val, i){
  //     console.log(val);
  //     events.push({
  //       title: val.purpose,
  //       start: val.reservation_date,
  //       end: val.reservation_date,
  //       allDay : false
  //     })
  //   });
  // }, function(error){
  //   console.log(error);
  // });

}]);

app.directive('navHeight',['$window', function($window){
    return {
      restrict: 'A',
      scope: true,
      link: function(scope, elem, attrs) {
        var wh = angular.element($window);
        var h = wh.height();

        elem.css({'min-height': h+'px', 'max-height': h+'px'});
        wh.bind('resize', function(){
          elem.css({'min-height': h+'px', 'max-height': h+'px'});
          console.log(" Window resized! " + h);
        });
      }
    };
 }]);

