'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:addDepartmentCtrl
 * @description
 * # addDepartmentCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller('addDepartmentCtrl',['$scope', '$rootScope', '$cookies',
  '$window', '$location', '$timeout', '$ngConfirm', 'apiService', 'debounce',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, $ngConfirm, apiService, debounce) {

  var adept = this;
  adept.disableSave = true;

  $scope.$watch('adept.department', debounce(function() {
     console.log(adept.department);
     if(!adept.department){
        adept.passedOrFail = null;
        adept.success = false;
        adept.fail = false;
        adept.disableSave = true;
     }
     else
     {
        validateDepartmentIfExist(adept.department);
     }
  },500), true);
 
  adept.addDepartment = function(deptValue){
    let deptVal = { department_name: deptValue.toUpperCase() };
    if(deptValue && adept.success == true){
      confirmDialog(deptVal);
    }
  }

  adept.closeModal = function(){
    adept.department = "";
    adept.passedOrFail = null;
    adept.success = false;
    adept.fail = false;
    adept.disableSave = true;
  }

  function validateDepartmentIfExist(deptName){
    apiService.validateDepartment(deptName).then(function(response){
      console.log(response);
      adept.passedOrFail = true;
      adept.fail = false;
      adept.success = true;
      adept.disableSave = false;
    }, function(error){
      console.log(error);
      adept.passedOrFail = false;
      adept.success = false;
      adept.fail = true;
      adept.disableSave = true;
    });
  }

  function addedDepartment(deptValue){
    apiService.addDepartment(deptValue).then(function(response){
      adept.department = "";
      adept.response = true;
      $scope.$emit('reload_department_list');
      adept.message = 'Successfully Added';
      $timeout(function(){
        adept.response = true;
      }, 1000);
    }, function(error){
      console.log(error);
      adept.message = error.data;
    });
  }

  function confirmDialog(deptVal){
    $ngConfirm({
      title: '',
      content: 'SAVE?',
      type: 'green',
      theme:'seamless',
        buttons: {
          Yes: {
            text: 'Yes',
            btnClass: 'btn-green',
            action: function(){
              addedDepartment(deptVal);
            }
          },
          Cancel: {
            text: 'No',
            btnClass: 'btn-blue',
          }
        }
    });
  }

}]);
  
app.factory('debounce', function($timeout) {
    return function(callback, interval) {
        var timeout = null;
        return function() {
            $timeout.cancel(timeout);
            timeout = $timeout(function () { 
                callback.apply(this, arguments); 
            }, interval);
        };
    }; 
});
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


'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:addReservationCtrl
 * @description
 * # addReservationCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller('addReservationCtrl',
      ['$scope', '$rootScope', '$location', '$http', '$ngConfirm','$filter','$cookies', '$timeout', 'apiService',
        function ($scope, $rootScope, $location, $http, $ngConfirm, $filter, $cookies, $timeout, apiService) {

  var ar = this;
  var d = new Date();
  ar.minLength = 60;
  ar.minutes = [];
  ar.endtimezone="PM";
  ar.starttimezone="PM";

  $scope.$on('departmentDetails', function(val, obj){
    ar.departments = obj;
    console.log(obj);
    angular.forEach(ar.departments, function(val, i){
      if(val.department_id == $cookies.getObject('auth').departmentId){
        ar.selectedDepartment = val;
      }
    });
  });

  $scope.$on('venueDetails', function(val, obj){
    ar.venues = obj;
  });

  for (var i = 0; i <= ar.minLength; i++) {
    if(i >= 10){
      ar.minutes.push(i.toString());
    }else{
      ar.minutes.push('0'+i);
    }
  }

  ar.addReservation = function(){
    if(!ar.requester || !ar.selectedDepartment || !ar.selectedVenue || !ar.purpose 
        || !ar.starthour || !ar.startminutes || ! ar.starttimezone || !ar.endhour || !ar.endminutes || !ar.endtimezone  
     ){
        // $ngConfirm('Complete all the Fields');
    }else{
      var reservationDetails = {
        requester_name: ar.requester,
        departmentId: ar.selectedDepartment.department_id,
        venueId: ar.selectedVenue.venue_id,
        purpose: ar.purpose,
        start_date: ar.start_date,
        start_time: convertTime12to24(ar.starthour+':'+ar.startminutes+':'+'00'+' '+ar.starttimezone),
        end_date: ar.end_date,
        end_time: convertTime12to24(ar.endhour+':'+ar.endminutes+':'+'00'+' '+ar.endtimezone),
        requested_date: d.toISOString().split('T')[0]
      }
      reservation(reservationDetails); 
    }
  }
  
  function reservation(reservationDetails){
    apiService.addReservation(reservationDetails).then(function(response){
      console.log(response)
      ar.selectedVenue = "";
      ar.requester = "";
      ar.start_date = "";
      ar.end_date = "";
      ar.startminutes="";
      ar.starthour = "";
      ar.starttimezone="PM";
      ar.endminutes="";
      ar.endhour = "";
      ar.endtimezone="PM";
      ar.purpose="";
      $scope.$emit('viewAddedReservation');
      $ngConfirm(response.data.message);
    }, function(error){
      console.log(error);
      $ngConfirm(error.data.message);
    });
  }

  function convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return hours + ':' + minutes+':'+'00';
  }

}]);

