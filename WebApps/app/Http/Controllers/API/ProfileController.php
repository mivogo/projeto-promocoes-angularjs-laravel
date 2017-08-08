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

class ProfileController extends Controller
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
		$user = $this->jwtauth->toUser($token);

		User::unguard();
		Profile::unguard();
		Location::unguard();

		$user->name = $request->get('name');

		$profile = $user->profile;
		$profile->name = $request->get('name');

		$req_zipcode = $request->get('zipcode');
		if(!empty($req_zipcode)){
			$location = $profile->location;
			if(empty($location) || strcmp($location->zipcode, $req_zipcode) !== 0){
				$location = Location::where('zipcode', $req_zipcode)->first();
				if(empty($location)){
					$location = Location::create();
				}
			}
			$location->zipcode = $request->get('zipcode');
			$location->save();
			$location->profile()->save($profile);
		}

		Location::reguard();
		Profile::reguard();
		User::reguard();

		$profile->push();
		$user->push();

		$user = $this->jwtauth->toUser($token);
		$profile = $user->profile;

		return response()->json((new ProfileTransformer)->transform($profile));
	}

}