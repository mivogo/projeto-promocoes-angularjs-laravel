<?php

namespace App\Http\Controllers\API;

use Tymon\JWTAuth\JWTAuth;
use Illuminate\Http\Request;
use App\User;
use App\Model\Profile;
use App\Http\Requests;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;
use App\Repository\Transformers\ProfileTransformer;
use JWTAuthException;
use Validator;

class UserController extends Controller
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

		if(empty($token)){
			return response()->json(["error"=>"Authentication token needed"], 401);
		}

		$user = $this->jwtauth->toUser($token);

		$profile = $user->profile;

		return response()->json((new ProfileTransformer)->transform($profile));
	}

	public function update(Request $request){

		$validator = Validator::make($request->all(), [
			'email' => 'email|unique:users,email',
			]);

		if ($validator->fails()) {
			return response()->json(['error'=>$validator->errors()], 401);            
		}

		$token = $this->jwtauth->getToken();

		if(empty($token)){
			return response()->json(["error"=>"Authentication token needed"], 401);
		}
		
		$user = $this->jwtauth->toUser($token);

		User::unguard();
		Profile::unguard();
		$user->name = $request->get('name');

		$profile = $user->profile;
		$profile->name = $request->get('name');
		User::reguard();
		Profile::reguard();

		return response()->json([$user,(new ProfileTransformer)->transform($profile)]);
	}
}