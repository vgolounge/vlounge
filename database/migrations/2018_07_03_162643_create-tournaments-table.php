<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTournamentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tournaments',function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',245);
            $table->string('slug',245);
            $table->string('winner_type',45)->nullable();
            $table->integer('winner_id')->nullable();
            $table->dateTime('begins_at')->nullable();
            $table->dateTime('ends_at')->nullable();
            $table->integer('series_id');
            $table->integer('league_id');
            $table->string('country',100)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('tournaments');
    }
}
