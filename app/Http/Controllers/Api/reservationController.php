<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\user;
use App\venue;
use App\department;
use App\user_type;

class reservationController extends Controller
{
   
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
        $allVenues = venue::all();
        return $allVenues;
    }

    public function deleteVenue(Request $request)
    {
        $deletedVenue = venue::destroy($request->input('venue'));
        return $deletedVenue;
    }

    public function getDepartments()
    {
        $alldepartments = department::all();
        return $alldepartments;
    }

    public function getUserTypes()
    {
        $allUser_type = user_type::all()->except(1);
        return $allUser_type;
    }
}
