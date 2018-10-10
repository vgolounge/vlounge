<?php

namespace App;


use App\Models\Matches;
use App\Models\User;
use App\Models\Bet;
use App\Models\BetDefinition;
use App\Models\Transaction;

class Betting {
	/**
	 * Place a bet
	 * @param $definition
	 * @param $user_id
	 * @param $amount
	 * @param $pick
	 * @return bool|mixed
	 */
	public static function place($definition, $user_id, $amount, $pick) {
		if((int)$definition == 0 || (int)$user_id == 0 || ((int)$amount == 0 || (int)$pick == 0)) {
			return false;
		}
		
		// check if definition exists
		$def = BetDefinition::find($definition);
		if($def) {
			// check if bet is allowed to be placed
			if($def->status > 0 && (\Carbon\Carbon::now() > $def->opens_at && \Carbon\Carbon::now() < $def->closes_at)) {
				$user = User::find($user_id);
				// check if user can afford bet
				if((int)$user->credits >= (int)$amount) {
					// place bet
					$bet = new Bet;
					
					$odds = array();
					foreach($def->odds as $id => $odd) {
						$odds[$id] = $odd;
					}
					
					$bet->definition = (int)$def->id;
					$bet->match_id = (int)$def->match_id;
					$bet->user_id = (int)$user->id;
					$bet->amount = (int)$amount;
					$bet->pick = (int)$pick;
					$bet->odds = (array_key_exists($pick, $odds) ? $odds[$pick] : 1.00);
					$bet->status = 1;

					// subtract amount from credits
					$user->credits -= (int)$amount;
					
					// save models
					$bet->save();
					$user->save();
					
					// log transaction
					$log = new Transaction;
					$log->user_id = (int)$bet->user_id;
					$log->type = Transaction::TYPE_BET_PLACE;
					$log->var1 = (int)$bet->id;
					$log->credits = 0 - (int)$bet->amount;
					$log->save();
					
					return $bet->id;
				}
			}
		}
		
		return false;
	}
	
	/**
	 * Cancel a bet
	 * @param $bet_id
	 * @param $user_id
	 * @return bool
	 */
	public static function cancel($bet_id, $user_id) {
		if((int)$bet_id == 0 || (int)$user_id == 0) {
			return false;
		}
		
		$bet = Bet::find($bet_id);
		if($bet) {
			$def = BetDefinition::find($bet->definition);
			// check if bet is allowed to be cancelled
			if($bet->status > 0 && $def->status > 0 && (\Carbon\Carbon::now() > $def->opens_at && \Carbon\Carbon::now() < $def->closes_at)) {
				$user = User::find($user_id);
				// check if user owns bet
				if($bet->user_id == $user->id) {
					// cancel bet
					$bet->status = Bet::STATUS_CANCELED;
					
					// add amount to credits
					$user->credits += (int)$bet->amount;
					
					// log transaction
					$log = new Transaction;
					$log->user_id = (int)$bet->user_id;
					$log->type = Transaction::TYPE_BET_CANCEL;
					$log->var1 = (int)$bet->id;
					$log->credits = (int)$bet->amount;
					$log->save();
					
					// save models
					$bet->save();
					$user->save();
					
					return $bet->id;
				}
			}
		}
		
		return false;
	}
	
	/**
	 * Edit a bet
	 * @param $bet_id
	 * @param $user_id
	 * @param null $amount
	 * @param null $pick
	 * @return bool
	 */
	public static function edit($bet_id, $user_id, $amount = null, $pick = null) {
		if((int)$bet_id == 0 || (int)$user_id == 0 || ((int)$amount == 0 || (int)$pick == 0)) {
			return false;
		}
		
		$bet = Bet::find($bet_id);
		if($bet) {
			$def = BetDefinition::find($bet->definition);
			// check if bet is allowed to be edited
			if($bet->status > 0 && $def->status > 0 && (\Carbon\Carbon::now() > $def->opens_at && \Carbon\Carbon::now() < $def->closes_at)) {
				$user = User::find($user_id);
				
				// check if user owns bet
				if($bet->user_id == $user->id) {
					// check if user can afford bet
					if(((int)$user->credits + $bet->amount) >= (int)$amount) {
						// alter bet
						$bet = Bet::find($bet_id);
						
						if($amount !== null) {
							$amount_old = $bet->amount;
							$amount_new = $amount;
							
							if($amount_old > $amount_new) {
								// if old amount is higher than new amount
								$user->credits += (int)($amount_old - $amount_new);
							} elseif($amount_old < $amount_new) {
								// if new amount is higher than old amount
								$user->credits += (int)($amount_new - $amount_old);
							}
							
							$bet->amount = $amount;
						}
						
						if($pick !== null) $bet->pick = (int)$pick;
						
						// save models
						$bet->save();
						$user->save();
						
						return $bet->id;
					}
				}
			}
		}
		
		return false;
	}

    /**
     * @param Matches $match | Match model
     * @param int $def_type | type of BetDefinition
     * @param $winner | id of winner team or null
     */
    public static function payouts(Matches $match, int $def_type, $winner) {
        $match->load([
            'bet_definitions' => function($query) use ($def_type){
                $query->where('type', $def_type);
            }, 'bet_definitions.bets', 'bet_definitions.bets.user'
        ]);

        $bet_definition = $match->bet_definitions->first();
        if ($bet_definition)
        {
            Bet::whereIn('id', $bet_definition->active_bets->pluck('id'))->update([
                'status' => Bet::STATUS_PAID
            ]);

            if ($winner)
            {
                $winners_bets = $bet_definition->active_bets->where('pick', $winner);

                foreach ($winners_bets as $bet)
                {
                    if ($bet->user)
                    {
                        $bet->user->credits += floor($bet->amount * $bet->odds);
                        $bet->user->save();
                        
                        // log transaction
						$log = new Transaction;
						$log->user_id = (int)$bet->user_id;
						$log->type = Transaction::TYPE_BET_PAYOUT;
						$log->var1 = (int)$bet->id;
						$log->credits = floor($bet->amount * $bet->odds);
						$log->save();
                    }
                }
            }
            else //no winner, return bets
            {
                foreach ($bet_definition->active_bets as $bet)
                {
                    if ($bet->user)
                    {
                        $bet->user->credits += $bet->amount;
                        $bet->user->save();
                        
                        // log transaction
						$log = new Transaction;
						$log->user_id = (int)$bet->user_id;
						$log->type = Transaction::TYPE_BET_PAYOUT;
						$log->var1 = (int)$bet->id;
						$log->credits = (int)$bet->amount;
						$log->save();
                    }
                }
            }
        }
	}
}
