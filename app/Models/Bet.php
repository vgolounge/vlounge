<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bet extends Model
{
    protected $table = "bets";
    protected $primaryKey = 'id';
	public $timestamps = true;

    public const STATUS_ACTIVE = 1;
    public const STATUS_PAID = 2;
    public const STATUS_CANCELED = 3;
    public const STATUS_INVALID = 4;

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];
    
    public function match() {
        return $this->hasOne(Matches::class, 'id', 'match_id');
    }
    
    public function definition_data() {
        return $this->hasOne(BetDefinition::class, 'id', 'definition');
    }
    
    public function pick_data() {
        return $this->hasOne(BetDefinitionOpts::class,'id', 'pick');
    }
    
    public function getDollarsAttribute()
    {
        return number_format($this->attributes['amount']/100, 2, '.', ' ');
    }


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
