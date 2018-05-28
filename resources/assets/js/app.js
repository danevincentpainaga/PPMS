
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
      views:{
        '':{
          templateUrl: 'views/users.html',
          controller: 'mainCtrl',
        },
        'users-view@manage_users':{
          templateUrl: 'views/add_user.html',
          controller: 'userCtrl',
        }
      }
    })
    .state('manage_users.users_list', {
      url: '/users_list',
      views:{
        'users-view@manage_users':{
         templateUrl: 'views/users_list.html',
          controller: 'userCtrl',
        }
      }
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
          controller: 'venueCtrl',
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
.run(['$transitions', '$rootScope', 'apiService', '$cookies', function($transitions, $rootScope, apiService, $cookies) {
  $transitions.onStart({}, function(transitions) {
    console.log($cookies.getObject('auth'));
    var auth = $cookies.getObject('auth');
    var $state = transitions.router.stateService;
    
    if(!apiService.AuthenticatedUser()){
      $state.go('/');
    }else{
      if(transitions.to().name === '/'){
        $state.go('dashboard');
        $rootScope.header = false;  
      }else{
        $rootScope.header = true;
        $rootScope.userLoginId = auth.user_id;
        $rootScope.token = $cookies.getObject('auth').success.token;
        $rootScope.userLogName = $cookies.getObject('auth').name;
      }
    }
  });
  $transitions.onSuccess({}, function(transitions) {
  });
}]);