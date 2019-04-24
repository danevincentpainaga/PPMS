<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use DB;

use App\user;
use App\venue;
use App\department;
use App\user_type;
use App\client_reservation;
use App\client;

class reservationController extends Controller
{
   
    public function validateVenue($venueName){
        $exist = venue::where('venue_name', $venueName)->count(); 
        if($exist > 0){
           return response()->json(['message'=>'Venue Already Exist!'], 403);
        }
        else{
           return response()->json(['message'=>'passed'], 200);
        }
     }

    public function addVenue(Request $request)
    {
        $venues[] = $request->all();
        
        foreach ($venues as $venue) {
            venue::create($venue);
        }
 
        return $venues;
    }

    public function getVenues()
    {
        $allVenues = venue::orderBy('venue_name')->get();
        return $allVenues;
    }

    public function deleteVenue(Request $request)
    {
        $deletedVenue = venue::destroy($request->input('venue'));
        return $deletedVenue;
    }

    public function getDepartments()
    {
        $alldepartments = department::orderBy('department_name')->get();
        return $alldepartments;
    }

    public function getUserTypes($id)
    {
      if($id == 1){
        $allUser_type = user_type::all();
      }
      else
      {
        $allUser_type = user_type::all()->except(1);
      }
      return $allUser_type;
    }

    public function addReservation(Request $request){
      $reservationExist = client_reservation::where('start_date', '>=', $request->input('start_date'))
                           ->where('end_date', '<=', $request->input('end_date'))
                           ->where('venueId', '=', $request->input('venueId'))
                           ->get();

      if(count($reservationExist) > 0 ){
        return response()->json(['message'=>'Requested Date Not Available'], 403); 
      }
      else
      {

        $requestDetails = [
          'name' => $request->input('requester_name'),
          'purpose' => $request->input('purpose'),
          'department' => $request->input('departmentId'),
          'venue' => $request->input('venueId'),
          'startDate' => $request->input('start_date'),
          'startTime' => $request->input('start_time'),
          'endDate' => $request->input('end_date'),
          'endTime' => $request->input('end_time'),
          'date_created' => $request->input('requested_date'),
        ];

        $name = $request->input('requester_name');

        $client = null;
        $clientId = null;
        $client_name = DB::table('clients')
                    ->where('client_name', 'like', "%{$name}%")
                    ->get();
        foreach ($client_name as $key => $value) {
            $client = $value->client_name;
            $clientId = $value->client_id;
        };

        if($client){
          $this->saveReservation($requestDetails, $clientId);
        }else{
          $this->createClientAndReserve($name);
        }   
      }

    }

    public function saveReservation($rdetails, $clientId){
            $cl = new client_reservation;
            $cl->clientId = $clientId;
            $cl->purpose = $rdetails['purpose'];
            $cl->departmentId = $rdetails['department'];
            $cl->venueId = $rdetails['venue'];
            $cl->statusId = 1;
            $cl->start_date = $rdetails['startDate'];
            $cl->start_time = $rdetails['startTime'];
            $cl->end_date = $rdetails['endDate'];
            $cl->end_time = $rdetails['endTime'];
            $cl->date_created = $rdetails['date_created'];
            $cl->save();
            return response()->json(['message'=>'Request Sent'], 200);
    }
    
    public function createClientAndReserve($name){
            $c = new client;
            $c->client_name = $name;
            $c->save();
            $cl = new client_reservation;
            $cl->clientId = $c->client_id;
            $cl->purpose = $purpose;
            $cl->departmentId = $department;
            $cl->venueId = $venue;
            $cl->statusId = 1;
            $cl->start_date = $startDate;
            $cl->start_time = $startTime;
            $cl->end_date = $endDate;
            $cl->end_time = $endTime;
            $cl->date_created = $date_created;
            $cl->save();
            return response()->json(['message'=>'Request Sent'], 200);
    }

