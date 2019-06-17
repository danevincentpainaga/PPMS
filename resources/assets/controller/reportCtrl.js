'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:reportCtrl
 * @description
 * # reportCtrl
 * Controller of the PPMS
 */ 
var app = angular.module('myApp')
  app.controller('reportCtrl',['$scope', '$rootScope', '$cookies',
  '$window', '$location', '$timeout', 'apiService',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, apiService) {

  var rc = this;
  getStockByDate();
  getRequestedItemsPerDate();
  getRequestedWorksPerDate();

  rc.searchStocksBtn = function(){
    let filteredDate = {startdate: rc.startdate, enddate:rc.enddate};
    console.log(filteredDate);
    getStockByDate(filteredDate);
  }

  rc.searchItemsBtn = function(){
    if(!rc.filteredDate){
      getRequestedItemsPerDate();
    }
    else{
      getRequestedItemsPerDate(rc.filteredDate);      
    }
  }

  rc.searchWorksBtn = function(){
    if(!rc.filteredDate){
      getRequestedWorksPerDate();
    }
    else{
      getRequestedWorksPerDate(rc.filteredDate);      
    } 
  }

  rc.print = function(){
    $window.print();
  }

  function getStockByDate(date = null){
    apiService.getStocksPerDate(date).then(function(response){
      console.log(response);
      rc.stockDetails = response.data;
    }, function(error){
        console.log(error);
    });
  }

  function getRequestedItemsPerDate(date = null){
    apiService.getRequestedItemsPerDate(date).then(function(response){
      console.log(response);
      rc.requestedItems = response.data;
    }, function(error){
        console.log(error);
    });
  }

  function getRequestedWorksPerDate(date = null){
    apiService.getRequestedWorksPerDate(date).then(function(response){
      console.log(response);
      rc.list_of_work = response.data;
    }, function(error){
        console.log(error);
    });
  }

}]);
