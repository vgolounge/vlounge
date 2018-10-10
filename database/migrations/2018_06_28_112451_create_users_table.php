<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->integer('id')->comment('OPSkins.com user ID');
            $table->primary('id');

            $table->string('steam_id', 17)->nullable();
            $table->string('name', 32);
            $table->string('avatar')->nullable();

            $table->integer('credits')->default(0);

            $table->smallInteger('twofactor_enabled')->unsigned()->default(0);
            $table->smallInteger('inventory_is_private')->unsigned()->default(0);

            $table->string('tradelink')->nullable();

            $table->tinyInteger('is_admin')->default(0);
            $table->string('token')->nullable()->comment('oAuth');
            $table->ipAddress('ip_address')->nullable()->comment('Last login IP address');

            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('first_login_at')->nullable();
            $table->timestamp('last_login_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
