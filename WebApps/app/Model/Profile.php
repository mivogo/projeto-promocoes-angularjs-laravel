<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
	public function location()
	{
		return $this->belongsTo('App\Model\Location');
	}

	public function product()
	{
		return $this->belongsToMany('App\Model\Product')
		->withTimestamps();
	}

	public function shoppinglist()
	{
		return $this->hasMany('App\Model\ShoppingList');
	}

	public function notification()
	{
		return $this->belongsToMany('App\Model\Notification')
    	->withPivot('read')
		->withTimestamps();
	}

	public function rating()
	{
		return $this->hasMany('App\Model\Rating');
	}

}
