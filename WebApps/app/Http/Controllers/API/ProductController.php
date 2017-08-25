<?php

namespace App\Http\Controllers\API;

use Tymon\JWTAuth\JWTAuth;

use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use App\User;
use App\Jobs\CreatePriceNotification;
use App\Utils\SmithWatermanGotoh;
use App\Model\Product;
use App\Model\ProductRetailer;
use App\Model\Brand;
use App\Model\Retailer;
use App\Model\Category;
use App\Model\SubCategory;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Repository\Transformers\ProductTransformer;
use App\Repository\Transformers\BrandTransformer;
use JWTAuthException;
use Validator;
use DateTime;
use DB;
use Carbon\Carbon;

class ProductController extends Controller
{

	private $user;
	private $jwtauth;

	public function __construct(User $user,JWTAuth $jwtauth, Product $product)
	{
		$this->user = $user;
		$this->jwtauth = $jwtauth;
		$this->product = $product;
		$this->swgAlgorithm = new SmithWatermanGotoh();
	}

	public function teste(Request $request, $id){
		$product = Product::find($id);
		$product->productretailer;

		$one = $request->one;
		$two = $request->two;

		return response()->json($this->swgAlgorithm->compare($one,$two));
		return response()->json($product);
	}

	public function createFromList(Request $request)
	{

		ini_set('max_execution_time', 900);
		
		$i = $inc = $inc2 = $inc3 = 0;
		$idArr = [];

		$req_retailer = $request->get('Retailer');

		Retailer::unguard();
		$retailer = Retailer::where('name', $req_retailer)->first();
		if(empty($retailer)){
			$retailer = Retailer::create([
				'name' => $req_retailer
				]);
		}
		$retailer->save();
		Retailer::reguard();

		$arr = $request->get('Items');
		foreach($arr as $item) {
			$finalProductRetailer = null;

			Product::unguard();
			Brand::unguard();

			$item = $this->itemFix($item,$retailer);

			$idArr[$i] = $item['ID'];
			$i++;

			ProductRetailer::unguard();
			$productRetailer = ProductRetailer::with('product')->where('retailer_id',$retailer->id)->where('pid',$item['ID'])->first();

			if(!empty($productRetailer)){
				$inc++;
				$finalProductRetailer = $this->updateProductRetailer($productRetailer,$item);

			}else{

				$brand = $this->findBrand($item['Brand']);

				$diff = $this->weightDifference($item);

				$existingProducts = Product::with('productretailer')->whereHas('productretailer',  function($query) use ($retailer)  {
					$query->where('retailer_id','!=',$retailer->id);
				})
				->where('brand_id',$brand->id)->whereBetween('weight', array($item['Weight']-$diff, $item['Weight']+$diff))->get();

				$selectedProduct = null;
				if(!$existingProducts->isEmpty()){
					$currentResult = 0;
					foreach($existingProducts as $existingProduct){
						$testResult = $this->bestResult($existingProduct,$item['Name']);
						if($testResult >= 0.75 && $testResult > $currentResult){
							$currentResult = $testResult;
							$selectedProduct = $existingProduct;
						}
					}
				}

				if(empty($selectedProduct)){
					$inc2++;
					$this->createNewProduct($retailer,$brand,$item);
				}else{
					$associationExists = ProductRetailer::where('product_id',$selectedProduct->id)->where('retailer_id',$retailer->id)->first();
					if(empty($associationExists)){
						$inc3++;
						$finalProductRetailer = $this->addRetailerToProduct($retailer,$selectedProduct,$item);	
					}else{
						$inc2++;
						$this->createNewProduct($retailer,$brand,$item);
					}
				}
			}

			ProductRetailer::reguard();
			Brand::reguard();
			Product::reguard();

			if(!empty($finalProductRetailer) && $finalProductRetailer->updated_at->toDateString() == Carbon::today()->toDateString() && $finalProductRetailer->base_price > $finalProductRetailer->price){
				$percentage = $this->calculatePricePercentageDifference($finalProductRetailer);
				if($percentage >= 0.25){
					$this->dispatch((new CreatePriceNotification($finalProductRetailer,$percentage)));
				}
			}
		}

		$this->disableProducts($idArr,$retailer);
		return response()->json(['ja_existem'=>$inc,'novos'=>$inc2,'iguais_noutro_retailer'=>$inc3,'total'=>count($arr)]);
	}

	public function showAll()
	{
		ini_set('max_execution_time', 900);

		$products = Product::where('active',true)->get();
		return response()->json((new ProductTransformer)->transformArray($products));
	}