'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:addVenueCtrl
 * @description
 * # addVenueCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller('addVenueCtrl',
      ['$scope', '$rootScope', '$location', '$http', '$ngConfirm','$filter', '$timeout', 'apiService', 'debounce',
        function ($scope, $rootScope, $location, $http, $ngConfirm, $filter, $timeout, apiService, debounce) {

  var ad = this;

  $scope.$watch('ad.venue', debounce(function() {
     if(!ad.venue){
        ad.passedOrFail = null;
        ad.success = false;
        ad.fail = false;
        ad.disableSave = true;
     }
     else
     {
        validateVenueIfExist(ad.venue);
     }
  },500), true);

  ad.addVenueDetails = function(){
    if(ad.venue){
      var venueDetails =  { venue_name: ad.venue, user_id: $rootScope.userLoginId };
      apiService.addVenue(venueDetails).then(function(response){
        console.log(response.data[0]);
        ad.response = true;
        ad.message = 'Venue Added Successfully';
        $scope.$emit("reload_venue_list");
      }, function(error){
        ad.response = true;
        ad.message = 'failed! please try again.';
        console.log(error);
      });
    }
  }  

  ad.close = function(){
      ad.venue = "";
      ad.response = false;
  }

  function validateVenueIfExist(deptName){
    apiService.validateVenue(deptName).then(function(response){
      ad.passedOrFail = true;
      ad.fail = false;
      ad.success = true;
      ad.disableSave = false;
    }, function(error){
      console.log(error);
      ad.passedOrFail = false;
      ad.success = false;
      ad.fail = true;
      ad.disableSave = true;
    });
  }


}]);

app.factory('debounce', function($timeout) {
    return function(callback, interval) {
        var timeout = null;
        return function() {
            $timeout.cancel(timeout);
            timeout = $timeout(function () { 
                callback.apply(this, arguments); 
            }, interval);
        };
    }; 
});
'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:departmentCtrl
 * @description
 * # departmentCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller('departmentCtrl',['$scope', '$rootScope', '$cookies', '$window',
                                   '$location', '$timeout', 'apiService', 'swalert',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, apiService, swalert) {

  var dept = this;
  var departmentId;
  dept.updating = false;
  departmentData();

  $scope.$on('reloading_department_list', function(){
    departmentData();
  });

  dept.edit = function(deptObject) {
    dept.selectedDept = angular.copy(deptObject);
    dept.department = deptObject;
    departmentId = deptObject.department_id;
    dept.editing = true;
    dept.disableDelete = true;
  }

  dept.cancelEdit = function(){
    dept.editing = false;
    dept.disableDelete = false;
    if (dept.selectedDept.department_name != dept.department.department_name)
            dept.department.department_name = dept.selectedDept.department_name 
  }

  dept.update = function(departmentName){
    var updatedDeptName = {
      department_id: departmentId,
      department_name: departmentName.toUpperCase()
    };
    dept.updating = true;
    dept.disableDelete = false;
    updateDepartmentData(updatedDeptName);
  }

  dept.deleteDepartment = function(delDepartment){
    swalert.showAlert(delDepartment, removeDepartmentData);
  }

  function departmentData() {
    dept.isLoading = true;
    apiService.getDepartments().then(function(response){
      dept.departments = response.data;
      $timeout(function() {
        dept.isLoading = false;
      }, 1000);
    }, function(error){
      console.log(error);
    });
  }

  function updateDepartmentData(updatedDetails) {
    apiService.updateDepartment(updatedDetails).then(function(response){
      dept.editing = false;
      dept.updating = false;
      swalert.successInfo('Department Updated!', 'success', 3000);
    }, function(error){
      console.log(error);
      dept.message = error.data;
    });    
  }

  function removeDepartmentData(departmentObj){
    apiService.removeDepartment(departmentObj).then(function(response){
      dept.departments.splice(dept.departments.indexOf(departmentObj), 1);
      swalert.successInfo('Department has been deleted', 3000);
    }, function(error){
      console.log(error);
      checkIntegrityError(error.status);
    });
  } 

  function checkIntegrityError(constraints){
    constraints == 500 ? 
    swalert.errorAlert('Cannot delete or update parent row. This department name is being use.') : swalert.errorAlert('Failed! retry again.');
  }

}]);


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

