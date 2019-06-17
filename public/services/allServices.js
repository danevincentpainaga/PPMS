/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 41);
/******/ })
/************************************************************************/
/******/ ({

/***/ 41:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(42);


/***/ }),

/***/ 42:
/***/ (function(module, exports) {

app.factory('apiService', ['$http', '$cookies', '$rootScope', function ($http, $cookies, $rootScope) {
  return {
    validateLogin: function validateLogin(credData) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/login',
        data: credData,
        headers: {
          Accept: "application/json"
        }
      });
    },
    AuthenticatedUser: function AuthenticatedUser() {
      var status = $cookies.get('auth');
      if (status) {
        return true;
      } else {
        return false;
      }
    },
    addVenue: function addVenue(venueDetails) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/addVenue',
        data: venueDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    updateVenue: function updateVenue(updatedVenueDetails) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/updateVenue',
        data: updatedVenueDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    getReservations: function getReservations(reserveDate, departmentId, venueId) {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/getReservations/' + reserveDate + '/' + departmentId + '/' + venueId,
        cache: false,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    addReservation: function addReservation(reservationDetails) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/addReservation',
        data: reservationDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    updateReservation: function updateReservation(updatedDetails) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/updateReservation',
        data: updatedDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    removeReservation: function removeReservation(reservationObj) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/removeReservation',
        data: reservationObj,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    getVenues: function getVenues() {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/getVenues',
        cache: false,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    deleteVenue: function deleteVenue(venueId) {
      var config = {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        },
        params: {
          venue: venueId
        }
      };
      return $http.delete(baseUrl + 'api/deleteVenue', config);
    },
    validateEmail: function validateEmail(email) {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/validateEmail/' + email,
        cache: false,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    validateVenue: function validateVenue(venueName) {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/validateVenue/' + venueName,
        cache: false,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    validateDepartment: function validateDepartment(deptname) {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/validateDepartment/' + deptname,
        cache: false,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    getDepartments: function getDepartments() {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/getDepartments',
        cache: false,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    getUserTypes: function getUserTypes(id) {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/getUserTypes/' + id,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    addUser: function addUser(userDetails) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/addUser',
        data: userDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    updateUser: function updateUser(userDetails) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/updateUser',
        data: userDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    updatedPassword: function updatedPassword(credentials) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/updateUserPassword',
        data: credentials,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    resetPassword: function resetPassword(credentials) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/resetUserPassword',
        data: credentials,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    countUsers: function countUsers() {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/countUsers',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    getUsers: function getUsers() {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/getUsers',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    getProfile: function getProfile() {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/getProfile',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    deleteUsers: function deleteUsers(userId) {
      var config = {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        },
        params: {
          user_id: userId
        }
      };
      return $http.delete(baseUrl + 'api/deleteUsers', config);
    },
    updateDepartment: function updateDepartment(updatedDepartment) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/updateDepartment',
        data: updatedDepartment,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    addDepartment: function addDepartment(departmentName) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/addDepartment',
        data: departmentName,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    removeDepartment: function removeDepartment(departmentObj) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/removeDepartment',
        data: departmentObj,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    addStock: function addStock(stock) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/addStock',
        data: stock,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    addStockQty: function addStockQty(itemDetails) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/addStockQty',
        data: itemDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    deductStockQty: function deductStockQty(itemDetails) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/deductStockQty',
        data: itemDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    getItems: function getItems(id) {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/getItems/' + id,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    getAllStocks: function getAllStocks() {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/getAllStocks',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    countItems: function countItems() {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/countItems',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    saveRequestedItems: function saveRequestedItems(requestDetails) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/saveRequestedItems',
        data: requestDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    updateRequestedItems: function updateRequestedItems(requestDetails) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/updateRequestedItems',
        data: requestDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    addItemsToWork: function addItemsToWork(addedItems) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/addItemsToWork',
        data: addedItems,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    removeItemsFromWork: function removeItemsFromWork(itemDetails) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/removeItemsFromWork',
        data: itemDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    getRequestedItems: function getRequestedItems(rid) {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/getRequestedItems/' + rid,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    saveRequestedWork: function saveRequestedWork(requestDetails) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/saveRequestedWork',
        data: requestDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    updateRequestedWork: function updateRequestedWork(requestDetails) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/updateRequestedWork',
        data: requestDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    // getStocksPerDate: function(date){
    //   return $http({
    //     method:'GET',
    //     url: baseUrl+'api/getStocksPerDate/'+date,
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Accept": "application/json",
    //       Authorization : 'Bearer '+ $rootScope.token
    //     }
    //   });
    // },
    getStocksPerDate: function getStocksPerDate(filteredDate) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/getStocksPerDate',
        data: filteredDate,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    getRequestedItemsPerDate: function getRequestedItemsPerDate(date) {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/getRequestedItemsPerDate/' + date,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    getRequestedWorksPerDate: function getRequestedWorksPerDate(date) {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/getRequestedWorksPerDate/' + date,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    getAllWorkRequest: function getAllWorkRequest(wid) {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/getAllWorkRequest/' + wid,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    updateStocks: function updateStocks(stock) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/updateStocks',
        data: stock,
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    currentRequestNumber: function currentRequestNumber() {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/currentRequestNumber',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    }
  };
}]);

/***/ })

/******/ });