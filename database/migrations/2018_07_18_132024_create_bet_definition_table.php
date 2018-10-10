<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBetDefinitionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bet_definition', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('match_id')->unsigned()->index();
            $table->integer('type')->unsigned();
            $table->string('desc', 255)->nullable();
            $table->timestamp('opens_at')->nullable();
            $table->timestamp('closes_at')->nullable();
            $table->tinyInteger('status')->unsigned();
            $table->integer('order')->unsigned()->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bet_definition');
    }
}
