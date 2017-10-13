<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductRetailerTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('product_retailers')) {
            Schema::create('product_retailers', function (Blueprint $table) {
                $table->increments('id');
                $table->double('price');
                $table->double('base_price');
                $table->boolean('hasDiscount');
                $table->double('price_per_weight');
                $table->string('type_of_weight');
                $table->integer('pid');
                $table->text('image');
                $table->text('link');
                $table->boolean('active');
                $table->timestamps();

                $table->integer('product_id')->unsigned()->nullable();
                $table->foreign('product_id')
                ->references('id')->on('products')->onDelete('cascade');

                $table->integer('retailer_id')->unsigned()->nullable();
                $table->foreign('retailer_id')
                ->references('id')->on('retailers')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('product_retailers');
        Schema::enableForeignKeyConstraints();
    }
}
