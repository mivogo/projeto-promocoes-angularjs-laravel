<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class ShoppingList extends Model
{
	public function profile()
	{
		return $this->belongsTo('App\Model\Profile');
	}
}
