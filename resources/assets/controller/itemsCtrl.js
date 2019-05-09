'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:itemsCtrl
 * @description
 * # itemsCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller( 'itemsCtrl',['$scope', '$rootScope', '$cookies',
                  '$window', '$location', '$timeout', 'apiService', 'swalert',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, apiService, swalert) {

  var ic = this;
  var itemId, stockId, oldQty, oldStockId, itemCount;
  var inProgress = false;
  var d = new Date();
  ic.isLoading = true;
  ic.loading = true;
  ic.list_of_stocks = [];
  ic.addedItems = [];
  ic.selectedItems = [];
  ic.add = true;

  stockCount();
  getAllRequestedItems();
  getAllItems();
  departmentData();
  getCurrentRequestNumber();

  ic.selectedItem = function(item){
    if(item.item_selected != 'selected'){
      ic.selectedItems = [item];
      ic.remainingQty = ic.selectedItems[0].qty;
      ic.hasSelected = true;
    }
  }

  ic.deducted = function(item){
    ic.itemToBeUpdated = item;
    let newQty = parseInt(item.qty - ic.enteredQty);
    if(ic.enteredQty){
      if(newQty < 0){
        ic.invalid = true;
        ic.remainingQty = newQty;
        console.log(item.qty);
        ic.add = true;
      }
      else
      {
        ic.invalid = false;
        ic.remainingQty= newQty;      
        ic.add = false;
        console.log(item.qty);
      }
    }
    else{
      ic.invalid = false;
      ic.add = true;
      ic.remainingQty = ic.selectedItems[0].qty;
    }
  }

  ic.addItem = function(item){
    let newItem = {
      'stock_id': item.stock_id,
      'item_name': item.item_name,
      'description': item.description,
      'qty': ic.enteredQty
    }
    ic.addedItems.push(newItem);
    ic.enteredQty = "";
    ic.hasSelected = false;
    ic.add = true;
    ic.itemToBeUpdated.qty = ic.remainingQty;
    ic.itemToBeUpdated.item_selected = 'selected';
    ic.remainingQty = ic.selectedItems[0].qty;
  }

  ic.removeItem = function(item){
    const newItemArray = ic.list_of_stocks.map(function(val, index){
        if(val.stock_id == item.stock_id){
          let removedItem = {
              'stock_id': val.stock_id,
              'item_name': val.item_name,
              'description': val.description,
              'qty': parseInt(val.qty) + parseInt(item.qty),
              'item_selected': 'select', 
            }
          return removedItem;
        }
        return val;
    });
    ic.list_of_stocks = newItemArray;
    ic.addedItems.splice(ic.addedItems.indexOf(item), 1);
  }

  ic.cancel = function(){
    ic.enteredQty = "";
    ic.hasSelected = false;
    ic.add = true;
    ic.invalid = false;
    ic.remainingQty = ic.selectedItems[0].qty;
  }

  ic.addWorkRequest = function(){
    if(ic.requestee && ic.purpose){
      var itemRequested = {
        "request_id": ic.selectedRequestNum.request_id,
        "request_number": ic.selectedRequestNum.request_num + 1,
        "requestee": ic.requestee,
        "w_deptId": ic.selectedDepartment.department_id,
        "w_userId": $cookies.getObject('auth').user_id,
        "date_requested": d.toISOString().split('T')[0],
        "purpose": ic.purpose,
        "post_remarks": ic.remarks,
        "work_status": 'Undone',
        "item_requested": ic.addedItems
      };
      saveItemRequest(itemRequested);
    }
  }

  ic.addRemarks = function(item){
    itemId = item.items_id;
    oldQty = item.request_qty;
    oldStockId = item.stock_id;
    ic.requestee = item.requestee;
    ic.item_name = item.item_name;
    ic.description = item.description;
    ic.qty = item.request_qty;
    stockId = item.stock_id;
    ic.remarks = item.pre_remarks;
    ic.showUpdate = true;
    angular.forEach(ic.departments, function(val, i){
      if(val.department_id == item.i_deptId){
        ic.selectedDepartment = val;
      }
    });
  }

  ic.updateRequestedItem = function(){
    var itemRequested = {
      "items_id": itemId,
      "requestee": ic.requestee,
      'oldQty': oldQty,
      "request_qty": ic.qty,
      "i_deptId": ic.selectedDepartment.department_id,
      "stockId": stockId,
      "oldStockId": oldStockId,
      "pre_remarks": ic.remarks,
      "post_remarks": ic.post_remarks
    };
    updateItemRequest(itemRequested);  
  }

  ic.cancelItemRequest = function(){
    ic.purpose = "";
    ic.requestee = "";
    ic.qty = "";
    ic.remarks = "";
  }

  ic.loadImages = function(){
    if (itemCount != ic.list_of_stocks.length) {
      if(!inProgress){
        angular.element(".itemTable").addClass("scrollDisabled");
        getAllItems();
      }
    }
  }

  function getCurrentRequestNumber(){
    apiService.currentRequestNumber().then(function(response){
      ic.request_nums = response.data;
      angular.forEach(response.data, function(val, i){
       val.request_id == 1 ? ic.selectedRequestNum = val : null;
      });
    }, function(error){
        console.log(error);
    });
  }

  function getAllItems(){
    inProgress = true;
    ic.isLoading = true;
    let lng = ic.list_of_stocks.length;
    $timeout(function(){
      apiService.getItems(lng).then(function(response){
        angular.forEach(response.data, function(val, i){
          let items = {
              'stock_id': val.stock_id,
              'item_name': val.item_name,
              'description': val.description,
              'qty': val.qty,
              'item_selected': 'select'
            }
          ic.list_of_stocks.push(items);
        });
        ic.stocklist = angular.copy(ic.list_of_stocks);
        ic.loading = false;
        ic.isLoading = false;
        inProgress = false;
        angular.element(".itemTable").removeClass("scrollDisabled");
        angular.element(".itemTable").animate({ scrollTop: 370 }, 500);
      }, function(error){
          console.log(error);
      });
    }, 200);
  }

  function stockCount(){
    apiService.countItems().then(function(response){
      itemCount = response.data;
    }, function(error){
      console.log(error);
    });
  }

  function getAllRequestedItems(){
    apiService.getRequestedItems($cookies.getObject('auth').departmentId).then(function(response){
      console.log(response);
      ic.requestedItems = response.data;
    }, function(error){
      console.log(error);
    });
  }

  function departmentData() {
    ic.isLoading = true;
    apiService.getDepartments().then(function(response){
      ic.isLoading = false;
      ic.departments = response.data;
      giveInitialValueToDept(response.data);
    }, function(error){
      console.log(error);
    });
  }

  function saveItemRequest(itemDetails){
    apiService.saveRequestedItems(itemDetails).then(function(response){
      removeSelected(ic.list_of_stocks, ic.addedItems, 0, 0);
      getCurrentRequestNumber();
      ic.addedItems = [];
      getAllRequestedItems();
      ic.cancelItemRequest();
      swalert.successAlert("Request Sent");
    }, function(error){
        console.log(error);
    });
  }

  function updateItemRequest(itemDetails){
    apiService.updateRequestedItems(itemDetails).then(function(response){
      ic.addedItems = [];
      console.log(response);
      getCurrentRequestNumber();
      getAllItems();
      getAllRequestedItems();
      ic.cancelItemRequest();
      swalert.successAlert(response.data.message);
    }, function(error){
        console.log(error);
    });
  }

  function giveInitialValueToDept(dept){
    angular.forEach(dept, function(val, i){
      $cookies.getObject('auth').departmentId == val.department_id ? ic.selectedDepartment = val : null;
    });
  }

  function removeSelected(array, array2, idx, idx2){
    if(idx2 != ic.addedItems.length){
      if (array[idx].stock_id == array2[idx2].stock_id) {
        array[idx].item_selected = 'select';
        idx = 0;
        idx2 += 1; 
        removeSelected(array, array2, idx, idx2);
      }
      else{
        idx += 1; 
        removeSelected(array, array2, idx, idx2);
      }
    }
  }

}]);

