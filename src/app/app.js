angular
.module('psmsApp', [
  'ngCookies',
  'ngResource',
  'ui.router',
  'ui.router.state.events',
  'ngSanitize',
  'ngTouch',
  'ngMaterial',
  'md.data.table'
])
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('base', {
      url: '/',
      templateUrl: 'src/views/login.html',
      controller: 'loginCtrl',
      controllerAs: 'lg',
      Authenticated: false,
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'src/views/dashboard.html',
      Authenticated: true,
    })
    .state('undergraduate', {
      url: '/undergraduate',
      views:{
        '':{
          templateUrl: 'src/views/undergraduate.html',
        },
        'undergraduate-view@undergraduate':{
          templateUrl: 'src/views/undergraduate_list.html',
        }
      },
      Authenticated: true,
    })
    .state('masteral_doctorate', {
      url: '/masteral_doctorate',
      views:{
        '':{
          templateUrl: 'src/views/masteral_doctorate.html',
        },
        'masteral_doctorate-view@masteral_doctorate':{
          templateUrl: 'src/views/masteral_doctorate_list.html',
        }
      },
      Authenticated: true,
    })
    .state('undergraduate.add_undergraduate_scholars', {
      url: '/add_undergraduate_scholars',
      views:{
        '':{
          templateUrl: 'src/views/undergraduate.html',
        },
        'undergraduate-view@undergraduate':{
          templateUrl: 'src/views/add_undergraduate_scholars.html',
        }
      },
      Authenticated: true,
    })
    .state('masteral_doctorate.add_masteral_doctorate_scholars', {
      url: '/add_masteral_doctorate_scholars',
      views:{
        '':{
          templateUrl: 'src/views/masteral_doctorate.html',
        },
        'masteral_doctorate-view@masteral_doctorate':{
          templateUrl: 'src/views/add_masteral_doctorate_scholars.html',
        }
      },
      Authenticated: true,
    })
    .state('address', {
      url: '/address',
      views:{
        '':{
          templateUrl: 'src/views/address.html',
        },
        'address-view@address':{
          templateUrl: 'src/views/address_list.html',
        }
      },
      Authenticated: true,
    })


  $urlRouterProvider.otherwise('/');

})
.run(['$transitions', '$rootScope', '$cookies', 'loginApiService', function($transitions, $rootScope, $cookies, loginApiService){

  var auth = $cookies.getObject('auth');

  $transitions.onStart({}, function(transition) {

    var $state = transition.router.stateService;
    var auth = $cookies.getObject('auth');
    

    if (transition.to().Authenticated) {
        if (!loginApiService.AuthenticatedUser()) {
            $rootScope.logged_in = false;
            $state.go('base');
        }
        else{
          $rootScope.logged_in = true;
        }
    }

    if (!transition.to().Authenticated) {
       if (loginApiService.AuthenticatedUser()) {
          transition.abort();
       }
    }    

  });

  // $transitions.onStart({ to: 'dashboard'}, function(transition) {

  //   const $state = transition.router.stateService;
    
  //   if (!auth) $state.go('base');

  // });

}]);



require('angular-material');
require('angular-animate');
require('angular-aria');

require('../services/loginApiService.js');

require('../controllers/mainCtrl.js');
require('../controllers/loginCtrl.js');
