<?php

namespace App\Http\Controllers\API;

use Tymon\JWTAuth\JWTAuth;
use Illuminate\Http\Request;
use App\User;
use App\Model\Profile;
use App\Model\Location;
use App\Http\Requests;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;
use App\Repository\Transformers\ProfileTransformer;
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

	public function details(){

		$token = $this->jwtauth->getToken();
		$user = $this->jwtauth->toUser($token);

		$profile = $user->profile;

		return response()->json();
	}

}