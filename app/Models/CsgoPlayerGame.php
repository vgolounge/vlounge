<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class CsgoPlayerGame extends Model
{
    public $incrementing = false;
    protected $table = "csgo_player_game";
    protected $primaryKey = ['player_id','csgo_game_id'];
    public $timestamps = false;
    protected $guarded = [];

    public function csgogame(){
        return $this->belongsTo('CsgoGame','csgo_game_id');
    }
    public function player(){
        return $this->belongsTo('Players','player_id');
    }
    public function team(){
        return $this->belongsTo('Teams','team_id');
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