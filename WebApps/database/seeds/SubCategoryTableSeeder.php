<?php

use Illuminate\Database\Seeder;

class SubCategoryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

    	$id = DB::table('categories')
    	->select('id')
    	->where('name', 'Animais')
    	->first()
    	->id;

    	DB::table('sub_categories')->insert(
    		array(
    			[
    			'name' => 'Aves',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Cães',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Gatos',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Peixes e Tartarugas',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Roedores',
    			'category_id' => $id
    			]
    			));


    	$id = DB::table('categories')
    	->select('id')
    	->where('name', 'Bebidas')
    	->first()
    	->id;

    	DB::table('sub_categories')->insert(
    		array(
    			[
    			'name' => 'Cervejas',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Champanhes e espumantes',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Energéticas',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Espirituosas',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Refrigerantes',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Sumos e néctares',
    			'category_id' => $id
    			],    			
    			[
    			'name' => 'Vinhos',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Vinhos licorosos e aperitivos',
    			'category_id' => $id
    			]
    			));

    	$id = DB::table('categories')
    	->select('id')
    	->where('name', 'Bebé')
    	->first()
    	->id;

    	DB::table('sub_categories')->insert(
    		array(
    			[
    			'name' => 'Alimentação e Acessórios',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Higiene Bebé e Criança',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Pré-Mamã e Mamã',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Puericultura',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Vestuário',
    			'category_id' => $id
    			]
    			));

    	$id = DB::table('categories')
    	->select('id')
    	->where('name', 'Casa')
    	->first()
    	->id;

    	DB::table('sub_categories')->insert(
    		array(
    			[
    			'name' => 'Artigos de Festa',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Banho',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Bricolage e Jardim',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Cozinha',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Escritório',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Garagem',
    			'category_id' => $id
    			],    			
    			[
    			'name' => 'Ilumninação e Energia',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Lavandaria',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Mobiliário',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Pequenos Eletrodomésticos',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Quarto',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Sala',
    			'category_id' => $id
    			]
    			));

    	$id = DB::table('categories')
    	->select('id')
    	->where('name', 'Frescos')
    	->first()
    	->id;

    	DB::table('sub_categories')->insert(
    		array(
    			[
    			'name' => 'Charcutaria',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Frutas',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Legumes',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Ovos',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Padaria e Pastelaria',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Peixaria',
    			'category_id' => $id
    			],    			
    			[
    			'name' => 'Refeições',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Talho',
    			'category_id' => $id
    			]
    			));



    	$id = DB::table('categories')
    	->select('id')
    	->where('name', 'Congelados')
    	->first()
    	->id;

    	DB::table('sub_categories')->insert(
    		array(
    			[
    			'name' => 'Carnes',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Gelados e Sobremesas',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Legumes e Frutas',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Peixes',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Refeições',
    			'category_id' => $id
    			]
    			));

    	$id = DB::table('categories')
    	->select('id')
    	->where('name', 'Higiene e Beleza')
    	->first()
    	->id;

    	DB::table('sub_categories')->insert(
    		array(
    			[
    			'name' => 'Cabelo',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Cuidados de Saúde',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Higiene Corportal',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Higiene Oral',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Homem',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Papel higiénico e lenços papel',
    			'category_id' => $id
    			],    			
    			[
    			'name' => 'Perfumaria e Desodorizantes',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Produtos cosméticos',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Produtos para depilação',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Produtos para incontinência',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Produtos para mãe, pés e Unhas',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Produtos para Sol',
    			'category_id' => $id
    			]
    			));


    	$id = DB::table('categories')
    	->select('id')
    	->where('name', 'Lacticínios')
    	->first()
    	->id;

    	DB::table('sub_categories')->insert(
    		array(
    			[
    			'name' => 'Iogurtes',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Leite',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Manteigas e Cremes de Barrar',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Natas e Margarinas Culinárias',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Ovos',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Queijos',
    			'category_id' => $id
    			],    			
    			[
    			'name' => 'Sobremesas e Polpas de Fruta',
    			'category_id' => $id
    			]
    			));

    	$id = DB::table('categories')
    	->select('id')
    	->where('name', 'Limpeza')
    	->first()
    	->id;

    	DB::table('sub_categories')->insert(
    		array(
    			[
    			'name' => 'Casa',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Roupa',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Tratamento de Roupa',
    			'category_id' => $id
    			]
    			));


    	$id = DB::table('categories')
    	->select('id')
    	->where('name', 'Mercearia')
    	->first()
    	->id;

    	DB::table('sub_categories')->insert(
    		array(
    			[
    			'name' => 'Arroz, Massa e Farinha',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Azeite, Óleo e Vinagre',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Açúcar e Adoçante',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Batatas fritas e snacks',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Bolachas, biscoitos e bolos',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Cereais e barras',
    			'category_id' => $id
    			],    			
    			[
    			'name' => 'Chá, Café e Bebidas quentes',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Conservas e patês',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Doçaria',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Feijão e Grão',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Mel, Doces e Cremes para barrar',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Molhos e temperos',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Sopas e refeições',
    			'category_id' => $id
    			],
    			[
    			'name' => 'Tostas e Pão Ralado',
    			'category_id' => $id
    			]
    			));
    }
}
