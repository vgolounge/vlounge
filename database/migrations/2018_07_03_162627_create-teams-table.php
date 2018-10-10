<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTeamsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('teams',function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',245);
            $table->text('desc')->nullable();
            $table->string('abvr',145);
            $table->dateTime('added_at')->nullable();
            $table->string('image_url',245)->nullable();
            $table->integer('videogame_id')->default(0);
            $table->integer('world_rank')->nullable();
            $table->string('slug',245);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('teams');
    }
}
