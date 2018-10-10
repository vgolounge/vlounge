<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVideogamesIndexTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('videogames_index', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',150);
            $table->text('desc')->nullable();
            $table->string('slug',45);
            $table->string('icon_url',245)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('videogames_index');
    }
}
