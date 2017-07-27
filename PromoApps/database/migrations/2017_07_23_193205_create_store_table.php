<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStoreTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->integer('retailer_id')->unsigned();
            $table->foreign('retailer_id')
            ->references('id')->on('retailers')->onDelete('cascade');

            $table->integer('location_id')->unsigned()->nullable();
            $table->foreign('location_id')
            ->references('id')->on('locations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('stores');
        Schema::enableForeignKeyConstraints();
    }
}