'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:inventoryModalCtrl
 * @description
 * # inventoryModalCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller('inventoryModalCtrl',['$scope', '$rootScope', '$cookies', '$ngConfirm',
  '$window', '$location', '$timeout', 'apiService', 'swalert',
  function ($scope, $rootScope, $cookies, $ngConfirm, $window, $location, $timeout, apiService, swalert) {

  var im = this;

  $scope.$on('broadcastedItem', function(val, obj){
  	im.selectedItem = [obj];
  	im.totalQty = obj.qty;
    im.stock_id = obj.stock_id;
  });

  im.deducted = function(item){
    let newQty = parseInt(item.qty - im.enteredQty);
  	if(item){
      if(newQty < 0){
        im.totalQty = newQty;
        im.invalid = true;
        im.save = true;
      }
      else
      {
        im.totalQty = newQty;
        im.invalid = false;
        im.save = false;
      }
  	}
  }

  im.addStockQuantity = function(){
      var addedQty = { 
                        "newQty": im.totalQty,
                        "stock_id" : im.stock_id
                      };
      addQuantity(addedQty);
  }

  im.deductStockQuantity = function(){
    if(im.totalQty > -1){
      var deductedQty = { 
                          "newQty": im.totalQty,
                          "stock_id" : im.stock_id
                        };
      deductQuantity(deductedQty);
    }
  }

   im.addQty = function(item){
  	if(item){
  		let newQty = parseInt(item.qty) + parseInt(im.addedQty);
  		im.totalQty = newQty || item.qty;
  		console.log(im.totalQty);
  	}
  }

  function addQuantity(itemDetails){
      apiService.addStockQty(itemDetails).then(function(response){
          console.log(response);
          $scope.$emit('emittedRefreshStockTable');
          im.addedQty = "";
          swalert.successAlert('Quantity Successfully Updated');
      }, function(error){
          console.log(error);
      });
  }

  function deductQuantity(itemDetails){
      apiService.deductStockQty(itemDetails).then(function(response){
          console.log(response);
          $scope.$emit('emittedRefreshStockTable');
          im.enteredQty = "";
          swalert.successAlert('Quantity Successfully Updated');
      }, function(error){
          console.log(error);
      });
  }

}]);

app.directive('number', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attrs, ctrl) {
            ctrl.$parsers.push(function (input) {
                if (input == undefined) return ''
                var inputNumber = input.toString().replace(/[^0-9]/g, '');
                if (inputNumber != input) {
                    ctrl.$setViewValue(inputNumber);
                    ctrl.$render();
                }
                return inputNumber;
            });
        }
    };
});
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
  ic.statuses = ["Undone"];
  ic.selectedStatus = "Undone";
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
    var itemRequested = {
      "request_id": ic.selectedRequestNum.request_id,
      "request_number": ic.selectedRequestNum.request_num + 1,
      "requestee": ic.requestee,
      "w_deptId": ic.selectedDepartment.department_id,
      "w_userId": $cookies.getObject('auth').user_id,
      "date_requested": d.toISOString().split('T')[0],
      "purpose": ic.purpose,
      "post_remarks": ic.remarks,
      "work_status": ic.selectedStatus,
      "item_requested": ic.addedItems
    };
    saveItemRequest(itemRequested);  
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
  '$window', '$location', '$timeout', 'apiService', 'swalert',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, apiService, swalert) {

  var lg = this;
  lg.valid= true;
  lg.buttonMessage = 'Sign In';
  lg.loginBtn = false;

  lg.login =function(){
    if(!lg.email || !lg.password){
      console.log('unAuthenticated');
    }else{
      lg.loginBtn = true;
      lg.buttonMessage = 'Signing In...';
      swalert.successInfo("<label class='green'>Checking Identity...</label>", 'info', );
      var credentials = {
        email: lg.email,
        password: lg.password
      }

      apiService.validateLogin(credentials)
        .then(function(response){
          $cookies.putObject('auth', response.data);
          $scope.$emit("Authenticated");
          $location.path('/dashboard');
          lg.loginBtn = false;
          
      }, function(error){
        swalert.successInfo("<label class='red'>Whoopss!...</label>", 'error', );
        lg.valid = false;
        lg.loginBtn = false;
        lg.buttonMessage = 'Sign In'; 
          $timeout(function(){
            lg.valid = true;
          }, 3000);
      });
    }
  }


}]);

'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:mainAppCtrl
 * @description
 * # mainAppCtrl
 * Controller of the PPMS
 */

