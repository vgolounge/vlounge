<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Series extends Model
{
    protected $table = "series";
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $guarded = [];
    protected $dates = [
        'begins_at',
        'end_at'
    ];

    public function league(){
        return $this->belongsTo(Leagues::class,'league_id');
    }
    public function winner(){
        if($this->winner_type == "player")
            return $this->belongsTo(Players::class,'winner_id');
        else
            return $this->belongsTo(Teams::class,'winner_id');
    }
    public function tournaments(){
        return $this->hasMany(Tournaments::class,'series_id');
    }

}
?>