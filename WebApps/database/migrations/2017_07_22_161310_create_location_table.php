    <?php

    use Illuminate\Support\Facades\Schema;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Database\Migrations\Migration;

    class CreateLocationTable extends Migration
    {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('locations')) {

            Schema::create('locations', function (Blueprint $table) {
                $table->increments('id');
                $table->string('name');
                $table->string('zipcode');
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

            Schema::dropIfExists('locations');

        }
    }