    public function getReservations($reserveDate, $departmentId, $venue = null)
    {
        $reservations = null;

        if($reserveDate === '*' && is_null($venue) && $departmentId == 1){
        $reservations = DB::table('client_reservations')->where('statusId', '=', 1)
          ->join('clients', 'client_reservations.clientId', '=', 'clients.client_id')
          ->join('departments', 'client_reservations.departmentId', '=', 'departments.department_id')
          ->join('venues', 'client_reservations.venueId', '=', 'venues.venue_id')
          ->join('statuses', 'client_reservations.statusId', '=', 'statuses.status_id')
          ->select('client_reservations.*', 'clients.*', 'departments.department_name', 'venues.venue_name', 'statuses.status')
          ->orderBy('start_date')
          ->get();
        }
        else if($reserveDate === '*' && !is_null($venue) && $departmentId == 1){
        $reservations = DB::table('client_reservations')
        ->where('statusId', '=', 1)
        ->where('venueId', '=', $venue)
          ->join('clients', 'client_reservations.clientId', '=', 'clients.client_id')
          ->join('departments', 'client_reservations.departmentId', '=', 'departments.department_id')
          ->join('venues', 'client_reservations.venueId', '=', 'venues.venue_id')
          ->join('statuses', 'client_reservations.statusId', '=', 'statuses.status_id')
          ->select('client_reservations.*', 'clients.*', 'departments.department_name', 'venues.venue_name', 'statuses.status')
          ->orderBy('start_date')
          ->get();
        }
        else if($reserveDate != '*' && is_null($venue) && $departmentId == 1){
        $reservations = DB::table('client_reservations')
        ->where('statusId', '=', 1)
        ->where('start_date', '=', $reserveDate)
          ->join('clients', 'client_reservations.clientId', '=', 'clients.client_id')
          ->join('departments', 'client_reservations.departmentId', '=', 'departments.department_id')
          ->join('venues', 'client_reservations.venueId', '=', 'venues.venue_id')
          ->join('statuses', 'client_reservations.statusId', '=', 'statuses.status_id')
          ->select('client_reservations.*', 'clients.*', 'departments.department_name', 'venues.venue_name', 'statuses.status')
          ->orderBy('start_date')
          ->get();
        }
        else if($reserveDate != '*' && !is_null($venue) && $departmentId == 1){
        $reservations = DB::table('client_reservations')
        ->where('statusId', '=', 1)
        ->where('start_date', '=', $reserveDate)
        ->where('venueId', '=', $venue)
          ->join('clients', 'client_reservations.clientId', '=', 'clients.client_id')
          ->join('departments', 'client_reservations.departmentId', '=', 'departments.department_id')
          ->join('venues', 'client_reservations.venueId', '=', 'venues.venue_id')
          ->join('statuses', 'client_reservations.statusId', '=', 'statuses.status_id')
          ->select('client_reservations.*', 'clients.*', 'departments.department_name', 'venues.venue_name', 'statuses.status')
          ->orderBy('start_date')
          ->get();
        }
        else if($reserveDate === '*' && is_null($venue) && $departmentId != 1){
        $reservations = DB::table('client_reservations')
        ->where('statusId', '=', 1)
        ->where('departmentId', '=', $departmentId)
            //->where('id', '=', Auth::id())
          ->join('clients', 'client_reservations.clientId', '=', 'clients.client_id')
          ->join('departments', 'client_reservations.departmentId', '=', 'departments.department_id')
          ->join('venues', 'client_reservations.venueId', '=', 'venues.venue_id')
          ->join('statuses', 'client_reservations.statusId', '=', 'statuses.status_id')
          ->select('client_reservations.*', 'clients.*', 'departments.department_name', 'venues.venue_name', 'statuses.status')
          ->orderBy('start_date')
          ->get();
        }
        else if($reserveDate === '*' && !is_null($venue) && $departmentId != 1){
        $reservations = DB::table('client_reservations')
        ->where('statusId', '=', 1)
        ->where('venueId', '=', $venue)
        ->where('departmentId', '=', $departmentId)
            //->where('id', '=', Auth::id())
          ->join('clients', 'client_reservations.clientId', '=', 'clients.client_id')
          ->join('departments', 'client_reservations.departmentId', '=', 'departments.department_id')
          ->join('venues', 'client_reservations.venueId', '=', 'venues.venue_id')
          ->join('statuses', 'client_reservations.statusId', '=', 'statuses.status_id')
          ->select('client_reservations.*', 'clients.*', 'departments.department_name', 'venues.venue_name', 'statuses.status')
          ->orderBy('start_date')
          ->get();
        }
        else if($reserveDate != '*' && is_null($venue) && $departmentId != 1){
        $reservations = DB::table('client_reservations')
        ->where('statusId', '=', 1)
        ->where('start_date', '=', $reserveDate)
        ->where('departmentId', '=', $departmentId)
          ->join('clients', 'client_reservations.clientId', '=', 'clients.client_id')
          ->join('departments', 'client_reservations.departmentId', '=', 'departments.department_id')
          ->join('venues', 'client_reservations.venueId', '=', 'venues.venue_id')
          ->join('statuses', 'client_reservations.statusId', '=', 'statuses.status_id')
          ->select('client_reservations.*', 'clients.*', 'departments.department_name', 'venues.venue_name', 'statuses.status')
          ->orderBy('start_date')
          ->get();
        }
        else if($reserveDate != '*' && !is_null($venue) && $departmentId != 1){
        $reservations = DB::table('client_reservations')
        ->where('statusId', '=', 1)
        ->where('start_date', '=', $reserveDate)
        ->where('venueId', '=', $venue)
        ->where('departmentId', '=', $departmentId)
          ->join('clients', 'client_reservations.clientId', '=', 'clients.client_id')
          ->join('departments', 'client_reservations.departmentId', '=', 'departments.department_id')
          ->join('venues', 'client_reservations.venueId', '=', 'venues.venue_id')
          ->join('statuses', 'client_reservations.statusId', '=', 'statuses.status_id')
          ->select('client_reservations.*', 'clients.*', 'departments.department_name', 'venues.venue_name', 'statuses.status')
          ->orderBy('start_date')
          ->get();
        }

      return $reservations;  
    }

    public function updateReservation(Request $request){
        $updated = client::where('client_id', $request->input('client_id') )
                   ->update(['client_name' => $request->input('requester_name') ]);
        if(!$updated)
        {
            return response()->json(['message'=>'Failed! try Again'], 401);
        }
        else
        {
            $newUpdateDates = client_reservation::where('client_reservation_id', $request->input('client_reservation_id') )
            ->update(
                [
                    'venueId' => $request->input('venueId'), 
                    'start_date' => $request->input('start_date'), 
                    'start_time' => $request->input('start_time'), 
                    'end_date' => $request->input('end_date'), 
                    'end_time' => $request->input('end_time'), 
                    'purpose' => $request->input('purpose')
                ]
            );
            return response()->json(['message'=>'Data Updated'], 200);
        }
    }

    public function removeReservation(Request $request){
        client_reservation::destroy($request->input('client_reservation_id'));
        client::destroy($request->input('client_id'));
        return response()->json(['message'=>'Reservation request successfully Delete!'], 200);
    }

    public function updateVenue(Request $request){
        venue::where('venue_id', $request->input('venue_id') )
        ->update(['venue_name' => $request->input('venue_name') ]);

        return response()->json(['message'=>'Data Updated'], 200);
    }
}
