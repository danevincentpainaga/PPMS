<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class work extends Model
{
	public $timestamps = false;
    protected $primaryKey = 'work_id';
    protected $fillable = [
    						'work_id', 'request_number', 'requestee', 'purpose', 'w_deptId', 'w_userId',
    						'pre_remarks', 'post_remarks', 'date_requested', 'work_status'
						  ];
}
