<?php

namespace App\Http\Controllers\API;

use Tymon\JWTAuth\JWTAuth;
use Illuminate\Http\Request;
use App\User;
use App\Model\Profile;
use App\Model\Location;
use App\Model\Product;
use App\Http\Requests;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;
use App\Repository\Transformers\FavoriteListTransformer;
use JWTAuthException;
use Validator;

class FavoriteListController extends Controller
{

	private $user;
	private $jwtauth;

	public function __construct(User $user,JWTAuth $jwtauth)
	{
		$this->user = $user;
		$this->jwtauth = $jwtauth;
		$this->middleware('jwt.auth');

	}

	public function addFavorite($id){

		$token = $this->jwtauth->getToken();
		$user = $this->jwtauth->toUser($token);

		$profile = $user->profile;

		$product = Product::find($id);
		if(empty($product)){
			return response()->json(['error'=>'Produto não existe'], 400);
		}

		if ($profile->product->contains($product))
		{
			return response()->json(['error'=>'Produto já se encontra como favorito'], 400);

		} 

		$profile->product()->save($product);
		return response()->json(['data'=>'Produto adicionado como favorito'], 200);

	}

	public function showFavorites(){

		$token = $this->jwtauth->getToken();
		$user = $this->jwtauth->toUser($token);

		$profile = $user->profile;
		$products = $profile->product;

		$transformedProducts = [];
		foreach($products AS $p){
			$new = (new FavoriteListTransformer)->transform($p);
			array_push($transformedProducts, $new);
		}

		return response()->json($transformedProducts);
	}

	public function deleteFavorite($id){
		$token = $this->jwtauth->getToken();
		$user = $this->jwtauth->toUser($token);

		$profile = $user->profile;

		$product = Product::find($id);
		if(empty($product)){
			return response()->json(['error'=>'Produto não existe'], 400);
		}

		if ($profile->product->contains($product))
		{	
			$profile->product()->detach($product);
			return response()->json(['data'=>'Produto removido dos favoritos'], 200);

		} 

		return response()->json(['error'=>'Produto não se encontra nos favoritos'], 400);
	}

}