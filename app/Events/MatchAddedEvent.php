<?php

namespace App\Events;

use App\Models\Matches;
use App\Models\SiteEvent;

class MatchAddedEvent extends Event
{
    public $match;

    /**
     * Create a new event instance.
     *
     * @param Matches $match
     */
    public function __construct(Matches $match)
    {
        $this->match = $match;
        SiteEvent::insert([
            'event_type' => substr(strrchr(__CLASS__, "\\"), 1),
            'match_id' => $match->id
        ]);
    }
}
