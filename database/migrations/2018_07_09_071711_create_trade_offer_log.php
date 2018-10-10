<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTradeOfferLog extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('trade_offer_log', function (Blueprint $table) {
            $table->integer('id');
            $table->integer('uid');
            $table->text('items_deposit');
            $table->text('items_withdraw');
            $table->integer('time_created');
            $table->integer('time_expires');
            $table->integer('status')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('trade_offer_log');
    }
}
