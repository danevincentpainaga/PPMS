<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use DB;
use App\stocks;
use App\item;

class inventoryController extends Controller
{
   public function countItems(){
      return stocks::count();
   }

   public function getItems($id){
   	return stocks::skip($id)->take(10)->get();
   }

   public function getAllStocks(){
      return stocks::all();
   }

   public function addStock(Request $request){
      $exist = stocks::where(
                              [
                                 'item_name' => $request->input('item_name'),
                                 'description' => $request->input('description')
                              ]
                            )->count();
      if($exist > 0){
         return response()->json(['message'=>'Item Already Exist!'], 403); 
      }
      else
      {
         stocks::create($request->all());
         return response()->json(['message'=>'Item Added!'], 200); 
      }
   }

   public function updateStocks(Request $request){
   		stocks::where('stock_id', $request->input('stock_id'))
   				->update([
                           'item_name' => $request->input('item_name'),
                           'description' => $request->input('description')
                        ]);

   		return response()->json(['message'=>'Item Updated'], 200);
   }

   public function addStockQty(Request $request){
      stocks::where('stock_id', $request->input('stock_id'))
            ->update([
                        'qty' => $request->input('newQty')
                     ]);

      return response()->json(['message' => 'Quantity Updated'], 200);
   }

   public function deductStockQty(Request $request){
      stocks::where('stock_id', $request->input('stock_id'))
            ->update([
                        'qty' => $request->input('newQty')
                     ]);

      return response()->json(['message' => 'Quantity Updated'], 200);
   }
}


    // public function getUserIds($id){
    //     $user = DB::table('users')->offset($id)->limit(10)->get();
    //     return $user;
    // }
