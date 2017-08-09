<?php
namespace App\Repository\Transformers;

class CategoryTransformer extends Transformer{
	
	public function transform($category){
		$subcategories = [];
		foreach ($category->subcategory as $sub) {
			array_push($subcategories,['name' => $sub->name]);
		}
		return [
		'id' => $category->id,
		'name' => $category->name,
		'subcategories' => $subcategories
		];

	}

	public function transformArray($categories){
		$response = array();

		foreach($categories AS $category){
			array_push($response, $this->transform($category));
		}

		return $response;
	}
}