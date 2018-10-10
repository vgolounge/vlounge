<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchData extends Model
{
    protected $table = "match_data";
    protected $primaryKey = 'id';
    public $timestamps = false;
}
?>