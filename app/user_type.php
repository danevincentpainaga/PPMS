<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class user_type extends Model
{	
	public $timestamps = false;
    protected $primaryKey = 'usertype_id';
    protected $fillable = ['usertype_id', 'userType']; 
}
