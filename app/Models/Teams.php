<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teams extends Model
{
    protected $table = "teams";
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $guarded = [];

    public function teamMembers(){
        return $this->hasMany(Players::class,'current_team');
    }
    public function videogame(){
        return $this->belongsTo(VideogamesIndex::class,'videogame_id');
    }
}
?>