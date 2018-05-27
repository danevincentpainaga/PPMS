
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
  '720kb.datepicker'
])
.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('/', {
      url: '/',
      templateUrl: 'views/login.html',
      controller: 'loginCtrl',
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'views/dashboard.html',
      controller: 'mainCtrl',
    })
    .state('manage_users', {
      url: '/manage_users',
      templateUrl: 'views/users.html',
      controller: 'mainCtrl',
    })
    .state('reservation', {
      url: '/reservation',
      views:{
        '':{
          templateUrl: 'views/reservation.html',
          controller: 'mainCtrl',
        },
        'new-view@reservation':{
          templateUrl: 'views/request.html',
          controller: 'mainCtrl',
        }
      }
    })
    .state('reservation.venues', {
      url: '/venues',
      views:{
        'new-view@reservation':{
         templateUrl: 'views/venues.html',
          // controller: 'mainCtrl',
        }
      }
    })
    .state('reservation.approved', {
      url: '/approved',
      views:{
        'new-view@reservation':{
          templateUrl: 'views/approved_reservation.html',
          controller: 'mainCtrl',
        }
      }
    })
    .state('maintenance', {
      url: '/maintenance',
      templateUrl: 'views/maintenance.html',
      controller: 'mainCtrl',
    })
    $urlRouterProvider.otherwise('/');
})
.run(['$transitions', '$rootScope', 'validateUserLogin', function($transitions, $rootScope, validateUserLogin) {
  $transitions.onStart({}, function(transitions) {
    var cookies = false;
    var $state = transitions.router.stateService;
    console.log($state);
    if(!validateUserLogin.AuthenticatedUser()){
      $state.go('/');
    }else{
      if(transitions.to().name === '/'){
        $state.go('dashboard')
        $rootScope.header = false;  
      }else{
        $rootScope.header = true;
      }
    }
  });
  $transitions.onSuccess({}, function(transitions) {
  });
}]);