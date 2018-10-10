<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlayerTeamsHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('player_teams_history',function (Blueprint $table) {
            $table->integer('player_id');
            $table->integer('team_id');
            $table->date('joined_on')->nullable();
            $table->date('left_on')->nullable();
            $table->primary(['player_id','team_id','joined_on']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('player_teams_history');
    }
}
