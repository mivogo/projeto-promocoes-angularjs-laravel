<?php
namespace App\Repository\Transformers;

class RetailerTransformer extends Transformer{
	
	public function transform($retailer){

		return [
		'id' => $retailer->id,
		'name' => $retailer->name
		];

	}

	public function transformArray($retailers){
		$response = array();

		foreach($retailers AS $retailer){
			array_push($response,$this->transform($retailer));

		}

		return $response;
	}
}