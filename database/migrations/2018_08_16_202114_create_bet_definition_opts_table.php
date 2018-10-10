<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBetDefinitionOptsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bet_definition_opts', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('def_id')->unsigned()->index();
            $table->integer('pick')->unsigned();
            $table->string('desc', 255);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bet_definition_opts');
    }
}
