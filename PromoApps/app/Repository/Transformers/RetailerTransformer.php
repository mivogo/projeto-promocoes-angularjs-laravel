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
		$inc = 0;

		foreach($retailers AS $retailer){
			$response[$inc] = $this->transform($retailer);
			$inc++;
		}

		return $response;
	}
}