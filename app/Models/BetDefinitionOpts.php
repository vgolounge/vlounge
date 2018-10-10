<?php

namespace App\Models;

use App\Auth;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class BetDefinitionOpts extends Model
{
    protected $table = "bet_definition_opts";
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $guarded = [];
    protected $hidden = ['id', 'def_id', 'bets'];
    protected $appends = ['user_bets', 'user_bets_count', 'user_bets_credits', 'bets_count', 'bets_credits'];
    
    public function bets(){
        return $this->hasMany(Bet::class, 'definition', 'def_id')->where('pick', $this->pick);
    }
    public function getActiveBetsAttribute(){
        return $this->bets->whereStrict('status', Bet::STATUS_ACTIVE);
    }
    public function getOddsBetsAttribute(){
        return $this->bets->whereInStrict('status', [Bet::STATUS_ACTIVE, Bet::STATUS_PAID]);
    }
    public function getUserBetsAttribute(){
        if(Auth::check())
            return $this->odds_bets->where('user_id', Auth::id());

        return null;
    }
    public function getUserBetsCountAttribute(){
	    if(Auth::check())
    	    return $this->user_bets->count();

        return null;
	}
    public function getUserBetsCreditsAttribute(){
	    if(Auth::check())
    	    return $this->user_bets->sum('amount');

        return null;
	}
    public function getBetsCountAttribute(){
	    return $this->bets->count();
	}
    public function getBetsCreditsAttribute(){
	    return $this->bets->sum('amount');
	}
}
