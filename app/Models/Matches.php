<?php
namespace App\Models;

use App\Auth;
use Illuminate\Database\Eloquent\Model;

class Matches extends Model
{
    protected $table = "matches";
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $guarded = [];
    protected $dates = [
        'begins_at',
        'modified_at'
    ];

    public function bet_definitions(){
        return $this->hasMany(BetDefinition::class,'match_id');
    }
    public function main_bet_definition(){
        return $this->hasOne(BetDefinition::class,'match_id')->where('type', 1);
    }

    public function series(){
        return $this->belongsTo(Series::class,'series_id');
    }
    public function tournament(){
        return $this->belongsTo(Tournaments::class,'tournament_id');
    }
    public function videogame(){
        return $this->belongsTo(VideogamesIndex::class,'videogame_id');
    }
    public function games(){
        return $this->hasMany(Games::class,'match_id');
    }
    public function odds(){
        return $this->hasMany(CsgoMatchOdds::class,'match_id');
    }
    public function streams(){
        return $this->hasMany(MatchStream::class,'match_id');
    }
    public function csgo_games(){
        return $this->hasMany(CsgoGame::class,'match_id');
    }
    public function team1(){
        if(count($this->games) > 0){
            return $this->csgo_games[0]->team1;
        }
        else
            return null;
    }
    public function team2(){
        if(count($this->games) > 0){
            return $this->csgo_games[0]->team2;
        }
        else
            return null;
    }
    public function isLive(){
        return $this->status == "LIVE"?1:0;
    }
    public function matchScores(){
        $out = [];
        if(count($this->csgo_games) > 1){
            $tally = [];
            for($c=0; $c < count($this->csgo_games); $c++) {
                $game = $this->csgo_games[$c];

                $team1 = $game->team_1_id;
                $team2 = $game->team_2_id;

                if(!isset($tally[$team1]))
                    $tally[$team1] = 0;
                if(!isset($tally[$team2]))
                    $tally[$team2] = 0;

                if($game->winner_id() != 0){
                        $tally[$game->winner_id()]++;
                }
            }
            $out = [];
            foreach($tally as $idx=>$val){
                $out[] = ['id'=>$idx,'value'=>$val];
            }
        }
        else if(count($this->csgo_games) > 0) {
            $team['id'] = $this->csgo_games[0]->team_1_id;
            $team['value'] = $this->csgo_games[0]->team_1_score;
            $out[] = $team;

            $team['id'] = $this->csgo_games[0]->team_2_id;
            $team['value'] = $this->csgo_games[0]->team_2_score;
            $out[] = $team;
        }
        return $out;
    }
    public function winner(){
        static $winner = NULL;

        if($winner == NULL AND $winner_id = $this->winner_id)
            $winner = Teams::find($winner_id);

        return $winner;
    }


    public function getWinnerIdAttribute(){
        $tally = [];
        foreach ($this->csgo_games as $game)
            if($game->winner_id() != 0)
            {
                if(array_key_exists($game->winner_id(), $tally))
                    $tally[$game->winner_id()]++;
                else
                    $tally[$game->winner_id()] = 1;
            }

        if($tally)
        {
            arsort($tally);
            return array_keys($tally)[0];
        }

        return 0;
    }
}
?>
