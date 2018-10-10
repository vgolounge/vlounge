<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlayerTeamsHistory extends Model
{
    protected $table = "player_teams_history";
    protected $primaryKey = 'id';
    public $timestamps = false;
    public function player(){
        return $this->belongsTo('Players','player_id');
    }
    public function team(){
        return $this->belongsTo('Teams','team_id');
    }
}
?>