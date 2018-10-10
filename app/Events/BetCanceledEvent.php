<?php

namespace App\Events;

use App\Models\Bet;
use App\Models\SiteEvent;

class BetCanceledEvent extends Event
{
    public $bet;

    /**
     * Create a new event instance.
     *
     * @param Bet $bet
     */
    public function __construct(Bet $bet)
    {
        $this->bet = $bet;
        SiteEvent::insert([
            'event_type' => substr(strrchr(__CLASS__, "\\"), 1),
            'event_id' => $bet->id,
            'match_id' => $bet->match_id,
            'by_user' => $bet->user_id
        ]);
    }
}
