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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

app.factory('apiService', ['$http', '$cookies', '$rootScope', function ($http, $cookies, $rootScope) {
  var _ref;

  return _ref = {
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
    getReservations: function getReservations(reserveDate) {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/getReservations/' + reserveDate,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    approvedReservations: function approvedReservations(approvedDate) {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/approvedReservations/' + approvedDate,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    approvedReservationsDetails: function approvedReservationsDetails(approvedDetails) {
      return $http({
        method: 'POST',
        url: baseUrl + 'api/approvedReservationsDetails',
        data: approvedDetails,
        headers: {
          "Content-Type": "application/json",
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
    getVenues: function getVenues() {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/getVenues',
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
    getDepartments: function getDepartments() {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/getDepartments',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Bearer ' + $rootScope.token
        }
      });
    },
    getUserTypes: function getUserTypes() {
      return $http({
        method: 'GET',
        url: baseUrl + 'api/getUserTypes',
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
    }
  }, _defineProperty(_ref, 'getDepartments', function getDepartments() {
    return $http({
      method: 'GET',
      url: baseUrl + 'api/getDepartments',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: 'Bearer ' + $rootScope.token
      }
    });
  }), _defineProperty(_ref, 'updateDepartment', function updateDepartment(updatedDepartment) {
    return $http({
      method: 'POST',
      url: baseUrl + 'api/updateDepartment',
      data: updatedDepartment,
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + $rootScope.token
      }
    });
  }), _ref;
}]);

/***/ })

/******/ });