<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransactionLog extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transaction_log', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->timestamp('timestamp')->useCurrent();
            $table->integer('type');
            $table->integer('offer');
            $table->text('items');
            $table->integer('var1');
            $table->integer('var2');
            $table->integer('credits');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transaction_log');
    }
}
