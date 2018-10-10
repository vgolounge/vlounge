<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSeriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('series',function(Blueprint $table){
            $table->increments('id');
            $table->string('name',245);
            $table->string('slug',145);
            $table->string('season',45);
            $table->dateTime('begins_at')->nullable();
            $table->text('desc')->nullable();
            $table->double('prize_pool')->default(0);
            $table->integer('league_id')->default(0);
            $table->integer('year')->nullable();
            $table->string('winner_type',45)->nullable();
            $table->integer('winner_id')->nullable();
            $table->dateTime('end_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('series');
    }
}