app.directive('whenScrolled', function() {
  return function(scope, element, attr) {
    var raw = element[0];
    element.on('scroll', function() {
      if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
        scope.$apply(attr.whenScrolled);
      }
    });
  };
});
// app.directive('resize', function ($window) {
//     return function (scope, element) {
//         var w = angular.element($window);
//         scope.getWindowDimensions = function () {
//             return {
//                 'h': w.height(),
//                 'w': w.width()
//             };
//         };
//         scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
//             scope.style = function () {
//                 return {
//                   'min-height': (170) + 'px',
//                   'max-height': (170) + 'px',
//                 };
//             };
//             console.log(scope.style());
//         }, true);

//         w.bind('resize', function () {
//             scope.$apply();
//         });
//     }
// });

// app.directive('resize', function ($window) {
//     return function (scope, element) {
//         var w = angular.element($window);
//         scope.getWindowDimensions = function () {
//             return {
//                 'h': w.height(),
//                 'w': w.width()
//             };
//         };
//         scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
//             // scope.windowHeight = newValue.h;
//             // scope.windowWidth = newValue.w;

//             scope.style = function () {
//                 return {
//                   'min-height': (170) + 'px',
//                   'max-height': (170) + 'px',
//                 };
//             };
//             console.log(scope.style());
//         }, true);

//         w.bind('resize', function () {
//             scope.$apply();
//         });
//     }
// })