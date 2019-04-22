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
/******/ 	return __webpack_require__(__webpack_require__.s = 43);
/******/ })
/************************************************************************/
/******/ ({

/***/ 43:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(44);


/***/ }),

/***/ 44:
/***/ (function(module, exports) {

app.factory('swalert', ['$http', function ($http) {
  return {
    showAlert: function showAlert(obj, method) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No'
      }).then(function (result) {
        if (result.value) {
          method(obj);
        }
      });
    },
    successInfo: function successInfo(message, nofitificationType, timeExpire) {
      var time = void 0;
      timeExpire != undefined ? time = timeExpire : time = false;
      var Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: time
      });

      Toast.fire({
        type: nofitificationType,
        title: message
      });
    },
    successAlert: function successAlert(message) {
      Swal.fire({
        position: 'center',
        type: 'success',
        title: 'Success!',
        text: message,
        showConfirmButton: false,
        timer: 1600
      });
    },
    errorAlert: function errorAlert(message) {
      Swal.fire({
        allowOutsideClick: false,
        position: 'center',
        type: 'error',
        title: 'Error!',
        text: message,
        confirmButtonText: 'Ok'
      });
    },
    updateAlert: function updateAlert(obj, method) {
      Swal.fire({
        title: 'Update Details',
        text: "Proceed to update...",
        type: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No'
      }).then(function (result) {
        if (result.value) {
          method(obj);
        }
      });
    },
    saveAlert: function saveAlert(obj, method) {
      Swal.fire({
        title: 'Save Details',
        text: "Proceed to save...",
        type: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No'
      }).then(function (result) {
        if (result.value) {
          method(obj);
        }
      });
    }
  };
}]);

/***/ })

/******/ });