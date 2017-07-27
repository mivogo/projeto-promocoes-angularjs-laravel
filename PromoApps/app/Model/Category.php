<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
	public function subcategory()
	{
		return $this->hasMany('App\Model\SubCategory');
	}
}