var app = angular.module('myApp')
app.controller('mainAppCtrl',['$scope', '$rootScope', '$location', '$http', '$ngConfirm',
                              '$filter', '$timeout', '$cookies', '$window', 'apiService', 'swalert',
  function ($scope, $rootScope, $location, $http, $ngConfirm, $filter, $timeout, $cookies, $window, apiService, swalert) {
  
  $scope.selected = 1;
  
  $scope.redirectTo = function(location){
    $location.path(location);
  }

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
    $window.location.reload();   
  }
  
  //Recieved Emitted Data from Controllers

  $scope.$on('Authenticated', function(){
    swalert.successInfo("<label class='green'>Welcome Back "+$cookies.getObject('auth').name+"!</label>", 'success', 3000);
  });

  $scope.$on('selected_reservation', function(val, obj){
    $scope.$broadcast('get_selected_reservation', obj );
  });

  $scope.$on('viewAddedReservation', function(val, obj){
    $scope.$broadcast('updateAddedReservation');
  });

  $scope.$on('reload_venue_list', function(){
    $scope.$broadcast('reloading_venue_list');
  });

  $scope.$on('reload_department_list', function(){
    $scope.$broadcast('reloading_department_list');
  });

  $scope.$on('userToUpdate', function(val, obj){
    $scope.$broadcast('user', obj);
  });

  $scope.$on('reload_userlist', function(){
    $scope.$broadcast('reloading_userlist');
  });

  $scope.$on('usertypesData', function(val, obj){
    $scope.$broadcast('usertypesDetails', obj);
  });

  $scope.$on('departmentsData', function(val, obj){
    $scope.$broadcast('departmentDetails', obj);
  });

  $scope.$on('venueData', function(val, obj){
    $scope.$broadcast('venueDetails', obj);
  });

  $scope.$on('emittedItem', function(val, obj){
    $scope.$broadcast('broadcastedItem', obj);
  });

  $scope.$on('emittedRefreshStockTable', function(){
    $scope.$broadcast('refreshStockTable');
  });

  //Recieved from workCtrl
  $scope.$on('itemToBeUpdated', function(val, obj){
    $timeout(function(){
       $scope.$broadcast('emittedItem', obj);
    });
  });

  $scope.$on('newItemDetails', function(val, obj){
    $timeout(function(){
       $scope.$broadcast('emittedNewItem', obj);
    });
  });

  $scope.$on('work_id', function(val, obj){
    $timeout(function(){
       $scope.$broadcast('emittedWorkId', obj);
    });
  });
  
  $scope.$on('EmitRefreshItems', function(){
    $timeout(function(){
       $scope.$broadcast('broadcastedRefreshItems');
    });
  });

}]);


'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:profileCtrl
 * @description
 * # profileCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller('profileCtrl',
      ['$scope', '$rootScope', '$cookies', '$location', '$http', '$ngConfirm','$filter', '$timeout', '$q', 'apiService', 'swalert',
        function ($scope, $rootScope, $cookies, $location, $http, $ngConfirm, $filter, $timeout, $q, apiService, swalert) {

  var pc = this;
  pc.isLoading = true;
  var auth = $cookies.getObject('auth');
  auth.userType == 1? pc.hideDepartment = true : pc.hideDepartment = false;

  loadProfile();

  pc.updateuser = function(){
    if(pc._name && pc.email && pc.selectedDepartment){
      var updatedUserDetails = {
        id: auth.user_id,
        name: pc._name,
        email: pc.email,
        usertypeId: auth.userType,
        departmentId: pc.selectedDepartment.department_id,
      }
      swalert.updateAlert(updatedUserDetails, updatedUserData);
    }
  }

  pc.updatePassword = function(){
    if(pc.password && pc.newpassword){
      var credentials = {
        id: auth.user_id,
        password: pc.password,
        newpassword: pc.newpassword,
      }
      updatedUserPassword(credentials);
    }
  }

  function updatedUserData(userData){
    apiService.updateUser(userData).then(function(response){
      $rootScope.userLogName = pc._name;
      let newCookie = {
        departmentId: auth.departmentId,
        name: pc._name,
        success: {
          token: auth.success.token
        },
        userType: auth.userType,
        user_id: auth.user_id,
      };
      $cookies.putObject('auth', newCookie);
      swalert.successAlert('User details updated!');
    }, function(error){
      console.log(error);
      swalert.errorAlert('try again');
    });
  }

  function updatedUserPassword(credentials){
    apiService.updatedPassword(credentials).then(function(response){
      swalert.successAlert('Password updated!');
    }, function(error){
      console.log(error);
      swalert.errorAlert('Current Password Incorrect!');
    });
  }

  function loadProfile(){
    $q.all([apiService.getProfile(), apiService.getDepartments()]).then(function(response){
      pc._name = response[0].data[0].name;
      pc.email = response[0].data[0].email;
      pc.departments = response[1].data;
      giveInitialValueToDept(response[1].data);
    }, function(error){
      console.log(error);
    });
  }

  function giveInitialValueToDept(dept){
    angular.forEach(dept, function(val, i){
      auth.departmentId == val.department_id ? pc.selectedDepartment = val : null;
    });
    pc.isLoading = false;
  }

}]);

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
    if(!rc.filteredDate){
      getStockByDate();
    }
    else{
      getStockByDate(rc.filteredDate);      
    }
    console.log(rc.filteredDate);   
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


