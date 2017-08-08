<?php
namespace App\Repository\Transformers;

class ProductTransformer extends Transformer{
	
	public function transform($product){
		$info = $product->productretailer;
		$sub = $product->subcategory;
		$brand = $product->brand;
		$retailer = $info[0]->retailer;
		return [
		'id' => $info->id,
		'product_id' => $product->id,
		'name' => preg_replace('/\s+/', ' ', $product->name),
		'price' => $info[0]['price'],
		'base_price' => $info[0]['base_price'],
		'hasDiscount' => $info[0]['hasDiscount'],
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
			$response[$inc] = $this->transform($product);
			$inc++;
		}

		return $response;
	}


	public function transformWithRetailer($product,$productretailer){
		$info = $productretailer;
		$sub = $product->subcategory;
		$brand = $product->brand;
		$retailer = $info->retailer;
		return [
		'id' => $info->id,
		'product_id' => $product->id,
		'name' => preg_replace('/\s+/', ' ', $product->name),
		'price' => $info->price,
		'base_price' => $info->base_price,
		'hasDiscount' => $info->hasDiscount,
		'weight' => $product->weight,
		'weight_type' => $product->weight_type,
		'price_weight' => $info->price_per_weight,
		'type_weight'  => $info->type_of_weight,
		'brand' => $brand->name,
		'retailer'=> $retailer->name,
		'subcategory' => $sub->name,
		'category' => $sub->category->name,
		'image' => $info->image,
		'link' => $info->link
		];	

	}	

	public function transformArrayWithRetailer($productRetailers){
		$response = array();
		$inc = 0;

		foreach($productRetailers AS $productRetailer){
			$product = $productRetailer->product;
			$response[$inc] = $this->transformWithRetailer($product,$productRetailer);
			$inc++;
		}

		return $response;
	}

}