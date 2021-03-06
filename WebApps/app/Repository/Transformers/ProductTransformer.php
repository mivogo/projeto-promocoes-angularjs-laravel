<?php
namespace App\Repository\Transformers;

class ProductTransformer extends Transformer{
	
	public function transform($product){
		$info = $product->productretailer;
		$sub = $product->subcategory;
		$brand = $product->brand;
		$retailer = $info[0]->retailer;
		return [
		'id' => $info[0]['id'],
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

		foreach($products AS $product){
			array_push($response, $this->transform($product));
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
		'pid' => $info->pid,
		'link' => $info->link
		];	
	}	

	public function transformArrayWithRetailer($productRetailers){
		$response = array();

		foreach($productRetailers AS $productRetailer){
			$product = $productRetailer->product;
			array_push($response,$this->transformWithRetailer($product,$productRetailer));
		}

		return $response;
	}

	public function transformWithRetailerWithPrices($product,$productretailer,$productretailers){
		$info = $productretailer;
		$sub = $product->subcategory;
		$brand = $product->brand;
		$retailer = $info->retailer;

		$prices = [];
		foreach ($productretailers as $pr) {
				array_push($prices, ['price' => $pr->price, 'base_price' => $pr->base_price, 'hasDiscount'=> $pr->hasDiscount,'retailer' => $pr->retailer->name,'retailer_id' => $pr->retailer->id]);
		}
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
		'link' => $info->link,
		'retailers_prices' => $prices
		];	
	}	


}