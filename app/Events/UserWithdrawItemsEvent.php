<?php

namespace App\Events;

use App\Models\SiteEvent;
use App\Models\Transaction;

class UserWithdrawItemsEvent extends Event
{
    public $transaction;

    /**
     * Create a new event instance.
     *
     * @param Transaction $transaction
     */
    public function __construct(Transaction $transaction)
    {
        $this->transaction = $transaction;
        SiteEvent::insert([
            'event_type' => substr(strrchr(__CLASS__, "\\"), 1),
            'event_id' => $transaction->id,
            'by_user' => $transaction->user_id
        ]);
    }
}
