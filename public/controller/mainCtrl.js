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
        start: '2018-05-02',// moment().subtract(6, "hours"),
        end: '2018-05-02' //moment().subtract(6, "hours").add(30, "minutes")
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


'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:adduserCtrl
 * @description
 * # adduserCtrl
 * Controller of the mytodoApp
 */
var app = angular.module('myApp')
  app.controller('userCtrl',['$scope', '$rootScope', '$cookies', '$ngConfirm', '$window', '$location', '$timeout', 'apiService',
  function ($scope, $rootScope, $cookies, $ngConfirm, $window, $location, $timeout, apiService) {

  var au = this;
  au.response = false;
  au.isLoading = false;

  departments();
  usertypes();
  users();

  au.addUser = function(){

    if(!au.name || !au.email || !au.password || !au.password || !au.selectedUserType || !au.selectedDepartment){
      alert('Complete all the Required fields');
    }else{
      var userDetails = {
        name: au.name,
        email: au.email,
        password: au.password,
        usertypeId: au.selectedUserType.usertype_id,
        departmentId: au.selectedDepartment.department_id
      }
      addUserDetails(userDetails);
    }
  }

  au.deleteUser = function(user){
    if(user.usertype_id === 1){
      failedDialog();
    }
    else{
      var userId = user.id;
      confirmDialog(userId);    
    }
    
  }

  function departments(){
    apiService.getDepartments().then(function(response){
      console.log(response);
      au.departments = response.data;
    }, function(error){
      console.log(error);
    });
  }

  function usertypes(){
    apiService.getUserTypes().then(function(response){
      console.log(response);
      au.userTypes = response.data;
    }, function(error){
      console.log(error);
    });
  }

  function addUserDetails(userDetails){
    apiService.addUser(userDetails).then(function(response){
      console.log(response);
      au.message = 'Successfully Added!';
      au.response = true;
    }, function(error){
      console.log(error);
      au.message = 'failed! try again.';
      au.response = true;
    });
  }

  function users(){
    au.isLoading = true;
    apiService.getUsers().then(function(response){
      console.log(response);
      au.users = response.data;
      au.isLoading = false;
    }, function(error){
      console.log(error);
    });
  }

  function userToBeDeleted(userId){
    apiService.deleteUsers(userId).then(function(response){
      console.log(response);
    }, function(error){
      console.log(error);
    });
  }
  
  function confirmDialog(userId){
    $ngConfirm({
        title: '',
        content: 'Delete this user?',
        type: 'blue',
        typeAnimated: true,
          buttons: {
            Yes: {
              text: 'Yes',
              btnClass: 'btn-red',
              action: function(){
                userToBeDeleted(userId);
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

  function failedDialog(){
    $ngConfirm({
        title: 'Error!',
        content: 'Superadmin not Deletable!',
        type: 'red',
        typeAnimated: true,
          buttons: {
            OK: {
              text: 'Ok',
              btnClass: 'btn-red',
            }
          }
    });
  }
}]);

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


