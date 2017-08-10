<?php

namespace App\Http\Controllers\API;

use Tymon\JWTAuth\JWTAuth;

use Illuminate\Http\Request;
use App\User;
use App\Model\Brand;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Repository\Transformers\BrandTransformer;
use JWTAuthException;

class BrandController extends Controller
{

	private $user;
	private $jwtauth;

	public function __construct(User $user,JWTAuth $jwtauth)
	{
		$this->user = $user;
		$this->jwtauth = $jwtauth;
	}

	public function showAll()
	{
		$brands = Brand::all();
		return response()->json((new BrandTransformer)->transformArray($brands));
	}
}