<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCsgoPlayerGameTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('csgo_player_game',function(Blueprint $table){
            $table->integer('csgo_game_id');
            $table->integer('player_id');
            $table->integer('kills')->default(0);
            $table->integer('assists')->default(0);
            $table->integer('flash_assists')->default(0);
            $table->integer('deaths')->default(0);
            $table->double('kast')->default(0);
            $table->integer('kd_diff')->default(0);
            $table->double('adr')->default(0);
            $table->integer('fk_diff')->default(0);
            $table->double('rating')->default(0);
            $table->integer('team_id');
            $table->primary(['csgo_game_id','player_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('csgo_player_game');
    }
}
