<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemIndexTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('item_index', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name','245');
            $table->string('hashname','245');
            $table->integer('app_id');
            $table->integer('category_id')->nullable();
            $table->integer('wear_id')->nullable();
            $table->integer('rarity_id')->nullable();
            $table->integer('type_id')->nullable();
            $table->string('image_300',245)->nullable();
            $table->string('image_600',245)->nullable();
            $table->string('market_url',245)->nullable();
            $table->string('color',15)->nullable();
            $table->double('suggested_price')->default(0);
            //$table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('item_index');
    }
}
