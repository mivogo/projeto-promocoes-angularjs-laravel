<?php

use Illuminate\Database\Seeder;

class RetailerTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	DB::table('retailers')->insert(
    		array([
    			'name' => 'Continente'
    			],
    			[
    			'name' => 'Jumbo'
    			],
    			[
    			'name' => 'Intermarche'
    			]
    			));
    }
}
