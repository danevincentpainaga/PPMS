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