<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Sofa\Eloquence\Eloquence;

class Brand extends Model
{

	use Eloquence;
	
	public function product()
	{
		return $this->hasMany('App\Model\Product');
	}
}
