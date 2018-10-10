<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    public $incrementing = false;
    protected $guarded = [];
    protected $hidden = ['token', 'ip_address'];

    public $timestamps = false;
    protected $dates = ['created_at', 'first_login_at', 'last_login_at'];

    public function getDollarsAttribute()
    {
        return number_format($this->attributes['credits']/100, 2, '.', ' ');
    }


    public function bets()
    {
        return $this->hasMany('App\Models\Bet');
    }
}
