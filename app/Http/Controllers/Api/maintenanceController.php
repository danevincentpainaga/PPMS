<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use DB;
use App\department;
use App\item;
use App\work;
use App\request_id_number;
use App\items_for_work;

class maintenanceController extends Controller
{
   public function getRequestedItems($rid){
        if($rid == 1){
            $requestedItems = DB::table('items')
              ->join('departments', 'items.i_deptId', '=', 'departments.department_id')
              ->join('stocks', 'items.stockId', '=', 'stocks.stock_id')
              ->join('users', 'items.i_userId', '=', 'users.id')
              ->select('items.*', 'departments.*', 'stocks.*', 'users.*')
              ->orderBy('date_requested')
              ->get();  
        }
        else{
              $requestedItems = DB::table('items')->where('i_deptId', '=', $rid )
              ->join('departments', 'items.i_deptId', '=', 'departments.department_id')
              ->join('stocks', 'items.stockId', '=', 'stocks.stock_id')
              ->join('users', 'items.i_userId', '=', 'users.id')
              ->select('items.*', 'departments.*', 'stocks.*', 'users.*')
              ->orderBy('date_requested')
              ->get();  
        }
        return $requestedItems;
   }

   public function getAllWorkRequest($wid){
        if($wid == 1){
            $requestedWork = DB::table('works')
              ->join('departments', 'works.w_deptId', '=', 'departments.department_id')
              ->join('users', 'works.w_userId', '=', 'users.id')
              ->orderBy('work_id', 'DESC')
              ->get();  
        }
        else{
              $requestedWork = DB::table('works')->where('w_deptId', '=', $wid )
              ->join('departments', 'works.w_deptId', '=', 'departments.department_id')
              ->join('users', 'works.w_userId', '=', 'users.id')
              ->orderBy('work_id', 'DESC')
              ->get();  
        }       

      $newWorkList = [];
      foreach ($requestedWork as $key => $work) {
        $workList = [
          'work_id'=> $work->work_id,
          'request_number'=> $work->request_number,
          'requestee'=> $work->requestee,
          'purpose'=> $work->purpose,
          'w_deptId'=> $work->w_deptId,
          'w_userId'=> $work->w_userId,
          'post_remarks'=> $work->post_remarks,
          'date_requested'=> $work->date_requested,
          'work_status'=> $work->work_status,
          'department_name'=> $work->department_name,
          'items_requested'=> $this->getItemsPerWork($work->work_id)

        ];
        array_push($newWorkList, $workList);
      }
        return $newWorkList;
   }

   public function getItemsPerWork($work_id){
      $result[] = DB::table('items_for_works')->where('worksId', '=', $work_id )
      ->join('works', 'works.work_id', '=', 'items_for_works.worksId')
      ->join('stocks', 'items_for_works.work_stocks_id', '=', 'stocks.stock_id')
      ->get(); 
      return $result;
   }

   public function saveRequestedItems(Request $request){
        request_id_number::where('request_id', $request->input('request_id') )
        ->update(['request_num' => $request->input('request_number') ]);

        $itemsForWorks = [];

        $items = [
                    'request_number' => $request->input('request_number'),
                    'requestee' => $request->input('requestee'),
                    // 'request_qty' => $request->input('request_qty'),
                    'w_deptId' => $request->input('w_deptId'),
                    // 'stockId' => $request->input('stockId'),
                    'w_userId' => $request->input('w_userId'),
                    'purpose' => $request->input('purpose'),
                    'post_remarks' => $request->input('post_remarks'),
                    'date_requested' => $request->input('date_requested'),
                    'work_status' => $request->input('work_status'),
                 ];

        $work = work::create($items);

        if(sizeof($request->input('item_requested')) > 0){
          foreach ($request->input('item_requested') as $key => $item) {
              $itemDetails = [
                'worksId' => $work->work_id,
                'work_stocks_id' => $item['stock_id'],
                'requested_quantity' => $item['qty']
              ];
              items_for_work::create($itemDetails);
          }

          if(!empty($work)){
            foreach ($request->input('item_requested') as $key => $item) {
                DB::table('stocks')
                ->where('stock_id', $item['stock_id'])
                ->decrement('qty', $item['qty']);
            }
            return $request->input('item_requested');
          }
        }
        return response()->json(['message'=>'Work request Sent'], 200);
   }

