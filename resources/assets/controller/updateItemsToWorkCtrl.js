'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:updateItemsToWorkCtrl
 * @description
 * # updateItemsToWorkCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller( 'updateItemsToWorkCtrl',['$scope', '$rootScope', '$cookies', '$ngConfirm',
                  '$window', '$location', '$timeout', 'apiService', 'swalert',
  function ($scope, $rootScope, $cookies, $ngConfirm, $window, $location, $timeout, apiService, swalert) {

  var ui = this;
  var worksId, work_items_id, newStockId;
  ui.list_of_items = [];
  ui.closeValue = true;
   
  getAllItems();
  
  $scope.$on('refreshStockTable', function(val, obj){
    getAllItems();
  });

  $scope.$on('emittedItem', function(val, obj){
    ui.copiedItem = angular.copy(obj);
    console.log(obj);
    worksId = obj.work_id;
    work_items_id = obj.work_items_id;
    ui.item_name = obj.item_name;
    ui.description = obj.description;
    ui.qty = obj.requested_quantity;
    newStockId = obj.work_stocks_id;
  });

  ui.qtyChanged = function(){
    let qty = getCurrentItemQty(newStockId);
    if (ui.qty > qty || ui.qty == undefined || ui.qty <= 0) {
      ui.validQty = true;
    }
    else{
      ui.validQty = false;
    }
  }

  ui.updateItem = function(){
    let newItem = {
      'work_items_id': work_items_id,
      'item_name': ui.item_name,
      'description': ui.description,
      'work_id': worksId,
      'newStockId': newStockId,
      'oldStockId':ui.copiedItem.stock_id,
      'newQty': ui.qty,
      'oldQty':ui.copiedItem.requested_quantity
    }
    ui.itemname = null;
    ui.itemChanged = false;
    updateItemRequest(newItem);  
  }

  ui.selectedItem = function(item){
    newStockId = item.stock_id;
    ui.item_name = item.item_name;
    ui.description = item.description;
    ui.qty = item.qty;
    ui.itemname = item.item_name;
    ui.itemChanged = true;
  }

  ui.reset = function(){
    ui.item_name = ui.copiedItem.item_name;
    ui.description = ui.copiedItem.description;
    ui.qty = ui.copiedItem.requested_quantity;    
    ui.itemname = null;
    ui.itemChanged = false;
  }

  ui.close = function(){
    ui.itemname = null;
    ui.itemChanged = false;
  }

  function getCurrentItemQty(stockId){
    let currentQty;
    angular.forEach(ui.list_of_items, function(val, i){
      if (val.stock_id == stockId) {
        currentQty = val.qty;
      }
    });
    return currentQty;
  }

  function getAllItems(){
    apiService.getItems().then(function(response){
      ui.list_of_items = [];
      angular.forEach(response.data, function(val, i){
        let items = {
            'stock_id': val.stock_id,
            'item_name': val.item_name,
            'description': val.description,
            'qty': val.qty,
            'item_selected': 'select'
          }
        ui.list_of_items.push(items);
      });
      ui.loading = false;
    }, function(error){
        console.log(error);
    });
  }

  function updateItemRequest(itemDetails){
    apiService.updateRequestedItems(itemDetails).then(function(response){
      console.log(response);
      $scope.$emit('newItemDetails', response.data[0]);
      getAllItems();
      swalert.successAlert('Item Updated!');
      ui.closeValue = false;
    }, function(error){
        console.log(error);
    });
  }

}]);

app.directive('closed', function(){
  return{
    restrict:"A",
    scope:{
      closed:"="
    },
    link:function(scope, element, attrs){
      scope.$watch("closed", function (newValue, oldValue) {
          if(newValue == false){
              console.log(newValue);
             $('#updateWorkItemModal').modal('hide');
          }
      }, true);
    }
  }
});

