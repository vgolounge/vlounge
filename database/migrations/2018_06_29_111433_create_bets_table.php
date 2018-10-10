<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bets', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('match_id')->unsigned()->index();
            $table->integer('user_id')->unsigned();
            $table->integer('amount')->unsigned();
            $table->tinyInteger('status')->unsigned();
            $table->integer('definition')->unsigned();
            $table->integer('pick')->unsigned();
            $table->decimal('odds', 8, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bets');
    }
}
