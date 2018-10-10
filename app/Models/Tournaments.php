<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tournaments extends Model
{
    protected $table = "tournaments";
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $guarded = [];

    public function league(){
        return $this->belongsTo(Leagues::class,'league_id');
    }
    public function series(){
        return $this->belongsTo(Series::class,'series_id');
    }
    public function matches(){
        return $this->hasMany(Matches::class,'tournament_id');
    }
    public function winner(){
        if($this->winner_type == "player")
            return $this->belongsTo(Players::class,'winner_id');
        else
            return $this->belongsTo(Teams::class,'winner_id');
    }
}
?>