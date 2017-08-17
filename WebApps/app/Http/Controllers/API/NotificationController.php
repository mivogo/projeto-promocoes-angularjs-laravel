<?php

namespace App\Http\Controllers\API;

use Tymon\JWTAuth\JWTAuth;

use Illuminate\Http\Request;
use App\User;
use App\Model\Profile;
use App\Model\Notification;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Repository\Transformers\NotificationTransformer;
use JWTAuthException;

class NotificationController extends Controller
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
		$token = $this->jwtauth->getToken();

		if(empty($token)){
			return response()->json(["error"=>"Authentication token needed"], 401);
		}

		$user = $this->jwtauth->toUser($token);

		$notifications = $user->profile->notification()->get();
		
		return response()->json((new NotificationTransformer)->transformArray($notifications));
	}

	public function showNotRead()
	{
		$token = $this->jwtauth->getToken();

		if(empty($token)){
			return response()->json(["error"=>"Authentication token needed"], 401);
		}

		$user = $this->jwtauth->toUser($token);

		$notifications = $user->profile->notification()->wherePivot('read',false)->get();
		
		return response()->json((new NotificationTransformer)->transformArray($notifications));
	}

	public function markAsRead($id){
		$token = $this->jwtauth->getToken();

		if(empty($token)){
			return response()->json(["error"=>"Authentication token needed"], 401);
		}

		$user = $this->jwtauth->toUser($token);

		$notification = $user->profile->notification()->where('id',$id)->first();
		$notification->pivot->read = true;
		$notification->pivot->save();

		$notifications = $user->profile->notification()->wherePivot('read',false)->get();
		
		return response()->json((new NotificationTransformer)->transformArray($notifications));
	}

	public function markAllAsRead(){
		$token = $this->jwtauth->getToken();

		if(empty($token)){
			return response()->json(["error"=>"Authentication token needed"], 401);
		}

		$user = $this->jwtauth->toUser($token);

		$notifications = $user->profile->notification()->wherePivot('read',false)->get();
		foreach ($notifications as $notification) {
			$notification->pivot->read = true;
			$notification->pivot->save();
		}
		
		$notifications = $user->profile->notification()->wherePivot('read',false)->get();
		
		return response()->json((new NotificationTransformer)->transformArray($notifications));
	}
}