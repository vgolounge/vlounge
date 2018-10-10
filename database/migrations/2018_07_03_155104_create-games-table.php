<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGamesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('games',function (Blueprint $table) {
            $table->increments('id');
            $table->integer('position')->default(0);
            $table->integer('length')->default(0);
            $table->dateTime('begin_at')->nullable();
            $table->dateTime('end_at')->nullable();
            $table->integer('match_id')->default(0);
            $table->boolean('finished')->default(0);
            $table->integer('winner_id')->default(0);
            $table->string('winner_type',45)->nullable();
            $table->boolean('draw')->default(0);
            $table->string('map_name',100)->nullable();
            $table->integer('videogame_id')->nullable();
            $table->string('slug')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('games');
    }
}
