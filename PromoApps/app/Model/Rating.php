<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
	public function profile()
	{
		return $this->belongsTo('App\Model\Profile');
	}

	public function product()
	{
		return $this->belongsTo('App\Model\Product');
	}
}
