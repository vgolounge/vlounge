<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class CsgoMatchOdds extends Model
{
    protected $table = "csgo_match_odds";
    protected $primaryKey = ['match_id','source'];
    public $timestamps = false;
    public $incrementing = false;

    protected $guarded = [];
    protected $casts = [
        'team1_odd' => 'double',
        'team2_odd' => 'double'
    ];

    public function match(){
        return $this->belongsTo(Matches::class,'match_id');
    }
    public function team1(){
        return $this->belongsTo(Teams::class,'team_1_id');
    }
    public function team2(){
        return $this->belongsTo(Teams::class,'team_2_id');
    }

    protected function getKeyForSaveQuery()
    {
        $primaryKeyForSaveQuery = array(count($this->primaryKey));
        foreach ($this->primaryKey as $i => $pKey) {
            $primaryKeyForSaveQuery[$i] = isset($this->original[$this->getKeyName()[$i]])
                ? $this->original[$this->getKeyName()[$i]]
                : $this->getAttribute($this->getKeyName()[$i]);
        }
        return $primaryKeyForSaveQuery;
    }

    /**
     * Set the keys for a save update query.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function setKeysForSaveQuery(Builder $query)
    {
        foreach ($this->primaryKey as $i => $pKey) {
            $query->where($this->getKeyName()[$i], '=', $this->getKeyForSaveQuery()[$i]);
        }
        return $query;
    }
}
?>