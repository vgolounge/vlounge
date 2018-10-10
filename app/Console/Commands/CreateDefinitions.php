<?php

namespace App\Console\Commands;

use App\Models\Matches;
use App\Models\Teams;
use App\Models\BetTemplate;
use App\Models\BetDefinition;
use App\Models\BetDefinitionOpts;
use Carbon\CarbonInterval;
use Illuminate\Console\Command;

class CreateDefinitions extends Command
{
    protected $signature = 'store:bet-definitions';
    protected $description = 'Create bet definitions for upcoming bets';

    public function handle() {
        $upcoming = Matches::with('csgo_games')->doesntHave('bet_definitions')->where('begins_at', '>=', date('Y-m-d H:i:s'))->orderBy('begins_at', 'ASC')->get();
        
        foreach($upcoming as $match) {
        	dump('Match ID: ' . $match->id);
        	$bet_templates = BetTemplate::where('videogame_id', $match['videogame_id'])->get();
        	
        	if(count($match['csgo_games']) <= 0) {
        		dump('csgo_games is empty?');
        		continue;
	        }
        	
        	$teams = Teams::with('teamMembers')->where('id', $match['csgo_games'][0]['team_1_id'])->orWhere('id', $match['csgo_games'][0]['team_2_id'])->get()->toArray();
        	
        	$players = [];
        	if(!empty($teams[0]['team_members']) && !empty($teams[1]['team_members'])) {
        		$players = array_merge($teams[0]['team_members'], $teams[1]['team_members']);
	        }
        	
        	// cycle through each template
            foreach($bet_templates as $bet_template) {
                // check how many maps this template needs to apply, if too few maps then we skip it.
                if((int)$match->number_of_games < $bet_template->minmaps) {
                    continue;
                }
                
                $maps = 1;
                $maps_min = ceil((int)$match->number_of_games / 2);
                // check if this template applies per map
                if($bet_template->permap == 1) {
                    if((int)$match->number_of_games > 0) {
                        $maps = (int)$match->number_of_games;
                        // check if best of is odd, if it is we don't want to accept bets on games that might not be played.
                        // BO1 = 1, BO3 = 2, BO5 = 3, BO7 = 4 etc
                        if((int)$match->number_of_games & 1) {
                            $maps = $maps_min;
                        }
                    }
                }
                
                // for now cap at 4 max
	            if($maps > 4) {
	                $maps = 4;
	            }
	            
                for($i = 1; $i <= $maps; $i++) {
                    switch($bet_template->type) {
					    case 1:
					        $desc = "Who will win?";
					        $order = 0;
					        $options = [];
                            foreach($teams as $team) {
                                $options[] = [
					                'pick' => $team['id'],
							        'desc' => $team['name']
						        ];
                            }
					        break;
					    case 2:
					        $desc = "Who will win map $i?";
					        $order = $i;
					        $options = [];
                            foreach($teams as $team) {
                                $options[] = [
					                'pick' => $team['id'],
							        'desc' => $team['name']
						        ];
                            }
					        break;
					    case 3:
					        $desc = "When will the bomb be planted for the first time on Map $i?";
					        $order = $i;
					        $options = [
					            [
					                'pick' => 1,
					                'desc' => 'In the 1st round.'
						        ],
						        [
					                'pick' => 2,
					                'desc' => 'In the 2nd round.'
						        ],
						        [
					                'pick' => 3,
					                'desc' => 'In the 3rd round.'
						        ],
						        [
					                'pick' => 4,
					                'desc' => 'In the 4th round.'
						        ],
						        [
					                'pick' => 5,
					                'desc' => 'In any of the following rounds.'
						        ]
					        ];
					        break;
					    case 4:
					        $desc = "Total Maps played";
					        $order = (int)$match->number_of_games + 1;
					        $options = [];
					        for($g = $maps_min; $g <= (int)$match->number_of_games; $g++) {
					            $options[] = [
					                'pick' => $g,
							        'desc' => $g
						        ];
					        }
					        break;
					    case 5:
					        $desc = "When will the first AWP frag happen on Map $i?";
					        $order = $i;
					        $options = [
						        [
					                'pick' => 3,
					                'desc' => 'In the 3rd round.'
						        ],
						        [
					                'pick' => 4,
					                'desc' => 'In the 4th round.'
						        ],
						        [
					                'pick' => 5,
					                'desc' => 'In the 5th round.'
						        ],
						        [
					                'pick' => 6,
					                'desc' => 'In any other round.'
						        ]
					        ];
					        break;
					    case 6:
					        $desc = "Who will be first to get a kill?";
					        $order = (int)$match->number_of_games + 1;
					        $options = [];
					        foreach($players as $player) {
                                $options[] = [
					                'pick' => $player['id'],
							        'desc' => $player['first_name'] . ' "' . $player['name'] . '" ' . $player['last_name']
						        ];
                            }
					        break;
					    case 7:
					        $desc = "Who will be first to die?";
					        $order = (int)$match->number_of_games + 1;
					        $options = [];
                            foreach($players as $player) {
                                $options[] = [
					                'pick' => $player['id'],
							        'desc' => $player['first_name'] . ' "' . $player['name'] . '" ' . $player['last_name']
						        ];
                            }
					        break;
					    default:
					        $desc = null;
					        $order = 0;
					        $options = [];
					}
                    
                    if(!empty($options)) {
                    	$def_id = BetDefinition::create(
							[
		                        'match_id' => $match->id,
								'status' => 1,
		                        'type' => $bet_template->type,
		                        'desc' => $desc,
		                        'opens_at' => $match->begins_at->sub(CarbonInterval::fromString($bet_template->opens_before)),
		                        'closes_at' => $match->begins_at,
			                    'order' => $order
		                    ]
						)->id;
                    	
	                    // now we put the options into bet_definition_opts
	                    if((int)$def_id > 0) {
	                        foreach($options as $opt) {
		                        BetDefinitionOpts::create(
		                            [
				                        'def_id' => (int)$def_id,
				                        'pick' => $opt['pick'],
				                        'desc' => $opt['desc']
			                        ]
		                        );
	                        }
	                    }
                    }
                }
            }
        }
    }
}