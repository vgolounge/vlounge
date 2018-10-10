<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Leagues extends Model
{
    protected $table = "leagues";
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $guarded = [];
    protected $dates = [
        'created_at',
        'modified_at'
    ];

    public function series(){
        return $this->hasMany(Series::class,'league_id');
    }

}
?>