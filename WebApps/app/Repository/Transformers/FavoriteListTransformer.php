<?php
namespace App\Repository\Transformers;

class FavoriteListTransformer extends Transformer{

	public function transform($product){
		$productretailer = $product->productretailer;
		$info = $productretailer[0];
		$sub = $product->subcategory;
		$brand = $product->brand;
		$retailer = $info->retailer;

		$prices = [];

		foreach ($productretailer as $pr) {
				array_push($prices, ['price' => $pr->price, 'base_price' => $pr->base_price,'hasDiscount'=> $pr->hasDiscount,'retailer' => $pr->retailer->name, 'retailer_id' => $pr->retailer->id]);
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