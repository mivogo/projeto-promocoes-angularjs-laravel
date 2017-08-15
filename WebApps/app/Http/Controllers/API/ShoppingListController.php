<?php

namespace App\Http\Controllers\API;

use Tymon\JWTAuth\JWTAuth;
use Illuminate\Http\Request;
use App\User;
use App\Model\ShoppingList;
use App\Model\Product;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Repository\Transformers\ShoppingListTransformer;
use App\Repository\Transformers\ProductTransformer;
use JWTAuthException;
use Validator;

class ShoppingListController extends Controller
{

	private $user;
	private $jwtauth;

	public function __construct(User $user,JWTAuth $jwtauth)
	{
		$this->user = $user;
		$this->jwtauth = $jwtauth;
	}

	public function addList(Request $request){

		$validator = Validator::make($request->all(), [
			'name' => 'required',
			'retailer_id' => 'required',
			'products' => 'required'
			]);

		if ($validator->fails()) {
			return response()->json(['error'=> $validator->errors()], 401);            
		}

		$token = $this->jwtauth->getToken();

		if(empty($token)){
			return response()->json(["error"=>"Authentication token needed"], 401);
		}

		$user = $this->jwtauth->toUser($token);

		$profile = $user->profile;
		
		$r_products = $request->get('products');

		$list = $profile->shoppinglist()->where("name", $request->name)->first();
		if(empty($list)){
			$list = ShoppingList::create([
				'name' => $request->get('name')
				]);
		}

		$list->description = $request->get('description');
		$list->retailer_id = $request->get('retailer_id');

		$list->product()->detach();
		$list->save();
		
		foreach ($r_products as $product) {
			$list->product()->attach([$product['id'] => ['quantity' => $product['quantity']]]);
		}

		$profile->shoppinglist()->save($list);

		return response()->json((new ShoppingListTransformer)->transformFromArray($profile->shoppinglist));
	}


	public function nameTaken(Request $request){

		$validator = Validator::make($request->all(), [
			'name' => 'required',
			]);

		if ($validator->fails()) {
			return response()->json(['error'=> $validator->errors()], 401);            
		}

		$token = $this->jwtauth->getToken();

		if(empty($token)){
			return response()->json(["error"=>"Authentication token needed"], 401);
		}
		
		$user = $this->jwtauth->toUser($token);

		$profile = $user->profile;
		$list = $profile->shoppinglist()->where("name", $request->name)->first();

		if($list){
			return response()->json(["data"=>"There is no list with that name"],200);
		}
		return response()->json(["error"=>"A list with that name already exists"], 400);

	}

	public function showLists(){

		$token = $this->jwtauth->getToken();

		if(empty($token)){
			return response()->json(["error"=>"Authentication token needed"], 401);
		}

		$user = $this->jwtauth->toUser($token);

		$profile = $user->profile;
		$lists = $profile->shoppinglist;

		$transformedLists = (new ShoppingListTransformer)->transformFromArray($lists);

		return response()->json($transformedLists);
	}

	public function showListProducts($id){

		$token = $this->jwtauth->getToken();

		if(empty($token)){
			return response()->json(["error"=>"Authentication token needed"], 401);
		}

		$user = $this->jwtauth->toUser($token);

		$profile = $user->profile;
		$list = $profile->shoppinglist()->where('id',$id)->first();

		if(empty($list)){
			return response()->json(["error"=>"A lista selecionada não existe"], 400);
		}

		$retailerid = $list->retailer_id;

		$transformedProducts = [];
		$products = $list->product;

		foreach ($products as $product) {
			$productretailer = $product->productretailer()->where('retailer_id',$retailerid)->first();
			$new = (new ShoppingListTransformer)->transformProduct($product,$productretailer);
			array_push($transformedProducts, $new);
		}

		$transformedList = (new ShoppingListTransformer)->transform($list);

		return response()->json(["list"=>$transformedList,"products"=>$transformedProducts]);
	}

	public function deleteList($id){

		$token = $this->jwtauth->getToken();

		if(empty($token)){
			return response()->json(["error"=>"Authentication token needed"], 401);
		}

		$user = $this->jwtauth->toUser($token);

		$profile = $user->profile;
		$list = $profile->shoppinglist()->where('id',$id)->first();

		if(empty($list)){
			return response()->json(["error"=>"A lista selecionada não existe"], 400);
		}

		$list->profile()->dissociate();
		$list->save();

		return response()->json(["data"=>"Lista removida com sucesso"],200);
	}
}