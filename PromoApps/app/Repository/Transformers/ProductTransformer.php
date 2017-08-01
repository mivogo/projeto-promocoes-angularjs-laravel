<?php
namespace App\Repository\Transformers;

class ProductTransformer extends Transformer{
	
	public function transform($product){
		$info = $product->productretailer;
		$sub = $product->subcategory;
		$brand = $product->brand;
		$retailer = $info[0]->retailer;
		return [
		'name' => preg_replace('/\s+/', ' ', $product->name),
		'price' => $info[0]['price'],
		'weight' => $product->weight,
		'weight_type' => $product->weight_type,
		'price_weight' => $info[0]['price_per_weight'],
		'type_weight'  => $info[0]['type_of_weight'],
		'brand' => $brand->name,
		'retailer'=> $retailer->name,
		'subcategory' => $sub->name,
		'category' => $sub->category->name,
		'image' => $info[0]['image'],
		'link' => $info[0]['link']

		];	

	}	

	public function transformArray($products){
		$response = array();
		$inc = 0;

		foreach($products AS $product){
			$response[$inc] = (new ProductTransformer)->transform($product);
			$inc++;
		}

		return $response;
	}

}