'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:updateUserCtrl
 * @description
 * # updateUserCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller('updateUserCtrl',['$scope', '$rootScope', '$cookies', '$window',
                                  '$location', '$timeout', 'apiService', 'swalert',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, apiService, swalert) {

  var ud = this;
  $scope.$on('departmentDetails', function(val, obj){
    ud.departments = obj;
  });

  $scope.$on('usertypesDetails', function(val, obj){
    ud.userTypes = obj;
  });

  $scope.$on('user', function(val, obj){
    ud.user = obj;
    angular.forEach(ud.userTypes, function(val, i){
      if (ud.user.usertype_id == val.usertype_id) { 
        ud.selectedUserType = val;
      }
    });
    angular.forEach(ud.departments, function(val, i){
      if (ud.user.department_name == val.department_name) {
        ud.selectedDepartment = val;
      }
    });
  });


  ud.updateuser = function(){
    if(ud.user.name && ud.user.email && ud.selectedUserType && ud.selectedDepartment){
      var updatedUserDetails = {
        id: ud.user.id,
        name: ud.user.name,
        email: ud.user.email,
        usertypeId: ud.selectedUserType.usertype_id,
        departmentId: ud.selectedDepartment.department_id,
      }
      updatedUserData(updatedUserDetails);
    }
    else
    {
      swalert.errorAlert('Complete the form');
    }
  }

  ud.resetPassword = function(){
    if(ud.newpassword){
      var credentials = {
        id: ud.user.id,
        newpassword: ud.newpassword,
      }
      resetUserPassword(credentials);
    }
  }

  function updatedUserData(userData){
    apiService.updateUser(userData).then(function(response){
      console.log(response);
      swalert.successAlert('User updated!');
      $scope.$emit('reload_userlist');
    }, function(error){
      console.log(error);
      swalert.errorAlert('try again');
    });
  }

  function resetUserPassword(credentials){
    apiService.resetPassword(credentials).then(function(response){
      console.log(response);
      swalert.successAlert(response.data.status);
    }, function(error){
      console.log(error);
      swalert.errorAlert('Current Password Incorrect!');
    });
  }
}]);

'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:userCtrl
 * @description
 * # userCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller('userCtrl',['$scope', '$rootScope', '$cookies', '$ngConfirm', 
                             '$window', '$location', '$timeout', 'apiService', 'debounce', 'swalert', 'socket',
  function ($scope, $rootScope, $cookies, $ngConfirm, $window, $location, $timeout, apiService, debounce, swalert, socket) {

  var au = this;
  au.isLoading = false;
  au.disableSave = true;

  departments();
  usertypes();
  users();

  $scope.$watch('au.email', debounce(function() {
     if(!au.email){
        au.passedOrFail = null;
        au.success = false;
        au.fail = false;
        au.disableSave = true;
     }
     else
     {
        validateEmailIfExist(au.email);
     }
  },500), true);

  socket.on('messageSend', function(data) {
      console.log(data);
  });

  $scope.$on('reloading_userlist', function(){
    users();
  });

  au.addUser = function(){
    if(au.name || au.email || au.password || au.password || au.selectedUserType || au.selectedDepartment){
      var userDetails = {
        name: au.name,
        email: au.email,
        password: au.password,
        usertypeId: au.selectedUserType.usertype_id,
        departmentId: au.selectedDepartment.department_id
      }
      au.disableSave = true;
      swalert.successInfo('<i class="fa fa-spinner fa-spin"></i>Saving...', 'info', );
      addUserDetails(userDetails);
    }
  }

  au.deleteUser = function(user){
    swalert.showAlert(user, userToBeDeleted); 
  }

  au.updateUser = function(user){
    $scope.$emit('userToUpdate', user)
  }

  function departments(){
    apiService.getDepartments().then(function(response){
      au.departments = response.data;
      $scope.$emit('departmentsData', au.departments);
    }, function(error){
      console.log(error);
    });
  }

  function usertypes(){
    apiService.getUserTypes($cookies.getObject('auth').userType).then(function(response){
      console.log(response);
      au.userTypes = response.data;
      $scope.$emit('usertypesData', au.userTypes);
    }, function(error){
      console.log(error);
    });
  }

  function addUserDetails(userDetails){
    apiService.addUser(userDetails).then(function(response){
      au.name = "";
      au.email = "";
      au.password = "";
      au.selectedUserType = "";
      au.selectedDepartment = "";
      swalert.successInfo('Successfully Added!', 'success', 3000);
    }, function(error){
      swalert.successInfo('failed! try again.', 'error', 3000);
    });
  }

  function users(){
    au.isLoading = true;
    apiService.getUsers().then(function(response){
      au.users = response.data;
      au.isLoading = false;
    }, function(error){
      console.log(error);
    });
  }

  function userToBeDeleted(user){
    apiService.deleteUsers(user.id).then(function(response){
      swalert.successAlert("User has been deleted");
      au.users.splice(au.users.indexOf(user), 1);
    }, function(error){
      checkIntegrityError(error.status);
    });
  }

  function validateEmailIfExist(deptName){
    apiService.validateEmail(deptName).then(function(response){
      console.log(response);
      au.passedOrFail = true;
      au.fail = false;
      au.success = true;
      au.disableSave = false;
    }, function(error){
      console.log(error);
      au.passedOrFail = false;
      au.success = false;
      au.fail = true;
      au.disableSave = true;
    });
  }

  function checkIntegrityError(constraints){
    constraints == 500 ? 
    swalert.errorAlert('Cannot delete this user. This user name is being use.') : swalert.errorAlert('Failed! retry again.');
  }
}]);

//angularjs debounce
app.factory('debounce', function($timeout) {
    return function(callback, interval) {
        var timeout = null;
        return function() {
            $timeout.cancel(timeout);
            timeout = $timeout(function () { 
                callback.apply(this, arguments); 
            }, interval);
        };
    }; 
});

