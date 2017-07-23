<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
	public function subcategory()
	{
		return $this->hasOne('App\Model\SubCategory');
	}

	public function favoritelist()
	{
		return $this->belongsToMany('App\Model\FavoriteList')
		->withTimestamps();
	}

	public function rating()
	{
		return $this->hasMany('App\Model\Rating');
	}

	public function brand()
	{
		return $this->belongsTo('App\Model\Brand');
	}

}
