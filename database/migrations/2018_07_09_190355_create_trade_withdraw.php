<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTradeWithdraw extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('trade_withdraw', function (Blueprint $table) {
            $table->increments('id');
	    	$table->integer('user_id');
            $table->integer('offer_id');
            $table->integer('item_id');
            $table->integer('sku');
            $table->double('wear')->nullable();
            $table->integer('pattern_index');
            $table->string('name','245');
            $table->double('price_at_time')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('trade_withdraw');
    }
}
