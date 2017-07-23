<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePriceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('price', function (Blueprint $table) {
            $table->increments('id');
            $table->double('value');
            $table->timestamps();

            $table->integer('product_id')->unsigned()->nullable();
            $table->foreign('product_id')
            ->references('id')->on('product')->onDelete('cascade');

            $table->integer('retailer_id')->unsigned();
            $table->foreign('retailer_id')
            ->references('id')->on('retailer')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('price');
    }
}
