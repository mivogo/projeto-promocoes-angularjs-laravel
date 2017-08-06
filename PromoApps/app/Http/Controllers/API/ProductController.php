<?php

namespace App\Http\Controllers\API;

use Tymon\JWTAuth\JWTAuth;

use Illuminate\Http\Request;
use App\User;
use App\Utils\SmithWatermanGotoh;
use App\Model\Product;
use App\Model\ProductRetailer;
use App\Model\Brand;
use App\Model\Retailer;
use App\Model\Category;
use App\Model\SubCategory;
use App\Http\Requests;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;
use App\Repository\Transformers\ProductTransformer;
use JWTAuthException;
use Validator;
use DateTime;

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

			Product::unguard();
			Brand::unguard();

			$item = $this->itemFix($item,$retailer);

			$idArr[$i] = $item['ID'];
			$i++;

			ProductRetailer::unguard();
			$productRetailer = ProductRetailer::with('product')->where('retailer_id',$retailer->id)->where('pid',$item['ID'])->first();

			if(!empty($productRetailer)){

				$inc++;
				//return response()->json([$inc,$inc2,count($arr),intval($item['ID']),$productRetailer]);
				$this->updateProductRetailer($productRetailer,$item);

			}else{


				$brand = Brand::where('name', $item['Brand'])->first();
				if(empty($brand)){
					$brand = Brand::create([
						'name' => $item['Brand']
						]);
					$brand->save();
				}

				$existingProducts = Product::with('productretailer')->whereHas('productretailer',  function($query) use ($retailer)  {
					$query->where('retailer_id','!=',$retailer->id);
				})
				->where('brand_id',$brand->id)->whereBetween('weight', array($item['Weight']-2, $item['Weight']+2))->get();

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
					$inc3++;

					$this->addRetailerToProduct($retailer,$selectedProduct,$item);
				}
			}

			ProductRetailer::reguard();
			Brand::reguard();
			Product::reguard();
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

	public function showAllFromRetailer($retailerid)
	{
		ini_set('max_execution_time', 900);

		$productRetailers = ProductRetailer::with('product')->with('retailer')->where('retailer_id',$retailerid)->where('active',true)->paginate();
		$productRetailers -> withPath('');
		return response()->json((new ProductTransformer)->transformArrayWithRetailer($productRetailers));
	}


	public function showProduct($id)
	{
		$product = Product::find($id);
		$product->productRetailer;
		return response()->json($product);
	}

	private function createNewProduct($retailer,$brand,$item){

		SubCategory::unguard();
		$subCategory = SubCategory::where('name',$item['Sub-Category'])->first();
		if(empty($subCategory)){
			$subCategory = SubCategory::create();
			$subCategory->name = $item['Sub-Category'];

			Category::unguard();
			$category = Category::where('name',$item['Category'])->first();
			if(empty($category)){
				$category = Category::create([
					'name' => $item['Category']
					]);
			}

			$category->save();
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
	}

	private function createNewProductRetailer($item){
		$newProductRetailer = new ProductRetailer;

		if(strcmp($item['Price'], 'None') == 0){
			$newProductRetailer->price = $item['Price_per_weight'];
			$newProductRetailer->base_price = $item['Price_per_weight'];
		}else{
			$newProductRetailer->price = $item['Price'];
			$newProductRetailer->base_price = $item['Price'];
		}

		if(empty($item['Price_per_weight']) || strcmp($item['Price_per_weight'], 'None') == 0){
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

		if(strcmp($item['Price'], 'None') == 0){
			$newPrice = $item['Price_per_weight'];
		}else{
			$newPrice = $item['Price'];
		}		

		$price = $productRetailer->price;

		if($price==$newPrice){
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

			return;
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

		if(empty($item['Price_per_weight']) || strcmp($item['Price_per_weight'], 'None') == 0){
			$productRetailer->price_per_weight = $newPrice;
		}else{
			$productRetailer->price_per_weight = $item['Price_per_weight'];
		}

		if($productRetailer->active == false){
			$productRetailer->active = true;
		}

		$productRetailer->save();
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

	private function weightFix($item){
		if(strcmp($item['Weight_Type'], "ml") == 0){
			$item['Type_of_weight'] = 'l';
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
}
