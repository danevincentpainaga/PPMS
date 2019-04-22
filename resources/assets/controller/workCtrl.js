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
      console.log(error);
      swalert.errorAlert("Failed!");
    });    
  }

  function getAllWorkReq(){
    apiService.getAllWorkRequest($cookies.getObject('auth').departmentId).then(function(response){
      wc.list_of_work = response.data;
      console.log(wc.list_of_work);
      $timeout(function(){
        wc.loaded = true;
      }, 500);
    }, function(error){
        console.log(error);
    });
  }

  function updateWorkRequest(workDetails){
    apiService.updateRequestedWork(workDetails).then(function(response){
      console.log(response);
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