<?php

namespace App\Events;

use App\Betting;
use App\Models\BetDefinition;
use App\Models\MatchData;
use App\Models\Matches;

class MatchOverEvent extends Event
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
        $bets = BetDefinition::where('match_id',$match->id)->get();
        $md = MatchData::where('matchid',$match->id)->where('data_header','log')->orderBy('timestamp','asc')->get();

        foreach ($bets as $bet){
            switch($bet->type){
                case 1: // over all match winner
                    $winner = $match->winner()->id; // get winning team id
                    Betting::payouts($match,$bet->type,$winner);
                    break;
                case 2: // who will win map 1
                    if(count($match->games) > 0) {
                        $winner = $match->games[0]->winner->id; // get winning team id
                        Betting::payouts($match, $bet->type, $winner);
                    }
                    break;
                case 3: // who will win map 2
                    if(count($match->games) > 1) {
                        $winner = $match->games[0]->winner->id; // get winning team id
                        Betting::payouts($match, $bet->type, $winner);
                    }
                    break;
                case 4: // Total Maps played
                    $winner = count($match->games);
                    Betting::payouts($match, $bet->type, $winner);
                    break;
                case 5: // When will the first AWP frag happen on Map 1?
                    $round = 0;

                    for($i= 0; $i < count($md); $i++){
                        $data =$md[$i]->data;
                        $obj = json_decode($data,true);
                        if($obj){
                            foreach($obj['log'][0] as $idx=>$val){
                                if($idx == "MatchStarted"){
                                    $round++;
                                }
                            }
                        }
                    }
                    break;
                case 6: // Who will be first to get a kill?
                    break;
                case 7: //Who will be first to die?
                    break;
                default :
                    //undefined
                    break;
            }
        }
    }
}
