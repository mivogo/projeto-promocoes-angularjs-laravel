<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateShoppingListTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        if (!Schema::hasTable('shopping_lists')) {
            Schema::create('shopping_lists', function (Blueprint $table) {
                $table->increments('id');
                $table->string('name');
                $table->string('description')->nullable();
                $table->timestamps();

                $table->integer('retailer_id')->unsigned()->nullable();
                $table->foreign('retailer_id')
                ->references('id')->on('retailers')->onDelete('cascade');

                $table->integer('profile_id')->unsigned()->nullable();
                $table->foreign('profile_id')
                ->references('id')->on('profiles')->onDelete('cascade');
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

        Schema::dropIfExists('shopping_lists');

    }
}
