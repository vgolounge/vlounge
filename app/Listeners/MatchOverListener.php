<?php

namespace App\Listeners;

use App\Betting;
use App\Events\ExampleEvent;
use App\Events\MatchOverEvent;

//use Illuminate\Queue\InteractsWithQueue;
//use Illuminate\Contracts\Queue\ShouldQueue;

class MatchOverListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {

    }

    /**
     * Handle the event.
     *
     * @param  ExampleEvent  $event
     * @return void
     */
    public function handle(MatchOverEvent $event)
    {
        $match = $event->match;

        if($match->status == 'Match over')
        {
            Betting::payouts($match, 1, $match->winner_id);
        }
    }
}