	public function showAllFromRetailer(Request $request,$retailerid)
	{
		ini_set('max_execution_time', 900);

		$validator = Validator::make($request->all(), [
			'order' => 'required',
			'item_amount' => 'required'
			]);

		if ($validator->fails()) {
			return response()->json(['error'=>$validator->errors()], 401);            
		}
		
		$direction = 'asc';
		$order = $request->order;
		if(strcmp($order, '-price') == 0){
			$direction = 'desc';
			$order = 'price';
		} 

		$query = ProductRetailer::with(['product'])->select('product_retailers.*', 'products.name as pname', 'sub_categories.name as sname', 'categories.name as cname', 'brands.name as bname')
		->join('products','product_id','=','products.id')
		->join('sub_categories','sub_category_id','=','sub_categories.id')
		->join('categories','category_id','=','categories.id')
		->join('brands','brands.id','=','brand_id')
		->where('retailer_id', $retailerid)
		->where('product_retailers.active',true);

		$r_brand = $request->brand;
		$r_category = $request->category;
		$r_subcategory = $request->subcategory;
		$r_search = $request->search;

		$query = $this->filterResult($r_brand,$r_category,$r_subcategory,$r_search,$query,$retailerid);
		$query = $this->sortResult($r_search,$order,$direction,$query);

		$aux = $query->get();
		$result = $query->paginate($request->item_amount);

		$brands = array();

		if(empty($r_brand)){
			$brands = $this->uniqueCollection($aux,'bname');
		}

		$categories = array();

		if(empty($r_category)){
			$categories = $this->uniqueCollection($aux,'cname');
		}

		if(!empty($r_brand) && !empty($r_category)){
			$brands = $this->uniqueCollection($aux,'bname');
			$categories = $this->uniqueCollection($aux,'cname');
		}

		$result->getCollection()->transform(function ($p, $key) use ($retailerid) {
			$product = $p->product;
			return (new ProductTransformer)->transformWithRetailer($product,$p);
		});

		return response()->json(['products' => $result, 'brands' => $brands, 'categories' => $categories]);
	}


	public function showProduct($id, $prid)
	{	
		$product = Product::find($id);
		$productRetailer = ProductRetailer::find($prid);

		$retailerid = $productRetailer->retailer_id;
		$productName = $product->name;

		$match = "MATCH (name) AGAINST (? IN BOOLEAN MODE)";

		$existingProducts = Product::whereHas('productretailer',  function($query) use ($retailerid)  {
			$query->where('retailer_id', $retailerid);
		})->where('sub_category_id',$product->sub_category_id)->where('id','!=',$product->id)->orderByRaw($match . " DESC", [$productName])->get();

		$relatedProducts = [];
		if(!$existingProducts->isEmpty()){
			foreach($existingProducts as $existingProduct){
				$testResult = $this->bestResult($existingProduct,$productName);
				if($testResult >= 0.65){
					array_push($relatedProducts, $existingProduct);
				}
			}
		}

		$transformedProducts = [];
		foreach($relatedProducts AS $p){
			$pr = ProductRetailer::where('product_id',$p->id)->where('retailer_id',$retailerid)->first();
			$new = (new ProductTransformer)->transformWithRetailer($p,$pr);
			array_push($transformedProducts, $new);
		}

		$transformedProduct = (new ProductTransformer)->transformWithRetailerWithPrices($product,$productRetailer,$product->productretailer);

		return response()->json([
			'product' => $transformedProduct,
			'related' => $transformedProducts
			]);
	}

	private function createNewProduct($retailer,$brand,$item){

		SubCategory::unguard();
		Category::unguard();
		$category = Category::where('name',$item['Category'])->first();
		if(empty($category)){
			$category = Category::create([
				'name' => $item['Category']
				]);

			$category->save();
		}

		$subCategory = SubCategory::where('name',$item['Sub-Category'])->where('category_id',$category->id)->first();
		if(empty($subCategory)){
			$subCategory = SubCategory::create();
			$subCategory->name = $item['Sub-Category'];

			$category->subcategory()->save($subCategory);
			Category::reguard();

			$subCategory->save();
		}

		$newProduct = new Product;
		$newProduct->name = $item['Name'];
		$newProduct->weight = $item['Weight'];
		$newProduct->weight_type = $item['Weight_Type'];

		$arr = array($item['Name']);
		$newProduct->relatedNames = serialize($arr);

		$newProductRetailer = $this->createNewProductRetailer($item);

		$newProduct->active = true;

		$newProduct->save();
		$newProduct->productretailer()->save($newProductRetailer);
		$retailer->productretailer()->save($newProductRetailer);

		$brand->product()->save($newProduct);

		$subCategory->product()->save($newProduct);

		$newProduct->push();
		SubCategory::reguard();

		return $newProductRetailer;
	}
	
