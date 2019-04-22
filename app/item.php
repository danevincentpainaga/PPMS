<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class item extends Model
{
    protected $primaryKey = 'items_id';
    public $timestamps = false;
    protected $fillable = [
    						'request_number', 'requestee', 'request_qty', 'i_deptId', 'stockId',
    						'i_userId', 'date_requested', 'pre_remarks', 'post_remarks'
						  ];
}
