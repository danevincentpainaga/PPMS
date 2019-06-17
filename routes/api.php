<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('login', 'API\PassportController@login');
Route::post('register', 'API\PassportController@register');
Route::group(['middleware'=>'auth:api'], function(){
	Route::get('get-details', 'API\PassportController@getDetails');
	Route::get('getVenues', 'API\reservationController@getVenues');
	Route::get('validateDepartment/{departmentName}', 'API\departmentController@validateDepartment');
	Route::get('validateVenue/{venueName}', 'API\reservationController@validateVenue');
	Route::get('validateEmail/{email}', 'API\userController@validateEmail');
	Route::get('getDepartments', 'API\reservationController@getDepartments');
	Route::get('getUserTypes/{id}', 'API\reservationController@getUserTypes');
	Route::get('getProfile', 'API\userController@getProfile');
	Route::get('getUsers', 'API\userController@getUsers');
	Route::get('getReservations/{reservedate}/{departmentId}/{venueId?}/', 'API\reservationController@getReservations');
	// Route::get('approvedReservations/{reservedate}', 'API\reservationController@approvedReservations');
	Route::get('getDepartments', 'API\departmentController@getDepartments');
	Route::get('countUsers', 'API\userController@countUsers');
	Route::get('getItems/{id}', 'API\inventoryController@getItems');
	Route::get('getAllStocks', 'API\inventoryController@getAllStocks');
	Route::get('countItems', 'API\inventoryController@countItems');
	Route::get('currentRequestNumber', 'API\maintenanceController@currentRequestNumber');
	Route::get('getRequestedItems/{rid}', 'API\maintenanceController@getRequestedItems');
	Route::get('getAllWorkRequest/{wid}', 'API\maintenanceController@getAllWorkRequest');
	// Route::get('getStocksPerDate/{date?}', 'API\reportController@getStocksPerDate');
	Route::post('getStocksPerDate', 'API\reportController@getStocksPerDate');
	Route::get('getRequestedWorksPerDate/{date?}', 'API\reportController@getRequestedWorksPerDate');
	Route::get('getRequestedItemsPerDate/{date?}', 'API\reportController@getRequestedItemsPerDate');
	// Route::post('approvedReservationsDetails', 'API\reservationController@approvedReservationsDetails');
	Route::post('updateReservation', 'API\reservationController@updateReservation');
	Route::post('addVenue', 'API\reservationController@addVenue');
	Route::post('updateVenue', 'API\reservationController@updateVenue');
	Route::post('removeReservation', 'API\reservationController@removeReservation');
	// Route::post('removeApprovedReservation', 'API\reservationController@removeApprovedReservation');
	Route::post('addUser', 'API\userController@addUser');
	Route::post('updateUser', 'API\userController@updateUser');
	Route::post('updateUserPassword', 'API\userController@updateUserPassword');
	Route::post('resetUserPassword', 'API\userController@resetUserPassword');
	Route::post('addReservation', 'API\reservationController@addReservation');
	Route::post('addDepartment', 'API\departmentController@addDepartment');
	Route::post('updateDepartment', 'API\departmentController@updateDepartment');
	Route::post('removeDepartment', 'API\departmentController@removeDepartment');
	Route::post('addStock', 'API\inventoryController@addStock');
	Route::post('addStockQty', 'API\inventoryController@addStockQty');
	Route::post('updateStocks', 'API\inventoryController@updateStocks');
	Route::post('deductStockQty', 'API\inventoryController@deductStockQty');
	Route::post('saveRequestedItems', 'API\maintenanceController@saveRequestedItems');
	Route::post('updateRequestedItems', 'API\maintenanceController@updateRequestedItems');
	Route::post('updateRequestedWork', 'API\maintenanceController@updateRequestedWork');
	Route::post('saveRequestedWork', 'API\maintenanceController@saveRequestedWork');
	Route::post('removeItemsFromWork', 'API\maintenanceController@removeItemsFromWork');
	Route::post('addItemsToWork', 'API\maintenanceController@addItemsToWork');
	Route::delete('deleteVenue', 'API\reservationController@deleteVenue');
	Route::delete('deleteUsers', 'API\userController@deleteUsers');
});