	private function addRetailerToProduct($retailer,$selectedProduct,$item){
		$newProductRetailer = $this->createNewProductRetailer($item);

		$names = unserialize($selectedProduct->relatedNames);
		array_push($names, $item['Name']);
		$selectedProduct->relatedNames = serialize($names);

		$selectedProduct->save();
		$selectedProduct->productretailer()->save($newProductRetailer);
		$retailer->productretailer()->save($newProductRetailer);

		$selectedProduct->push();

		return $newProductRetailer;
	}

	private function createNewProductRetailer($item){
		$newProductRetailer = new ProductRetailer;

		if($item['Price'] == 0){
			$newProductRetailer->price = $item['Price_per_weight'];
			$newProductRetailer->base_price = $item['Price_per_weight'];
		}else{
			$newProductRetailer->price = $item['Price'];
			$newProductRetailer->base_price = $item['Price'];
		}

		if(empty($item['Price_per_weight']) || $item['Price_per_weight'] == 0){
			$newProductRetailer->price_per_weight = $item['Price'];
		}else{
			$newProductRetailer->price_per_weight = $item['Price_per_weight'];
		}

		$newProductRetailer->hasDiscount = false;
		$newProductRetailer->type_of_weight = $item['Type_of_weight'];
		$newProductRetailer->pid = $item['ID'];
		$newProductRetailer->image = $item['Image'];
		$newProductRetailer->link = $item['Link'];
		$newProductRetailer->active = true;

		return $newProductRetailer;
	}

	private function updateProductRetailer($productRetailer,$item){
		$product = $productRetailer->product;
		if($product->active == false){

			$product->active = true;
			$product->save();
		}

		if($item['Price'] == 0){
			$newPrice = $item['Price_per_weight'];
		}else{
			$newPrice = $item['Price'];
		}		

		$price = $productRetailer->price;

		if($price == $newPrice){
			$days = $this->getDaysFromDateDiff($productRetailer);
			if($days >= 7){
				$productRetailer->price = $newPrice;
				$productRetailer->base_price = $newPrice;
				$productRetailer->hasDiscount = false;

				$productRetailer->save();
			}

			if($productRetailer->active == false){
				$productRetailer->active = true;

				$productRetailer->save();
			}

			return $productRetailer;
		}

		if($newPrice>$price){
			$productRetailer->price = $newPrice;
			$productRetailer->base_price = $newPrice;
			$productRetailer->hasDiscount = false;
		}

		if($productRetailer->price>$newPrice){
			$productRetailer->price = $newPrice;
			$productRetailer->hasDiscount = true;
		}

		if(empty($item['Price_per_weight']) || $item['Price_per_weight'] == 0){
			$productRetailer->price_per_weight = $newPrice;
		}else{
			$productRetailer->price_per_weight = $item['Price_per_weight'];
		}

		if($productRetailer->active == false){
			$productRetailer->active = true;
		}

		$productRetailer->save();

		return $productRetailer;
	}

	private function getDaysFromDateDiff($productRetailer){
		$pdate = $productRetailer->updated_at;
		$sdate = date('Y-m-d h:i:s', time());
		$dt1 = new DateTime($pdate);
		$dt2 = new DateTime($sdate);

		return $dt2->format("Ymd")-$dt1->format("Ymd");
	}

	private function itemFix($item, $retailer){
		$item['Price'] = doubleval($item['Price']);
		$item['Price_per_weight'] = doubleval($item['Price_per_weight']);
		$item['ID'] = intval($item['ID']);
		$item['Weight'] = doubleval($item['Weight']);

		if(empty($item['Brand'])){
			$item['Brand'] = $retailer->name;
		}	

		if(empty($item['Type_of_weight'])){
			$item = $this->weightFix($item);
		}

		return $item;
	}

	private function weightDifference($item){
		if(strcmp($item['Weight_Type'], "ml") == 0){
			return 500;
		}

		if(strcmp($item['Weight_Type'], "cl") == 0 || strcmp($item['Weight_Type'], "g") == 0){
			return 50;
		}

		return 1;
	}

	private function weightFix($item){
		if(strcmp($item['Weight_Type'], "ml") == 0){
			$item['Type_of_weight'] = 'lt';
		}

		if(strcmp($item['Weight_Type'], "cl") == 0){
			$item['Type_of_weight'] = 'lt';
		}

		if(strcmp($item['Weight_Type'], "g") == 0){
			$item['Type_of_weight'] = 'kg';
		}

		$converted = 0.001 * $item['Weight'];
		$item['Price_per_weight'] = $item['Price'] / $converted;

		return $item;
	}

	private function bestResult($product,$itemName){
		$bestResult = 0;
		$names = unserialize($product->relatedNames);				
		foreach ($names as $name) {
			$result = $this->swgAlgorithm->compare($name, $itemName);
			if($result > $bestResult){
				$bestResult = $result;
			}
		}
		return $bestResult;
	}

