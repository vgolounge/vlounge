<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchStream extends Model
{
    protected $primaryKey = 'match_id';
    public $incrementing = false;
    public $timestamps = false;

    protected $guarded = [];

    public function match(){
        return $this->belongsTo(Matches::class);
    }
}
?>