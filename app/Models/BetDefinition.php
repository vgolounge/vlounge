<?php

namespace App\Models;

use App\Auth;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class BetDefinition extends Model
{
    protected $table = "bet_definition";
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $guarded = [];
    protected $dates = ['opens_at', 'closes_at'];
    protected $appends = ['user_bet', 'user_bets_count', 'user_bets_credits', 'odds', 'is_active', 'bets_count', 'bets_credits'];

    public function options(){
        return $this->hasMany(BetDefinitionOpts::class,'def_id')->orderBy('id', 'asc');
    }
    public function bets(){
        return $this->hasMany(Bet::class,'definition');
    }
    public function getActiveBetsAttribute(){
        return $this->bets->whereStrict('status', Bet::STATUS_ACTIVE);
    }
    public function getOddsBetsAttribute(){
        return $this->bets->whereInStrict('status', [Bet::STATUS_ACTIVE, Bet::STATUS_PAID]);
    }

    public function getIsActiveAttribute(){
        return $this->attributes['status'] == 1 && Carbon::now()->between($this->opens_at, $this->closes_at);
    }
    public function getOddsAttribute(){
        $total = $this->odds_bets->sum('amount');
        $odds = $this->odds_bets->groupBy('pick')->transform(function ($item, $key) use ($total) {
            return number_format($total/$item->sum('amount'), 2, '.', '');
        });

        return $odds;
    }
    public function getUserBetAttribute(){
        /*if(Auth::check())
            return $this->odds_bets->where('user_id', Auth::id())->first();

        return null;*/
        if(Auth::check())
            return $this->odds_bets->where('user_id', Auth::id());

        return null;
    }
    public function getUserBetsCountAttribute(){
	    if(Auth::check())
    	    return $this->user_bet->count();

        return null;
	}
    public function getUserBetsCreditsAttribute(){
	    if(Auth::check())
    	    return $this->user_bet->sum('amount');

        return null;
	}
    public function getBetsCountAttribute(){
	    return $this->bets->count();
	}
    public function getBetsCreditsAttribute(){
	    return $this->bets->sum('amount');
	}
}
