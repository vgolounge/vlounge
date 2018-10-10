<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMatchesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('matches',function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',245);
            $table->dateTime('begins_at')->nullable();
            $table->integer('number_of_games')->default(1);
            $table->boolean('draw')->default(0);
            $table->string('status',45)->nullable();
            $table->dateTime('modified_at')->nullable();
            $table->integer('tournament_id')->default(0);
            $table->integer('series_id')->default(0);
            $table->string('match_type')->nullable();
            $table->integer('videogame_id')->default(0);
            $table->string('stub',250)->nullable();
            $table->tinyInteger('hide')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('matches');
    }
}
