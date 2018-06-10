<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use DB;
use App\department;

class departmentController extends Controller
{
   public function getDepartments(){
   	 return department::all();
   }

   public function updateDepartment(Request $request){
   	department::where('department_id', $request->input('department_id'))
   	->update(['department_name'=> $request->input('department_name')]);
   	return response()->json(['message'=>'Data Updated'], 200);
   }
}

