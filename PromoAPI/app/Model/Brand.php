<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
	public function product()
	{
		return $this->hasMany('App\Model\Product');
	}
}
