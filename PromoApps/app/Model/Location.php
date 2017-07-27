<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
	public function profile()
	{
		return $this->hasMany('App\Model\Profile');
	}

	public function store()
	{
		return $this->hasMany('App\Model\Store');
	}
}
