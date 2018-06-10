<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class status extends Model
{
    protected $primaryKey = 'status_id';
    protected $fillable = ['status']; 
}
