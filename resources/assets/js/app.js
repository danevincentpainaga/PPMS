
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
import '@uirouter/angularjs/lib/legacy/stateEvents.js'
require('./bootstrap');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

angular
.module('myApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ui.router',
  'ui.router.state.events',
  'ngSanitize',
  'ngTouch',
  'cp.ngConfirm',
  '720kb.datepicker',
  'ui.calendar'
])
.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('/', {
      url: '/',
      templateUrl: 'views/login.html',
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'views/dashboard.html',
    })
    .state('manage_users', {
      url: '/manage_users',
      views:{
        '':{
          templateUrl: 'views/users.html',
        },
        'users-view@manage_users':{
          templateUrl: 'views/add_user.html',
        }
      }
    })
    .state('manage_users.users_list', {
      url: '/users_list',
      views:{
        'users-view@manage_users':{
         templateUrl: 'views/users_list.html',
        }
      }
    })
    .state('reservation', {
      url: '/reservation',
      views:{
        '':{
          templateUrl: 'views/reservation.html',
        },
        'new-view@reservation':{
          templateUrl: 'views/request.html',
        }
      }
    })
    .state('reservation.venues', {
      url: '/venues',
      views:{
        'new-view@reservation':{
         templateUrl: 'views/venues.html',
        }
      }
    })
    .state('reservation.approved', {
      url: '/approved',
      views:{
        'new-view@reservation':{
          templateUrl: 'views/approved_reservation.html',
        }
      }
    })
    .state('department', {
      url: '/department',
      templateUrl: 'views/department.html',
    })
    .state('inventory', {
      url: '/inventory',
      templateUrl: 'views/inventory.html',
    })
    .state('maintenance', {
      url: '/maintenance',
      views:{
        '':{
          templateUrl: 'views/maintenance.html',
        },
        'maintenance-view@maintenance':{
          templateUrl: 'views/request_items.html',
        }
      }
    })
    .state('maintenance.work', {
      url: '/work',
      views:{
        'maintenance-view@maintenance':{
          templateUrl: 'views/request_work.html',
          // controller: 'mainAppCtrl',
        }
      }
    })
    .state('report', {
      url: '/report',
      templateUrl: 'views/report.html',
      // controller: 'departmentCtrl',
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'views/editProfile.html',
      // controller: 'departmentCtrl',
    })
    $urlRouterProvider.otherwise('/');
})
.run(['$transitions', '$rootScope', 'apiService', '$cookies', function($transitions, $rootScope, apiService, $cookies) {
  $transitions.onStart({}, function(transitions) {
    var auth = $cookies.getObject('auth');
    console.log(auth);
    var $state = transitions.router.stateService;
    $rootScope.loginPage = true;
    if(!apiService.AuthenticatedUser()){
      $state.go('/');
    }else{
      if(transitions.to().name === '/'){
          $state.go('dashboard');
      }
      else{
        if (auth.userType === 3) {
          if(
              transitions.to().name === 'manage_users' || 
              transitions.to().name === 'manage_users.users_list' ||
              transitions.to().name === 'reservation.venues' ||
              transitions.to().name === 'department' ||
              transitions.to().name === 'inventory' ||
              transitions.to().name === 'report'
            ){

            $state.go('dashboard');
          }
          else{
            $rootScope.superAdmin = false;
            $rootScope.enableVenueAdding = false;
            $rootScope.enableApproveVenue = false;
            $rootScope.admin = false;
            $rootScope.user = true;
            $rootScope.loginPage = false;
            $rootScope.header = true;
            $rootScope.disableDepartment = true;
            $rootScope.disableRemarks = true;
            $rootScope.userLoginId = auth.user_id;
            $rootScope.token = auth.success.token;
            $rootScope.userLogName = auth.name;
          }
        }
        if (auth.userType === 2) {
          if(transitions.to().name === 'manage_users'){
            $state.go('dashboard');
          }
          else if(transitions.to().name === 'manage_users.users_list'){
            $state.go('dashboard');
          }
          else{
            $rootScope.superAdmin = false;
            $rootScope.enableVenueAdding = true;
            $rootScope.enableApproveVenue = true;
            $rootScope.admin = true;
            $rootScope.user = true;
            $rootScope.loginPage = false;
            $rootScope.header = true;
            $rootScope.disableDepartment = false;
            $rootScope.disableRemarks = false;
            $rootScope.userLoginId = auth.user_id;
            $rootScope.token = auth.success.token;
            $rootScope.userLogName = auth.name;
          }
        }
        if (auth.userType === 1) {
          if(transitions.to() === 'manage_users'){
            $state.go('dashboard');
          }else{
            $rootScope.superAdmin = true;
            $rootScope.enableVenueAdding = true;
            $rootScope.enableApproveVenue = true;
            $rootScope.admin = true;
            $rootScope.user = true;
            $rootScope.loginPage = false;
            $rootScope.header = true;
            $rootScope.disableRemarks = false;
            $rootScope.disableDepartment = false;
            $rootScope.userLoginId = auth.user_id;
            $rootScope.token = auth.success.token;
            $rootScope.userLogName = auth.name;
          }
        }
      }
    }
  });

  $transitions.onSuccess({}, function(transitions) {
      if(transitions.to().name === '/'){
        $rootScope.header = false;  
      }
  });
}]);