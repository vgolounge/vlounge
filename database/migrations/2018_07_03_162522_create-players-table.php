<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlayersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('players',function (Blueprint $table) {
            $table->increments('id');
            $table->string('url',245)->nullable();
            $table->string('name',245);
            $table->string('first_name',145);
            $table->string('last_name',145);
            $table->string('slug',45)->nullable();
            $table->text('bio')->nullable();
            $table->string('role','45')->nullable();
            $table->string('hometown','45')->nullable();
            $table->string('image_url',245)->nullable();
            $table->integer('current_team')->nullable();
            $table->integer('current_videogame')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('players');
    }
}
