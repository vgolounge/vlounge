<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CsgoGame extends Model
{
    protected $table = "csgo_game";
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $guarded = [];
    public function isDraw(){
        return $this->team_1_score == $this->team_2_score;
    }
    public function winner_id(){
        return (($this->team_1_score > $this->team_2_score)?$this->team_1_id:(($this->team_2_score > $this->team_1_score)?$this->team_2_id:0));
    }
    public function game(){
        return $this->belongsTo(Games::class,'game_id');
    }
    public function match(){
        return $this->belongsTo(Matches::class,'match_id');
    }
    public function team1(){
        return $this->belongsTo(Teams::class,'team_1_id');
    }
    public function team2(){
        return $this->belongsTo(Teams::class,'team_2_id');
    }
    public function players(){
        return $this->hasMany(CsgoPlayerGame::class,'csgo_game_id');
    }
}