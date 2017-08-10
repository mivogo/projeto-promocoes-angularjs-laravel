<?php

use Illuminate\Database\Seeder;

class CategoryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	DB::table('categories')->insert(
    		array([
    			'name' => 'Animais'
    			],
    			[
    			'name' => 'Bebidas'
    			],
    			[
    			'name' => 'Bebé'
    			],
    			[
    			'name' => 'Casa'
    			],
    			[
    			'name' => 'Congelados'
    			],
    			[
    			'name' => 'Frescos'
    			],
    			[
    			'name' => 'Higiene e Beleza'
    			],
    			[
    			'name' => 'Lacticínios'
    			],
    			[
    			'name' => 'Limpeza'
    			],
    			[
    			'name' => 'Mercearia'
    			]
    			));
    }
}
