<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class FavoriteList extends Model
{
	public function product()
	{
		return $this->belongsToMany('App\Model\Product')
		->withTimestamps();
	}
}
