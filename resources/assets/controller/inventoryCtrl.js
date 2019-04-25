'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:inventoryCtrl
 * @description
 * # inventoryCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller( 'inventoryCtrl',['$scope', '$rootScope', '$cookies', 
                  '$window', '$location', '$timeout', 'apiService', 'swalert',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, apiService, swalert) {

  var is = this;
  is.isLoading = true;
  var d = new Date();

  $scope.$on('refreshStockTable', function(){
    getAllItems();
  });

  getAllItems();

  is.addItems = function(input = {}){
    if (Object.keys(input).length == 3) {
      swalert.saveAlert(input, addStocks);
    }
  }

  is.deductQty = function(itemDetails){
  	console.log(itemDetails);
  	$scope.$emit('emittedItem', itemDetails);
  }

  is.addQty = function(item){
    $scope.$emit('emittedItem', item);  
  }

  is.updateItem = function(selectedItem){
    is.addBtn = true;
    is.quantity = true;
    $timeout(function(){
      is.updateBtn = true;
      is.cancelBtn = true;
      is.items = selectedItem;//.item_name = selectedItem.item_name;
    }, 300);
  }

  is.updateStocks = function(updatedItem){
    swalert.updateAlert(updatedItem, updateItems);
  }

  is.cancelButton = function(){
    is.items = {};
    is.updateBtn = false;
    is.cancelBtn = false;
    is.quantity = false;
    $timeout(function(){
      is.addBtn = false;
    }, 300);    
  }

  function addStocks(stockDetails){
    var updatedItemDetails = {
      "stock_id": stockDetails.stock_id,
      "item_name": stockDetails.item_name,
      "description": stockDetails.description,
      "qty": stockDetails.qty,
      "date_updated": d.toISOString().split('T')[0]
     }
  	apiService.addStock(updatedItemDetails).then(function(response){
  		getAllItems();
      swalert.successAlert(response.data.message);
  		is.items = {};
    }, function(error){
      console.log(error);
      swalert.errorAlert("Try again");
    });
  }

  function updateItems(itemDetails) {
    apiService.updateStocks(itemDetails).then(function(response){
      swalert.successAlert("Item Succesfully Updated");
    }, function(error){
      console.log(error);
    });
  }

  function getAllItems(){
  	apiService.getAllStocks().then(function(response){
  		console.log(response);
  		is.itemDetails = response.data;
      is.isLoading = false;
  	}, function(error){
        console.log(error);
    });
  }

}]);
