<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCsgoGameTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('csgo_game',function(Blueprint $table){
            $table->increments('id');
            $table->integer('game_id');
            $table->integer('match_id');
            $table->integer('team_1_id');
            $table->integer('team_2_id');
            $table->integer('team_1_score');
            $table->integer('team_2_score');
            $table->integer('team_1_ct_score');
            $table->integer('team_1_t_score');
            $table->integer('team_2_ct_score');
            $table->integer('team_2_t_score');
            $table->string('slug',60)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop("csgo_game");
    }
}
