<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableMatchData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('match_data', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('matchid')->default(0);
            $table->string('data_header',45)->nullable();
            $table->text('data')->nullable();
            $table->double('timestamp');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('match_data');
    }
}
