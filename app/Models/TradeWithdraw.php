<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TradeWithdraw extends Model
{
    protected $table = "trade_withdraw";
    protected $primaryKey = 'id';
	public $timestamps = false;
}
