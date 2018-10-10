<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Games extends Model
{
    protected $table = "games";
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $guarded = [];
    protected $dates = [
        'begin_at',
        'end_at'
    ];

    public function match(){
        return $this->belongsTo(Matches::class,'match_id');
    }

    public function winner(){
        if($this->winner_id != 0) {
            if ($this->winner_type == 'player')
                return $this->belongsTo(Players::class, 'winner_id');
            else
                return $this->belongsTo(Teams::class, 'winner_id');
        }
        return null;
    }
    public function csgo_game(){
        return $this->hasOne(CsgoGame::class,'game_id','id');
    }
    public function opponents(){
        return $this->hasMany(GamesOpponents::class,'game_id');
    }
    public function videogame(){
        return $this->belongsTo(VideoGamesIndex::class,'videogame_id');
    }
}
?>
