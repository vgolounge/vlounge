<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGamesOpponentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('games_opponents',function (Blueprint $table) {
            $table->integer('game_id');
            $table->integer('type_id');
            $table->string('type',45);
            $table->integer('teamid');
            $table->primary(['game_id','type_id','type']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('games_opponents');
    }
}
