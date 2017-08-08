<?php

namespace App\Http\Controllers\API;

use Tymon\JWTAuth\JWTAuth;

use Illuminate\Http\Request;
use App\User;
use App\Model\Retailer;
use App\Http\Requests;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;
use App\Repository\Transformers\RetailerTransformer;
use JWTAuthException;

class RetailerController extends Controller
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
		$retailers = Retailer::all();
		return response()->json((new RetailerTransformer)->transformArray($retailers));
	}
}