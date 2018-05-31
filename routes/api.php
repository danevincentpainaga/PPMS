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
	Route::get('getDepartments', 'API\reservationController@getDepartments');
	Route::get('getUserTypes', 'API\reservationController@getUserTypes');
	Route::get('getUsers', 'API\userController@getUsers');
	Route::get('getReservations', 'API\reservationController@getReservations');
	Route::post('addVenue', 'API\reservationController@addVenue');
	Route::post('addUser', 'API\userController@addUser');
	Route::post('addReservation', 'API\reservationController@addReservation');
	Route::delete('deleteVenue', 'API\reservationController@deleteVenue');
	Route::delete('deleteUsers', 'API\userController@deleteUsers');
});
