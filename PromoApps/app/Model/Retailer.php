<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Retailer extends Model
{
	public function product()
	{
		return $this->belongsToMany('App\Model\Product')
		->withTimestamps();
	}

	public function price()
	{
		return $this->hasMany('App\Model\Price');
	}


	public function store()
	{
		return $this->hasMany('App\Model\Store');
	}
}
