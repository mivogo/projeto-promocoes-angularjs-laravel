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

		ini_set('max_execution_time', 500);
		
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
			SubCategory::unguard();

			$brand = Brand::where('name', $item['Brand'])->first();
			if(empty($brand)){
				$brand = Brand::create([
					'name' => $item['Brand']
					]);
			}

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
			}
			
			ProductRetailer::unguard();
			$productRetailer = ProductRetailer::where('pid', $item['ID'])->first();
			if(!empty($productRetailer)){
				
				$this->updateProductRetailer($productRetailer,$item);

			}else{

				$existingProducts = Product::with('productretailer')->whereHas('productretailer',  function($query) use ($retailer)  {
					$query->where('retailer_id','!=',$retailer->id);
				})
				->where('brand_id',$brand->id)->whereBetween('weight', array($item['Weight']-2, $item['Weight']+2))->get();

				$selectedProduct = null;
				if(!$existingProducts->isEmpty()){
					$currentResult = 0;
					foreach($existingProducts as $existingProduct){
						$testResult = $this->swgAlgorithm->compare($existingProduct->name, $item['Name']);
						if($testResult >= 0.75 && $testResult > $currentResult){
							$currentResult = $testResult;
							$selectedProduct = $existingProduct;
						}
					}
				}

				if(empty($selectedProduct)){
					$this->createNewProduct($retailer,$brand,$subCategory,$item);
				}else{
					$this->addRetailerToProduct($retailer,$selectedProduct,$item);
				}
			}

			SubCategory::reguard();
			ProductRetailer::reguard();
			Brand::reguard();
			Product::reguard();

		}

		$products = Product::all();
		return response()->json((new ProductTransformer)->transformArray($products));
	}

	public function showAll()
	{
		$products = Product::all();
		return response()->json((new ProductTransformer)->transformArray($products));
	}


	public function showProduct($id)
	{
		$product = Product::find($id);
		$product->productRetailer;
		return response()->json($product);
	}

	private function createNewProduct($retailer,$brand,$subCategory,$item){
		$newProduct = new Product;
		$newProduct->name = $item['Name'];
		$newProduct->weight = $item['Weight'];
		$newProduct->weight_type = $item['Weight_Type'];

		$newProductRetailer = $this->createNewProductRetailer($item);

		$newProduct->save();
		$newProduct->productretailer()->save($newProductRetailer);
		$retailer->productRetailer()->save($newProductRetailer);

		$brand->save();
		$brand->product()->save($newProduct);

		$subCategory->save();
		$subCategory->product()->save($newProduct);

		$newProduct->push();
	}
	
	private function addRetailerToProduct($retailer,$selectedProduct,$item){
		$newProductRetailer = $this->createNewProductRetailer($item);

		$selectedProduct->save();
		$selectedProduct->productretailer()->save($newProductRetailer);
		$retailer->productRetailer()->save($newProductRetailer);

		$selectedProduct->push();
	}

	private function createNewProductRetailer($item){
		$newProductRetailer = new ProductRetailer;
		$newProductRetailer->price = $item['Price'];
		if(strcmp($item['Price'], 'None') == 0){
			$newProductRetailer->price = $item['Price_per_weight'];
		}
		$newProductRetailer->price_per_weight = $item['Price_per_weight'];
		if(strcmp($item['Price_per_weight'], 'None') == 0){
			$newProductRetailer->price_per_weight = $item['Price'];
		}
		$newProductRetailer->type_of_weight = $item['Type_of_weight'];
		$newProductRetailer->pid = $item['ID'];
		$newProductRetailer->image = $item['Image'];
		$newProductRetailer->link = $item['Link'];

		return $newProductRetailer;
	}

	private function updateProductRetailer($productRetailer,$item){

		$productRetailer->price = $item['Price'];
		if(strcmp($item['Price'], 'None') == 0){
			$productRetailer->price = $item['Price_per_weight'];
		}
		$productRetailer->price_per_weight = $item['Price_per_weight'];
		if(strcmp($item['Price_per_weight'], 'None') == 0){
			$productRetailer->price_per_weight = $item['Price'];
		}
		$productRetailer->save();
	}

}