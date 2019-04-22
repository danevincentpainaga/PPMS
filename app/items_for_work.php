<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class items_for_work extends Model
{
    protected $primaryKey = 'work_items_id';
    public $timestamps = false;
    protected $fillable = [
    						'worksId', 'work_stocks_id', 'requested_quantity'
						  ];
}
