<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Proxy extends Model
{
    protected $primaryKey = null;
    public $timestamps = false;

    protected $dates = [
        'created_at'
    ];
}
