<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Sofa\Eloquence\Eloquence;

class Category extends Model
{

	use Eloquence;

	public function subcategory()
	{
		return $this->hasMany('App\Model\SubCategory');
	}
}
