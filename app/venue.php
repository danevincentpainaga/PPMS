<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class venue extends Model
{
    protected $primaryKey = 'venue_id';
    protected $fillable = ['venue_name', 'user_id', 'created_at', 'updated_at']; 
}
