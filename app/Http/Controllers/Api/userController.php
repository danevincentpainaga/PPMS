<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use DB;
use \Crypt;
use Auth;

use App\User;
use App\client_reservation;
use App\department;

class userController extends Controller
{
  public $successStatus = 200;

   public function addUser(Request $request){
          $input = $request->all();
          $input['password'] = bcrypt($input['password']);
          $user = User::create($input);
          $success['token'] =  $user->createToken('MyApp')->accessToken;
          $success['name'] =  $user->name;

          return response()->json(['success'=>$success], $this->successStatus);

   }

    public function getUsers()
    {
      $users = DB::table('users')//->where('id', '!=', Auth::id())
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

    public function countUsers(){
      $userCount = User::count();
      $departmentCount = department::count();
      $clientReservationCount =client_reservation::count();

      $counts = ['userCount'=> $userCount, 'departmentCount'=> $departmentCount, 'client_reservation'=> $clientReservationCount ];
      return $counts;
    }
}

