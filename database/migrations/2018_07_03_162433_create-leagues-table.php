<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLeaguesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('leagues',function (Blueprint $table) {
            $table->increments('id');
            $table->string('url',245)->nullable();
            $table->string('name',245);
            $table->string('slug',145);
            $table->dateTime('created_at')->nullable();
            $table->dateTime('modified_at')->nullable();
            $table->string('image_url',245)->nullable();
            $table->tinyInteger('live_supported')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('leagues');
    }
}
