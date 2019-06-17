<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use DB;
use App\stocks;
use App\department;
use App\item;
use App\work;
use App\request_id_number;

class reportController extends Controller
{
  //  public function getStocksPerDate($date_updated = null){
  //   if($date_updated != 'null'){
  //     return stocks::where('date_updated', $date_updated)->get();
  //   }
  //   else{
  //     return stocks::all(); 
  //   }
  // }

  public function getStocksPerDate(Request $request){
    if($request->startdate != "" && $request->enddate != ""){
      return stocks::whereBetween('date_updated', [$request->startdate, $request->enddate])->get();
    }
    else
    {
      return stocks::all(); 
    }
  }

  public function getRequestedItemsPerDate($start_date = null){
    if($start_date != 'null'){
        $reservations = DB::table('client_reservations')->where('start_date', '=', $start_date )
        ->join('clients', 'client_reservations.clientId', '=', 'clients.client_id')
        ->join('departments', 'client_reservations.departmentId', '=', 'departments.department_id')
        ->join('venues', 'client_reservations.venueId', '=', 'venues.venue_id')
        ->join('statuses', 'client_reservations.statusId', '=', 'statuses.status_id')
        ->orderBy('client_reservation_id', 'DESC')
        ->get();  
    }
    else{
        $reservations = DB::table('client_reservations')
        ->join('clients', 'client_reservations.clientId', '=', 'clients.client_id')
        ->join('departments', 'client_reservations.departmentId', '=', 'departments.department_id')
        ->join('venues', 'client_reservations.venueId', '=', 'venues.venue_id')
        ->join('statuses', 'client_reservations.statusId', '=', 'statuses.status_id')
        ->orderBy('client_reservation_id', 'DESC')
        ->get();   
    }
    return $reservations;
   }
   
  public function getRequestedWorksPerDate($date_updated = null){
    if($date_updated != 'null'){
        $requestedWork = DB::table('works')->where('date_requested', '=', $date_updated )
          ->join('departments', 'works.w_deptId', '=', 'departments.department_id')
          ->join('users', 'works.w_userId', '=', 'users.id')
          ->orderBy('work_id')
          ->get();  
    }
    else{
      $requestedWork = DB::table('works')
        ->join('departments', 'works.w_deptId', '=', 'departments.department_id')
        ->join('users', 'works.w_userId', '=', 'users.id')
        ->orderBy('date_requested')
        ->get();  
    }
    return $requestedWork;
   }
}

