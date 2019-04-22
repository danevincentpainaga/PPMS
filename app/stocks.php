<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class stocks extends Model
{
	public $timestamps = false;
    protected $primaryKey = 'stock_id';
    protected $fillable = ['item_name', 'description', 'qty', 'date_updated'];
}
