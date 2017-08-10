<?php

use Illuminate\Database\Seeder;

class BrandTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('brands')->insert(
    		array([
    			'name' => 'Coca Cola',
    			'simple' => 'cocacola'
    			],
    			[
    			'name' => 'Air Wick',
    			'simple' => 'airwick'
    			],
    			[
    			'name' => 'Peixe',
    			'simple' => 'peixe'
    			],
    			[
    			'name' => 'Bacalhau',
    			'simple' => 'bacalhau'
    			],
    			[
    			'name' => 'Continente',
    			'simple' => 'continente'
    			],
    			[
    			'name' => 'Jumbo',
    			'simple' => 'jumbo'
    			],
    			[
    			'name' => 'Intermarche',
    			'simple' => 'intermarche'
    			]
    			));
    }
}
