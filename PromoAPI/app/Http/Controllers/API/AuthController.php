<?php

namespace App\Http\Controllers\API;

use Tymon\JWTAuth\JWTAuth;
use Illuminate\Http\Request;
use App\User;
use App\Http\Requests;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;
use JWTAuthException;

class AuthController extends Controller
{

	private $user;
	private $jwtauth;

	public function __construct(User $user,JWTAuth $jwtauth)
	{
		$this->user = $user;
		$this->jwtauth = $jwtauth;

	}

	public function register(RegisterRequest $request)
	{

		$newUser = $this->user->create([
			'name' => $request->get('name'),
			'email' => $request->get('email'),
			'password' => bcrypt($request->get('password'))
			]);

		if (!$newUser) {
			return response()->json(['failed_to_create_new_user'], 500);
		}

		return response()->json([
			'name' => $newUser->name,
			'email' => $newUser->email,
			'token' => $this->jwtauth->fromUser($newUser)
			]);
	}

	public function login(LoginRequest $request)
	{
  		// get user credentials: email, password
		$credentials = $request->only('email', 'password');
		$token = null;

		try {
			$token = $this->jwtauth->attempt($credentials);
			if (!$token) {
				return response()->json(['invalid_email_or_password'], 422);
			}
			$user = $this->jwtauth->toUser($token);
		} catch (JWTAuthException $e) {
			return response()->json(['failed_to_create_token'], 500);
		}
		return response()->json([
			'name' => $user->name,
			'email' => $user->email,
			'token' => $token
			]);
	}
}