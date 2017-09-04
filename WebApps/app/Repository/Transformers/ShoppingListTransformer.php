<?php
namespace App\Repository\Transformers;

class ShoppingListTransformer extends Transformer{

	public function transform($list){		
		return [
		'id' => $list->id,
		'name' => preg_replace('/\s+/', ' ', $list->name),
		'description' => $list->description,
		'retailer_id' => $list->retailer_id,
		'retailer_name' => $list->retailer->name,
		];	
	}	

	public function transformFromArray($lists){
		$response = array();

		foreach($lists as $list){
			$sum = 0;
			$qt = 0;
			$price = 0;

			$retailerid = $list->retailer_id;
			$products = $list->product;
			foreach ($products as $product) {
				if($product->active){
					$sum +=1;
					$qt += $product->pivot->quantity;
					$price += ($product->productretailer()->where('retailer_id',$retailerid)->first()->price) * $product->pivot->quantity;
				}
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
		'link' => $info->link,
		'quantity' => $product->pivot->quantity
		];	
		
	}	

}