<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = "transaction_log";
    protected $primaryKey = 'id';
	public $timestamps = false;
    protected $dates = ['timestamp'];

    public const TYPE_ITEM_DEPOSIT = 1;         // *Items deposited
    public const TYPE_ITEM_WITHDRAW = 2;        // *Items withdrawn
    public const TYPE_STORE_BUY = 3;            // *Store purchase
    public const TYPE_STORE_SELL = 4;           // Re-sell store purchase (not used)
    public const TYPE_BET_PLACE = 5;            // *Place a bet
    public const TYPE_BET_CANCEL = 6;           // *Cancel a bet (not used)
    public const TYPE_BET_PAYOUT = 7;           // *Payout from bet win
    public const TYPE_CREDIT_COMP = 8;          // *Free credits granted
    public const TYPE_CREDIT_REFUND = 9;        // Credit refund (granted)

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function deposits()
    {
        return $this->hasMany(TradeDeposit::class, 'offer_id', 'offer');
    }
    public function withdraws()
    {
        return $this->hasMany(TradeWithdraw::class, 'offer_id', 'offer');
    }


}
