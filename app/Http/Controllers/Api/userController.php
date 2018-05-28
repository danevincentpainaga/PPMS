<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use DB;
use \Crypt;
use Auth;

use App\User;

class userController extends Controller
{
    
   public function addUser(Request $request){
   	   User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
            'usertypeId' => $request->input('usertypeId'),
            'departmentId' => $request->input('departmentId'),
        ]);

   	   return response()->json(['message'=> 200]);   
   }

    public function getUsers()
    {
      $users = DB::table('users')->where('id', '!=', Auth::id())
      ->join('user_types', 'users.usertypeId', '=', 'user_types.usertype_id')
      ->join('departments', 'users.departmentId', '=', 'departments.department_id')
      ->select('users.id', 'users.name', 'users.email', 'users.created_at', 'user_types.usertype_id', 'user_types.userType', 'departments.department_name')
      ->orderBy('id')
      ->get();

      return $users;  
    }

    public function deleteUsers(Request $request){
      $deleteUser = User::destroy($request->input('user_id'));
      return $deleteUser;
    }
}

