<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::dropIfExists('products');

        Schema::create('products', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->double('weight');
            $table->string('weight_type');
            $table->boolean('active');
            $table->text('relatedNames');
            $table->timestamps();

            $table->integer('brand_id')->unsigned()->nullable();
            $table->foreign('brand_id')
            ->references('id')->on('brands')->onDelete('cascade');

            $table->integer('sub_category_id')->unsigned()->nullable();
            $table->foreign('sub_category_id')
            ->references('id')->on('sub_categories')->onDelete('cascade');
        });

        DB::statement('ALTER TABLE products ADD FULLTEXT search(name)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();
        Schema::table('products', function($table) {
            $table->dropIndex('search');
        });
        Schema::dropIfExists('products');
        Schema::enableForeignKeyConstraints();
    }
}
