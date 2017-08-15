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
use App\Repository\Transformers\UserTransformer;
use JWTAuthException;
use Validator;

class AuthController extends Controller
{

	private $user;
	private $jwtauth;

	public function __construct(User $user,JWTAuth $jwtauth)
	{
		$this->user = $user;
		$this->jwtauth = $jwtauth;
	}

	public function register(Request $request)
	{

		$validator = Validator::make($request->all(), [
			'name' => 'required',
			'email' => 'required|email|unique:users,email',
			'password' => 'required|min:6|regex:/^.*(?=.{3,})(?=.*[a-zA-Z])(?=.*[0-9]).*$/'
			]);

		if ($validator->fails()) {
			return response()->json(['error'=>$validator->errors()], 401);            
		}

		User::unguard();
		$newUser = $this->user->create([
			'name' => $request->get('name'),
			'email' => $request->get('email'),
			'password' => bcrypt($request->get('password'))
			]);

		if (!$newUser) {
			return response()->json(['error'=>'failed_to_create_new_user'], 500);
		}

		$profile = new Profile;
		$profile->name = $newUser->name;
		$profile->email = $newUser->email;

		$newUser->profile()->save($profile);

		$newUser->api_token = $this->jwtauth->fromUser($newUser);
		User::reguard();

		$newUser->push();

		return response()->json((new UserTransformer) ->transform($newUser));
	}

	public function login(Request $request)
	{

		$validator = Validator::make($request->all(), [
			'email' => 'required',
			'password' => 'required|min:6|regex:/^.*(?=.{3,})(?=.*[a-zA-Z])(?=.*[0-9]).*$/'
			]);

		if ($validator->fails()) {
			return response()->json(['error'=>$validator->errors()], 401);            
		}

		$credentials = $request->only('email', 'password');
		$token = null;

		try {

			$token = $this->jwtauth->attempt($credentials);

			if (!$token) {
				return response()->json(['invalid'=>'invalid_email_or_password'], 422);
			}

			User::unguard();
			$user = $this->jwtauth->toUser($token);
			$user->api_token = $token;
			User::reguard();

			$user->save();

		} catch (JWTAuthException $e) {
			return response()->json(['error'=>'failed_to_create_token'], 500);
		}

		return response()->json((new UserTransformer)->transform($user));
	}

	public function password(Request $request){

		$validator = Validator::make($request->all(), [
			'password' => 'required|min:6|regex:/^.*(?=.{3,})(?=.*[a-zA-Z])(?=.*[0-9]).*$/',
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
		$user->password = bcrypt($request->get('password'));
		$new_token = $this->jwtauth->refresh($token);
		$user->api_token = $new_token;
		User::reguard();

		$user->save();
		$user = $this->jwtauth->toUser($new_token);

		return response()->json('Password changed',200);

	}
}