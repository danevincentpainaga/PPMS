'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:addItemsToWorkCtrl
 * @description
 * # addItemsToWorkCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller( 'addItemsToWorkCtrl',['$scope', '$rootScope', '$cookies', '$ngConfirm',
                  '$window', '$location', '$timeout', 'apiService', 'swalert',
  function ($scope, $rootScope, $cookies, $ngConfirm, $window, $location, $timeout, apiService, swalert) {

  var ai = this;
  var stockId;
  ai.list_of_items = [];
  ai.addedItems = [];
  ai.quantity = true;
  ai.validQty = true;
  ai.cancelItem = true;
  ai.test = [];

  getAllItems();

  $scope.$on('emittedWorkId', function(val, obj){
    ai.work_id = obj.work_id;
  });

  $scope.$on('broadcastedRefreshItems', function(val, obj){
    getAllItems();
  });

  $scope.$on('refreshStockTable', function(val, obj){
    getAllItems();
  });


  ai.selectedItem = function(item){
    ai.itemSelected = item;
    ai.cancelItem = false;
    if(item.item_selected == 'selected'){
      angular.forEach(ai.addedItems, function(val, i){
        if (val.item_name == item.item_name) {
          item.item_selected = 'select';
        }
      });
      ai.addedItems.splice(ai.addedItems.indexOf(item), 1);
    }
    else{
      if(item.qty > 0){
        ai.validQty = false;
        ai.quantity = false;
        stockId = item.stock_id;
        ai.item_name = item.item_name;
        ai.description = item.description;
        ai.qty = item.qty;
        item.item_selected = 'selected';
      }
      else
      {
        ai.validQty = true;
        ai.quantity = true;
        ai.item_name = "";
        ai.description = "";
        ai.qty = "";
        $ngConfirm("<h5 class='red center'>Selected Item Out of Stock</h5>");
      }
    }
  }

  ai.qtyChanged = function(){
    let qty = getCurrentItemQty(stockId);
    console.log(ai.qty);
    if (ai.qty > qty || ai.qty == undefined) {
      ai.validQty = true;
    }
    else{
      ai.validQty = false;
    }
  }

  ai.addItemToList = function(){
    ai.itemSelected.item_selected = "selected";
    let item = {
        'work_id': ai.work_id,
        'stock_id': stockId,
        'item_name': ai.item_name,
        'description': ai.description,
        'qty': ai.qty
      }
    ai.addedItems.unshift(item);
    ai.quantity = true;
    ai.item_name = "";
    ai.description = "";
    ai.qty = "";
    ai.validQty = true;
  }

  ai.saveAddedItems = function(){
    ai.addedItems.length > 0 ? additems(ai.addedItems) : $ngConfirm("<h5 class='red center'>No Added Items</h5>");
  }

  ai.cancelAddItems = function(){
    ai.itemSelected.item_selected  = 'select';
    ai.quantity = true;
    ai.validQty = true;
    ai.item_name = "";
    ai.description = "";
    ai.qty = "";
  }

  ai.closeAddItemModal = function(){
    ai.addedItems = [];
    ai.quantity = true;
    ai.validQty = true;
    ai.cancelItem = true;
    ai.item_name = "";
    ai.description = "";
    ai.qty = "";   
  }

  function getCurrentItemQty(stockId){
    let currentQty;
    angular.forEach(ai.list_of_items, function(val, i){
      if (val.stock_id == stockId) {
        currentQty = val.qty;
      }
    });
    return currentQty;
  }

  function getAllItems(){
    ai.isLoading = true;
    apiService.getItems().then(function(response){
      ai.list_of_items = [];
      angular.forEach(response.data, function(val, i){
        let items = {
            'stock_id': val.stock_id,
            'item_name': val.item_name,
            'description': val.description,
            'qty': val.qty,
            'item_selected': 'select'
          }
        ai.list_of_items.push(items);
      });
      ai.isLoading = false;
    }, function(error){
        console.log(error);
    });
  }

  function additems(addedItems){
    apiService.addItemsToWork(addedItems).then(function(response){
      console.log(response);
      getAllItems();
      ai.addedItems = [];
      swalert.successAlert("Items Added!");
      $scope.$emit('newItemDetails', response.data[0]);
    }, function(error){
        console.log(error);
    });
  }

}]);

