<?php
namespace App\Repository\Transformers;

class ProfileTransformer extends Transformer{
	
	public function transform($profile){
		if(!empty($profile->location)){
			return [
			'name' => $profile->name,
			'email' => $profile->email,
			'location' => $profile->location->zipcode
			];
		}
		return [
		'name' => $profile->name,
		'email' => $profile->email,
		'location' => null
		];

	}
}