<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $table = "item_index";
    protected $primaryKey = 'id';
    public $timestamps = false;
    protected $guarded = ['id'];
    public function game(){
        return $this->belongsTo('App\Models\VideogameIndex','app_id');
    }
    public function category(){
        return $this->belongsTo('App\Models\CategoryIndex','category_id');
    }
    public function type(){
        return $this->belongsTo('App\Models\TypeIndex','type_id');
    }
    public function wear(){
        return $this->belongsTo('App\Models\WearIndex','wear_id');
    }
    public function rarity(){
        return $this->belongsTo('App\Models\RarityIndex','rarity_id');
    }
}

?>