app.factory('socket', function ($rootScope) {
var socket = io.connect('127.0.0.1:8000');
return {
    on: function (eventName, callback) {
        socket.on(eventName, function () {
            var args = arguments;
            $rootScope.$apply(function () {
                callback.apply(socket, args);
            });
        });
    },
    emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
                if (callback) {
                    callback.apply(socket, args);
                }
            });
        })
    }
};
});
'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:venueCtrl
 * @description
 * # venueCtrl
 * Controller of the PPMS
 */

var app = angular.module('myApp')
app.controller('venueCtrl', ['$scope', '$rootScope', '$location', '$http', '$ngConfirm',
                             '$filter', '$timeout', '$cookies', 'apiService', 'swalert',
    function ($scope, $rootScope, $location, $http, $ngConfirm, $filter, $timeout, $cookies, apiService, swalert) {
  
  var vc = this;
  var dataToEdit = null;
  var OldVenueId = null;
  vc.minLength = 60;
  vc.minutes = [];
  vc.response = false;
  vc.Hidden = true;
  vc.editing = false;
  vc.eventMessage = 'Show calendar';
  var events = [];
  vc.eventSources = [events];

  getAllVenues();
  departments();
  getAllReservations('*');

  $scope.$on('reloading_venue_list', function(){
    getAllVenues();
  });

  $scope.$on('updateAddedReservation', function(val, obj){
    getAllReservations('*');
  });

  vc.uiConfig = {
    calendar:{
      height: 475,
      editable: true,
      eventLimit: 2,
      header:{
        left: 'month agendaWeek agendaDay',
        center: 'title',
        right: 'today prev,next'
      },
      dayClick: function( date, allDay, jsEvent, view ) {
          var start=moment(date).format('YYYY-MM-DD');
          if(vc.selectedvenueList != undefined){
            getAllReservationsDate(start, vc.selectedvenueList.venue_id);
          }
          else{
            getAllReservationsDate(start);
          }
          console.log(start);
      },
      eventClick: pendingEventClick
    }
  };

  for (var i = 0; i <= vc.minLength; i++) {
    if(i >= 10){
      vc.minutes.push(i.toString());
    }else{
      vc.minutes.push('0'+i);
    }
  }

  var pendingEventClick = function (calEvent,jsEvent,view){
    if(vc.selectedvenueList != undefined){
      getAllReservationsDate(calEvent.start.format('YYYY-MM-DD'), vc.selectedvenueList.venue_id);
    }
    else{
      getAllReservationsDate(calEvent.start.format('YYYY-MM-DD'));
    }
  }

  vc.eMessage = function(){
    if(vc.Hidden){
      vc.Hidden = false;
      vc.eventMessage = 'Hide calendar';
    }else{
      vc.Hidden = true;
      vc.eventMessage = 'Show calendar';
    }
  }

  vc.editVenue = function(venueData){
    vc.selected_venue = angular.copy(venueData);
    vc.editing = true;
    vc.disableDeleteBtn = true;
    vc.venue = venueData;
    OldVenueId = venueData.venue_id;
  }

  vc.updateVenue = function(venueData){
    var updatedVenue = {
      venue_name: venueData,
      venue_id: OldVenueId
    }
    vc.updating = true;
    updateVenueDetails(updatedVenue);
  }

  vc.deleteVenue = function(venue){
      swalert.showAlert(venue, deleteVenue);
      console.log(venue);
  }
  
  vc.updateReservationData = function(reserveData){
    dataToEdit = reserveData;
    vc.editing = true;
    vc.requester = reserveData.client_name;
    vc.selectedDepartment = reserveData.department_name;
    vc.purpose  = reserveData.purpose;
    vc.start_date = reserveData.start_date;
    vc.end_date = reserveData.end_date;
    vc.starthour = tConvHour(reserveData.start_time);
    vc.startminutes = tConvHour(reserveData.start_time);
    vc.endhour = tConvHour(reserveData.end_time);
    vc.endminutes = tConvHour(reserveData.end_time);
    angular.forEach(vc.venues, function(val, i){
      if(val.venue_id == reserveData.venueId){
        vc.selectedVenue = val;
      }
    });
    angular.forEach(vc.departments, function(val, i){
      if(val.department_id == reserveData.departmentId){
        vc.selectedDepartment = val;
      }
    });
  }

  vc.updateReservation = function(){
    if(!vc.requester || !vc.selectedDepartment || !vc.selectedVenue || !vc.purpose 
        || !vc.starthour || !vc.startminutes || !vc.starttimezone || !vc.endhour || !vc.endminutes || !vc.endtimezone  
     ){
        alert('Complete all the Fields');
    }else{

      var details = {
        client_id: dataToEdit.client_id,
        client_reservation_id: dataToEdit.client_reservation_id,
        requester_name: vc.requester,
        departmentId: vc.selectedDepartment.department_id,
        venueId: vc.selectedVenue.venue_id,
        purpose: vc.purpose,
        start_date: vc.start_date,
        start_time: convertTime12to24(vc.starthour+':'+vc.startminutes+':'+'00'+' '+vc.starttimezone),
        end_date: vc.end_date,
        end_time: convertTime12to24(vc.endhour+':'+vc.endminutes+':'+'00'+' '+vc.endtimezone),
      }
      updateDetails(details);
    }
  }

  vc.cancelEdit = function(){
    dataToEdit = null;
    vc.editing = false;
    vc.disableDeleteBtn = false;
    if (vc.selected_venue.venue_name  != vc.venue.venue_name)
            vc.venue.venue_name = vc.selected_venue.venue_name; 
  }

  vc.viewDetails = function(selectedReservation){
    var viewReservation = selectedReservation;
    $scope.$emit('selected_reservation', viewReservation );
  }

  vc.selectedVenueId = function(){
    if(vc.selectedvenueList != undefined){
      getAllReservations('*', vc.selectedvenueList.venue_id);
    }
    else{
      getAllReservations('*');
    }
  }

  function updateVenueDetails(venue){
    apiService.updateVenue(venue).then(function(response){
      vc.editing = false;
      vc.updating = false;
      swalert.successInfo(response.data.message, 'success', 3000);
    }, function(error){
      swalert.errorAlert(error.data.message);
    });
  }

  function getAllReservationsDate(rDate, venueid = ""){
    vc.isLoading = true;
    apiService.getReservations(rDate, $cookies.getObject('auth').departmentId, venueid).then(function(response){
      vc.isLoading = false;
      vc.reservations = response.data;
      console.log(response.data)
    }, function(error){
      console.log(error);
    });
  }

  function getAllReservations(rDate, venueid = ""){
    vc.isLoading = true;
    apiService.getReservations(rDate, $cookies.getObject('auth').departmentId, venueid).then(function(response){
      events.length = 0;
      angular.forEach(response.data, function(val, i){
        events.push({
          title: val.purpose,
          start: val.start_date+' '+val.start_time,
          end: val.end_date+' '+val.end_time,
          allDay : false
        });
      });
      vc.isLoading = false;
      console.log(response.data);
      vc.reservations = response.data;
    }, function(error){
      console.log(error);
    });
  }

  function removeReservationData(reservationObj){
      apiService.removeReservation(reservationObj).then(function(response){
        console.log(response);
      vc.reservations.splice(vc.reservations.indexOf(reservationObj), 1);
      swalert.successAlert(response.data.message);
    }, function(error){
      console.log(error);
    });
  }

  function updateDetails(updatedData){
    apiService.updateReservation(updatedData).then(function(response){
      console.log(response);
      getAllReservations('*');
      swalert.successAlert(response.data.message);
    }, function(error){
      console.log(error);
      $ngConfirm({
          title: error.data.message,
          content: '',
          type: 'blue',
          animationBounce: 1.5
      });
    });
  }

  function getAllVenues(){
    vc.isLoading = true;
    apiService.getVenues().then(function(response){
      $timeout(function() {
        vc.isLoading = false;
      }, 300);
      vc.venues = response.data;
      vc.venueList = response.data;
      $scope.$emit('venueData', vc.venues);
    }, function(error){
      console.log(error);
    });
  }

  function deleteVenue(venue){
    apiService.deleteVenue(venue.venue_id).then(function(response){
      vc.venues.splice(vc.venues.indexOf(venue), 1);
      swalert.successAlert('Venue deleted');$ngC
    }, function(error){
      console.log(error);
      checkIntegrityError(error.status);
    })
  }

  function departments(){
    apiService.getDepartments().then(function(response){
      vc.departments = response.data;
      $scope.$emit('departmentsData', vc.departments);
    }, function(error){
      console.log(error);
    });
  }

  function convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return hours + ':' + minutes+':'+'00';
  }

  function tConvHour(time24) {
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h = (H % 12) || 12;
    h = (h < 10)?("0"+h):h;
    return h;
  };

  function tConvMin(time24) {
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h = (H % 12) || 12;
    h = (h < 10)?("0"+h):h;  
    return ts.substr(3, 2);
  };

  function checkIntegrityError(constraints){
    constraints == 500 ? 
    swalert.errorAlert('Cannot delete or update parent row. This Venue name is being use.') : swalert.errorAlert('Failed! retry again.');
  }
  
}]);


