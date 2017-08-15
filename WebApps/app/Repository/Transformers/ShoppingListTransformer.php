<?php
namespace App\Repository\Transformers;

class ShoppingListTransformer extends Transformer{

	public function transform($list){		
		return [
		'id' => $list->id,
		'name' => preg_replace('/\s+/', ' ', $list->name),
		'description' => $list->description,
		'retailer_id' => $list->retailer_id,
		];	
	}	

	public function transformFromArray($lists){
		$response = array();

		foreach($lists AS $list){
			$sum = 0;
			$qt = 0;
			$price = 0;

			$retailerid = $list->retailer_id;
			$products = $list->product;
			foreach ($products as $product) {
				$sum +=1;
				$qt += $product->pivot->quantity;
				$price += ($product->productretailer()->where('retailer_id',$retailerid)->first()->price * $product->pivot->quantity);
			}
			
			$new = (new ShoppingListTransformer)->transformWithQuantity($list,$sum,$qt,$price);
			array_push($response, $new);
		}	

		return $response;
	}

	public function transformWithQuantity($list, $sum, $qt, $price){	

		$response = $this->transform($list);
		$response['total_products'] = $sum;
		$response['total_quantity'] = $qt;
		$response['total_price'] = $price;

		return $response;
	}	

	public function transformProduct($product, $productretailer){
		$sub = $product->subcategory;
		$brand = $product->brand;
		return [
		'id' => $productretailer->id,
		'product_id' => $product->id,
		'name' => preg_replace('/\s+/', ' ', $product->name),
		'price' => $productretailer->price,
		'base_price' => $productretailer->base_price,
		'hasDiscount' => $productretailer->hasDiscount,
		'quantity' => $product->pivot->quantity,
		'brand' => $brand->name,
		'image' => $productretailer->image
		];	
	}	

}