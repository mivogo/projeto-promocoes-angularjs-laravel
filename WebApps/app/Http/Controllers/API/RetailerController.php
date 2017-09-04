<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\User;
use App\Model\Retailer;
use App\Model\Product;
use App\Model\ProductRetailer;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Utils\SmithWatermanGotoh;
use App\Repository\Transformers\RetailerTransformer;
use App\Repository\Transformers\ProductTransformer;


class RetailerController extends Controller
{

	private $user;

	public function __construct(User $user)
	{
		$this->user = $user;
		$this->swgAlgorithm = new SmithWatermanGotoh();
	}

	public function showAll()
	{
		$retailers = Retailer::all();
		return response()->json((new RetailerTransformer)->transformArray($retailers));
	}

	public function productAvailability($pid){

		$retailers = Retailer::all();
		$r_product = Product::find($pid);
		$response = [];

		foreach ($retailers as $retailer) {
			$arr = [];

			$availability = true;
			$productRetailer = $retailer->productretailer()->where('product_id',$pid)->first();

			if(empty($productRetailer)){
				$suggestions = [];
				$availability = false;
				$possibleSuggestions = Product::with('productretailer')->whereHas('productretailer',  function($query) use ($retailer)  {
					$query->where('retailer_id', $retailer->id);
				})
				->where('sub_category_id',$r_product->sub_category_id)->get();

				foreach ($possibleSuggestions as $product) {
					if($this->suggestableResult($r_product,$product->name)){
						$p = $product->productretailer()->where('retailer_id',$retailer->id)->first();
						$transformed = (new ProductTransformer)->transformWithRetailer($product,$p);
						array_push($suggestions,$transformed);
					}
				}

				$suggestions = array_values(array_sort($suggestions, function ($value) {
					return $value['price'];
				}));

				$arr['suggestions'] = $suggestions;
				$arr['product'] = [];
			}else{
				$arr['product'] = (new ProductTransformer)->transformWithRetailer($r_product,$productRetailer);
			}

			$arr['retailer_id'] = $retailer->id;
			$arr['available'] = $availability;

			array_push($response, $arr);
		}

		return response()->json($response);
	}

	public function productSuggestions($prid,$rid){
		$productRetailer = ProductRetailer::find($prid);
		$r_product = Product::find($productRetailer->product_id);
		$retailerid = $rid;

		$suggestions = [];
		$possibleSuggestions = Product::with('productretailer')->whereHas('productretailer',  function($query) use ($retailerid)  {
			$query->where('retailer_id', $retailerid);
		})
		->where('sub_category_id',$r_product->sub_category_id)->get();

		foreach ($possibleSuggestions as $product) {
			if($this->suggestableResult($r_product,$product->name)){
				$p = $product->productretailer()->where('retailer_id',$retailerid)->first();
				$transformed = (new ProductTransformer)->transformWithRetailer($product,$p);
				array_push($suggestions,$transformed);
			}
		}

		$suggestions = array_values(array_sort($suggestions, function ($value) {
			return $value['price'];
		}));

		$arr['product'] = (new ProductTransformer)->transformWithRetailer($r_product,$productRetailer);
		$arr['suggestions'] = $suggestions;

		return response()->json($arr);
	}

	private function suggestableResult($product, $itemName){
		$result = false;
		$names = unserialize($product->relatedNames);	

		foreach ($names as $name) {
			if(!$result){
				$similarity = $this->swgAlgorithm->compare($itemName,$name);
				if($similarity >= 0.75){
					$result = true;
				}
			}
		}

		return $result;
	}
}