   public function updateRequestedItems(Request $request){

        items_for_work::where('work_items_id', $request->input('work_items_id'))
        ->update(
              [
                'worksId' => $request->input('work_id'),
                'work_stocks_id' => $request->input('newStockId'),
                'requested_quantity' => $request->input('newQty')
              ]
        );

        if($request->input('oldStockId') == $request->input('newStockId')){
          if($request->input('oldQty') > $request->input('newQty')){
              $newQty = $request->input('oldQty') - $request->input('newQty');
              DB::table('stocks')
              ->where('stock_id', $request->input('newStockId'))
              ->increment('qty', $newQty);
          }
          else if($request->input('oldQty') < $request->input('newQty')){
              $newQty = $request->input('newQty') - $request->input('oldQty');
              DB::table('stocks')
              ->where('stock_id', $request->input('newStockId'))
              ->decrement('qty', $newQty);
          }
        }
        else{
            DB::table('stocks')
            ->where('stock_id', $request->input('oldStockId'))
            ->increment('qty', $request->input('oldQty'));
            DB::table('stocks')
            ->where('stock_id', $request->input('newStockId'))
            ->decrement('qty', $request->input('newQty'));
        }

        return $this->getItemsPerWork($request->input('work_id'));

        // return response()->json(['message'=>'Item Updated'], 200);
   }

   public function saveRequestedWork(Request $request){
        request_id_number::where('request_id', $request->input('request_id') )
        ->update(['request_num' => $request->input('request_number') ]);

        $work = [
                    'request_number' => $request->input('request_number'),
                    'requestee' => $request->input('requestee'),
                    'purpose' => $request->input('purpose'),
                    'w_deptId' => $request->input('w_deptId'),
                    'w_userId' => $request->input('w_userId'),
                    'pre_remarks' => $request->input('pre_remarks'),
                    'post_remarks' => $request->input('post_remarks'),
                    'date_updated' => $request->input('date_updated')
                 ];

        return work::create($work);
   }

   public function updateRequestedWork(Request $request){
        work::where('work_id', $request->input('work_id'))
        ->update(
              [
                    'requestee' => $request->input('requestee'),
                    'purpose' => $request->input('purpose'),
                    'post_remarks' => $request->input('post_remarks'),
                    'work_status' => $request->input('work_status'),
              ]
        );

        return response()->json(['message'=>'Work Request Updated'], 200);
   }

   public function addItemsToWork(Request $request){
      foreach ($request->all() as $key => $item) {
          $workId = $item['work_id'];
          $addedItems = [
            'worksId' => $item['work_id'],
            'work_stocks_id' => $item['stock_id'],
            'requested_quantity' => $item['qty']
          ];
          items_for_work::create($addedItems);
          DB::table('stocks')
          ->where('stock_id', $item['stock_id'])
          ->decrement('qty', $item['qty']);
      }
      return $this->getItemsPerWork($workId);
   }

   public function currentRequestNumber(){
      return request_id_number::all();
   }

   public function removeItemsFromWork(Request $request){
      $deletedItem = items_for_work::destroy($request->input('work_items_id'));
      if($deletedItem > 0){
        DB::table('stocks')
        ->where('stock_id', $request->input('stock_id'))
        ->increment('qty', $request->input('requested_quantity'));
        return response()->json(['message'=>'Item Removed'], 200);  
      }
      else{
        return response()->json(['message'=>'Failed try again'], 401);
      }
   }
}