	private function disableProducts($array,$retailer){

		Product::unguard();
		ProductRetailer::unguard();

		$result = ProductRetailer::where('retailer_id',$retailer->id)->whereNotIn('pid',$array)->get();

		foreach ($result as $productRetailer) {
			$days = $this->getDaysFromDateDiff($productRetailer);
			if($days >= 7 && $productRetailer->active==true){
				$productRetailer->active = false;
				$productRetailer->save();

				$product = $productRetailer->product;
				$actives = ProductRetailer::where('product_id',$product->id)->where('active',true)->get();
				if($actives->isEmpty()){
					$product->active = false;
					$product->save();
				}
			}
		}

		ProductRetailer::reguard();
		Product::reguard();
	}

	private function sortResult($relevance,$order,$direction,$query){
		if(strcmp($order, 'relevance') == 0){
			$match = "MATCH (pname) AGAINST (? IN BOOLEAN MODE)";
			$query->orderByRaw($match . " DESC", [$relevance]);
		}

		if(strcmp($order, 'brand') == 0){
			$query->orderBy('bname', 'asc');
		}

		if(strcmp($order, 'name') == 0){
			$query->orderBy('pname', 'asc');
		}

		if(strcmp($order, 'price') == 0){
			$query->orderBy('price', $direction);
		}

		return $query;
	}

	private function filterResult($brand, $category, $subcategory, $search, $query, $retailerid){

		if(!empty($brand)){
			$query->where('brands.name', $brand);
		}

		if(!empty($category)){
			$query->where('categories.name', $category);
		}

		if(!empty($subcategory)){
			$query->where('sub_categories.name', $subcategory);
		}

		if(!empty($search)){
			$matchp = "MATCH (products.name) AGAINST (? IN BOOLEAN MODE) and products.id = product_retailers.product_id and product_retailers.retailer_id = ?";
			$matchb = "MATCH (brands.name) AGAINST (? IN BOOLEAN MODE) and products.id = product_retailers.product_id and product_retailers.retailer_id = ?";
			$matchc = "MATCH (categories.name) AGAINST (? IN BOOLEAN MODE) and products.id = product_retailers.product_id and product_retailers.retailer_id = ?";

			$param = array();
			array_push($param,$search);
			array_push($param,$retailerid);

			if(!empty($brand)){
				$matchp = $matchp." and brands.name = ?";
				$matchb = $matchb." and brands.name = ?";
				$matchc = $matchc." and brands.name = ?";
				array_push($param,$brand);
			}

			if(!empty($category)){
				$matchp = $matchp." and categories.name = ?";
				$matchb = $matchb." and categories.name = ?";
				$matchc = $matchc." and categories.name = ?";
				array_push($param, $category);
			}

			if(!empty($subcategory)){
				$matchp = $matchp." and sub_categories.name = ?";
				$matchb = $matchb." and sub_categories.name = ?";
				$matchc = $matchc." and sub_categories.name = ?";
				array_push($param, $subcategory);
			}

			$query->whereRaw($matchp, $param)->orWhereRaw($matchb, $param)->orWhereRaw($matchc, $param);
		}


		return $query;
	}

	private function findBrand($_brand){
		$brand = Brand::where('name',$_brand)->first();
		if(empty($brand)){

			$simple = strtolower(preg_replace("/[^a-zA-Z]+/", "", $_brand));

			if(strlen($_brand)>5){

				$char = substr($_brand, 0, 1)."%";

				$brands = Brand::whereRaw('brands.name LIKE ? and char_length(brands.name)>5',[$char])->get();

				$found = null;
				$compared = null;

				if(!$brands->isEmpty()){
					$currentResult = 0;

					foreach ($brands as $b) {
						if(strpos($b->simple, $simple)){
							$found = $b;

							if($found == null && strpos($simple, $b->simple)){
								$found = $b;
							}
						}

						$testResult = $this->swgAlgorithm->compare($b->simple,$simple);
						if($testResult >= 0.9 && $testResult > $currentResult){
							$currentResult = $testResult;
							$compared = $b;
						}
					}
				}

				if($compared != null){
					return $compared;
				}

				if($found != null){
					return $found;
				}
			}

			$brand = Brand::create([
				'name' => $_brand,
				'simple' => $simple
				]);
		}

		return $brand;
	}

	private function uniqueCollection($collection, $uid){
		$unique = $collection->unique($uid)->values();
		$transformed = $unique->transform(function ($item) use ($uid)
		{
			return $item[$uid];
		})->toArray();

		return $transformed;
	}

	private function calculatePricePercentageDifference($productRetailer){
		$difference = $productRetailer->base_price - $productRetailer->price;
		return $difference / $productRetailer->base_price;
	}
	
}