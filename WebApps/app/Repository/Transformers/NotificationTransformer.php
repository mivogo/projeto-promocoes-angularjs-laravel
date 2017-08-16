<?php
namespace App\Repository\Transformers;

class NotificationTransformer extends Transformer{
	
	public function transform($notification){

		return [
		'id' => $notification->id,
		'product_name' => $notification->product_name,
		'brand_name' => $notification->brand_name,
		'retailer_name' => $notification->retailer_name,
		'price' => $notification->price,
		'base_price' => $notification->base_price,
		'percentage' => $notification->percentage,
		'read' => $notification->pivot->read
		];

	}

	public function transformArray($notifications){
		$response = array();

		foreach($notifications AS $notification){
			array_push($response,$this->transform($notification));

		}

		return $response;
	}
}