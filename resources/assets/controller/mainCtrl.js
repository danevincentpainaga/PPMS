'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:myCtrl
 * @description
 * # myCtrl
 * Controller of the mytodoApp
 */

var app = angular.module('myApp')
app.controller('mainCtrl',['$scope', '$rootScope', '$location', '$http', '$ngConfirm','$filter', '$timeout', '$cookies',
  function ($scope, $rootScope, $location, $http, $ngConfirm, $filter, $timeout, $cookies) {
  $scope.selected = 1;
    var events = [
      {
        title: "Yehey Test",
        start: '2018-05-02',// moment().subtract(6, "hours"),
        end: '2018-05-02' //moment().subtract(6, "hours").add(30, "minutes")
      },
      {
        title: "Yehey Test",
        start: '2018-05-02',
        end: '2018-05-02'
      }
    ];

  $scope.eventSources = [events];

    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: function( date, allDay, jsEvent, view ) {
            var start=moment(date).format('YYYY-MM-DD');
            console.log(start);
        },
        eventClick: function (event) {
            console.log(event);
        }
      }
    };



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

