<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductShoppingListTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_shopping_list', function (Blueprint $table) {

            $table->integer('quantity');

            $table->integer('product_id')->unsigned()->nullable();
            $table->foreign('product_id')->references('id')
            ->on('products')->onDelete('cascade');

            $table->integer('shopping_list_id')->unsigned()->nullable();
            $table->foreign('shopping_list_id')->references('id')
            ->on('shopping_lists')->onDelete('cascade');

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
        Schema::table('product_shopping_list', function($table)
        {
            $table->dropColumn('quantity');
        });
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('product_shopping_list');
        Schema::enableForeignKeyConstraints();
    }
}
