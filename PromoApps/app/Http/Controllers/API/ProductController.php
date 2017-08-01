<?php

namespace App\Http\Controllers\API;

use Tymon\JWTAuth\JWTAuth;

use Illuminate\Http\Request;
use App\User;
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
	}

	public function createFromList(Request $request)
	{

		ini_set('max_execution_time', 500);

		$req_retailer = $request->get('Retailer');

		Retailer::unguard();
		$retailer = Retailer::where('name', $req_retailer['name'])->first();
		if(empty($retailer)){
			$retailer = Retailer::create([
				'name' => $req_retailer['name']
				]);
		}
		$retailer->save();
		Retailer::reguard();

		$arr = $request->get('Products');
		foreach($arr as $item) {
			
			Product::unguard();
			Brand::unguard();
			SubCategory::unguard();

			$newBrand = Brand::where('name', $item['Brand'])->first();
			if(empty($newBrand)){
				$newBrand = Brand::create([
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
				$productRetailer->price = $item['Price'];
				if(strcmp($item['Price'], 'None') == 0){
					$productRetailer->price = $item['Price_per_weight'];
				}
				$productRetailer = $item['Price_per_weight'];

				$productRetailer->save();
			}else{
				
				//CRIAR NOVO PRODUTO OU TENTAR VER SE PRODUTO É IDENTICO A UM EXISTENTE PELO MARCA&PESO E ALGORITMO DE % DE NOME
				$newProduct = new Product;
				$newProduct->name = $item['Name'];
				$newProduct->weight = $item['Weight'];
				$newProduct->weight_type = $item['Weight_Type'];

				$newProductRetailer = new ProductRetailer;
				$newProductRetailer->price = $item['Price'];
				if(strcmp($item['Price'], 'None') == 0){
					$newProductRetailer->price = $item['Price_per_weight'];
				}
				$newProductRetailer->price_per_weight = $item['Price_per_weight'];
				$newProductRetailer->pid = $item['ID'];
				$newProductRetailer->image = $item['Image'];
				$newProductRetailer->link = $item['Link'];

				$newProduct->save();
				$newProduct->productretailer()->save($newProductRetailer);
				$retailer->productRetailer()->save($newProductRetailer);

				$newBrand->save();
				$newBrand->product()->save($newProduct);

				$subCategory->save();
				$subCategory->product()->save($newProduct);

				$newProduct->push();
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
		return response()->json((new ProductTransformer)->transform($product));
	}

}