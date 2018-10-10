<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCsgoGameOddsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('csgo_match_odds', function (Blueprint $table) {
            $table->integer('match_id');
            $table->string('source','100');
            $table->integer('team_1_id');
            $table->integer('team_2_id');
            $table->double('team1_odd')->default(0);
            $table->double('team2_odd')->default(0);
            $table->primary(['match_id','source']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('csgo_match_odds');
    }
}
