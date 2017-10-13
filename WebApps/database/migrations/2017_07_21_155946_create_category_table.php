<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('categories')) {
            
            Schema::create('categories', function (Blueprint $table) {
                $table->increments('id');
                $table->string('name');
                $table->timestamps();
            });

            DB::statement('ALTER TABLE categories ADD FULLTEXT search(name)');

        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('categories', function($table) {
            $table->dropIndex('search');
        });
        Schema::dropIfExists('categories');

    }
}
