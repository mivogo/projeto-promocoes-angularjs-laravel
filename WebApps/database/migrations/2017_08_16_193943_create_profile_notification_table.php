<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProfileNotificationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('notification_profile')) {
            Schema::create('notification_profile', function (Blueprint $table) {
                $table->boolean('read');

                $table->integer('notification_id')->unsigned()->nullable();
                $table->foreign('notification_id')->references('id')
                ->on('notifications')->onDelete('cascade');

                $table->integer('profile_id')->unsigned()->nullable();
                $table->foreign('profile_id')->references('id')
                ->on('profiles')->onDelete('cascade');

                $table->timestamps();
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
        Schema::table('notification_profile', function($table)
        {
            $table->dropColumn('read');
        });
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('notification_profile');
        Schema::enableForeignKeyConstraints();
    }
}
