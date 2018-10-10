<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryIndex extends Model
{
    protected $table = "category_index";
    protected $primaryKey = 'id';
    public $timestamps = false;
}