app.filter('fullDate', function(){
  return function(stringDate){
      var month = new Array();

      month[0] = "January"; month[1] = "February"; month[2] = "March"; 
      month[3] = "April";month[4] = "May"; month[5] = "June"; month[6] = "July";
      month[7] = "August"; month[8] = "September"; month[9] = "October";
      month[10] = "November"; month[11] = "December";

    var date = new Date(stringDate);
    return month[date.getMonth()+1]+' '+date.getDate()+', '+date.getFullYear();
  }
});

app.filter('timeFormat', function(){
  return function(stringDate){
        function tConv24(time24) {
          if(time24){
            var ts = time24;
            var H = +ts.substr(0, 2);
            var h = (H % 12) || 12;
            h = (h < 10)?("0"+h):h;
            var ampm = H < 12 ? " AM" : " PM";
            ts = h + ts.substr(2, 3) + ampm;
            return ts;
          }
        };

      return tConv24(stringDate);
  }
});
'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:viewVenueCtrl
 * @description
 * # viewVenueCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller('viewVenueCtrl',['$scope', '$rootScope', '$cookies',
  '$window', '$location', '$timeout', 'apiService',
  function ($scope, $rootScope, $cookies, $window, $location, $timeout, apiService) {

  var v = this;

  // Display View Details from Request
  $scope.$on('get_selected_reservation', function(val, obj){
    v.viewReservation = obj;
  });

}]);

