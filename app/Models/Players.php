<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Players extends Model
{
    protected $table = "players";
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $guarded = [];

    public function currentTeam(){
        return $this->belongsTo(Teams::class,'current_team');
    }
    public function currentVideogame(){
        return $this->belongsTo(VideogamesIndex::class,'current_videogame');
    }
    public function pastTeams(){
        return $this->hasMany(PlayerTeamsHistory::class,'player_id')->orderBy('joined_on');
    }

}
?>