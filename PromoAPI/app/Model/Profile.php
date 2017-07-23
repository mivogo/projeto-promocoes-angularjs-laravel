<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
	public function location()
	{
		return $this->belongsTo('App\Model\Location');
	}

	public function favoritelist()
	{
		return $this->hasOne('App\Model\FavoriteList');
	}

	public function shoppinglist()
	{
		return $this->hasMany('App\Model\ShoppingList');
	}

	public function rating()
	{
		return $this->hasMany('App\Model\Rating');
	}

}