app.filter('fullDate', function(){
	return function(stringDate){
  	var month = new Array();
    month[0] = "January"; month[1] = "February"; month[2] = "March"; 
    month[3] = "April";month[4] = "May"; month[5] = "June"; month[6] = "July";
    month[7] = "August"; month[8] = "September"; month[9] = "October";
    month[10] = "November"; month[11] = "December";
		var date = new Date(stringDate);
		return month[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear();
	}
});
'use strict';

/**
 * @ngdoc function
 * @name mytodoApp.controller:workCtrl
 * @description
 * # workCtrl
 * Controller of the PPMS
 */
var app = angular.module('myApp')
  app.controller( 'workCtrl',['$scope', '$rootScope', '$cookies', '$ngConfirm',
                  '$window', '$location', '$timeout', 'apiService', 'swalert',
  function ($scope, $rootScope, $cookies, $ngConfirm, $window, $location, $timeout, apiService, swalert) {

  var wc = this;
  var workId, w_deptId;
  var d = new Date();
  wc.statuses = ["Done", "Undone"];
  wc.itemData;
  wc.stats = true;
  getAllWorkReq();

  $scope.$on('emittedNewItem', function(val, obj){
    wc.workItems = obj;
    getAllWorkReq();
  });

  wc.editWork = function(work){
    if ($cookies.getObject('auth').userType != 1) {
      work.post_remarks != null ? wc.stats = true : wc.stats = false; 
    }
    else{
      wc.stats = true;
    }
    wc.workItems = work.items_requested[0];
    wc.request_num = work.request_number;
    wc.requestee = work.requestee;
    wc.purpose = work.purpose;
    wc.remarks = work.post_remarks;
    wc.selectedDepartment = work.department_name;
    wc.selectedStatus = work.work_status;
    wc.work_id = work.work_id;
    w_deptId = work.w_deptId;
    wc.updatingWork = true;
  }

  wc.updateItem = function(item){
    $scope.$emit('itemToBeUpdated', item);
  }

  wc.updateWorkDetails = function(){
   let updateWorkDetails = {
      'work_id': wc.work_id,
      'requestee': wc.requestee,
      'purpose': wc.purpose,
      'post_remarks': wc.remarks,
      'w_deptId': w_deptId,
      'w_userId': $cookies.getObject('auth').user_id,
      'work_status': wc.selectedStatus
    };
    updateWorkRequest(updateWorkDetails);
  }

  wc.cancelUpdate = function(){
    wc.updatingWork = false;
    wc.stats = false;
    wc.workItems = [];
    wc.request_num = "";
    wc.requestee = "";
    wc.purpose = "";
    wc.remarks = "";
    wc.selectedDepartment = "";
    wc.selectedStatus = "";
  }

  wc.removeItem = function(item){
    let workItemsId = {
      'work_items_id': item.work_items_id,
      'stock_id': item.stock_id,
      'requested_quantity': item.requested_quantity
    };

    wc.itemData = item;
    swalert.showAlert(workItemsId, deleteItemsFromWork);
  }

  wc.addItem = function(){
    $scope.$emit('work_id', {'work_id':wc.work_id});
  }

  function deleteItemsFromWork(itemWorkId){
    apiService.removeItemsFromWork(itemWorkId).then(function(response){
      wc.workItems.splice(wc.workItems.indexOf(wc.itemData), 1);
      $scope.$emit('EmitRefreshItems');
      swalert.successAlert("Item Removed");
    }, function(error){
      swalert.errorAlert("Failed!");
    });    
  }

  function getAllWorkReq(){
    apiService.getAllWorkRequest($cookies.getObject('auth').departmentId).then(function(response){
      wc.list_of_work = response.data;
      $timeout(function(){
        wc.loaded = true;
      }, 500);
    }, function(error){
        console.log(error);
    });
  }

  function updateWorkRequest(workDetails){
    apiService.updateRequestedWork(workDetails).then(function(response){
      getAllWorkReq();
      $ngConfirm('Request Updated');
    }, function(error){
        console.log(error);
    });
  }

}]);

app.directive('scholarStatus', function(){
    return {
      restrict: 'A',
      scope: true,
      link: function(scope, elem, attrs) {
        var stats = attrs.status;
          if(stats=="Undone"){
            elem.addClass('undone');
            elem[0].innerHTML = 'Undone';
          }
          else if(stats=="Done"){
            elem.addClass('done');
            elem[0].innerHTML = 'Done';
          }
      }
    }
 });