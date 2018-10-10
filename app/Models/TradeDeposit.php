<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TradeDeposit extends Model
{
    protected $table = "trade_deposit";
    protected $primaryKey = 'id';
	public $timestamps = false;
}
