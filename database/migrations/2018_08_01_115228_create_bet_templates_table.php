<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBetTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bet_templates', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('videogame_id')->unsigned();
            $table->integer('type')->unsigned();
            $table->integer('permap')->default(0);
            $table->integer('minmaps')->default(1);
            $table->string('opens_before');
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
        Schema::dropIfExists('bet_templates');
    }
}
