<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GamesOpponents extends Model
{
    protected $table = "games_opponents";
    //protected $primaryKey = 'id';
    public $timestamps = false;

    protected $guarded = [];

    public function game(){
        return $this->belongsTo(Games::class,'game_id');
    }
    public function team(){
        return $this->belongsTo(Teams::class,'teamid');
    }
    public function player(){
        return $this->belongsTo(Players::class,'type_id');
    }

}
?>