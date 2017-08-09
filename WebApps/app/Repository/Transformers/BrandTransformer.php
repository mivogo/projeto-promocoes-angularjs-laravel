<?php
namespace App\Repository\Transformers;

class BrandTransformer extends Transformer{
	
	public function transform($brand){
		return [
		'name' => preg_replace('/\s+/', ' ', $brand->name)
		];	

	}	

	public function transformArray($brands){
		$response = array();

		foreach($brands AS $brand){
			array_push($response, $this->transform($brand));
		}

		return $response;
	}

}