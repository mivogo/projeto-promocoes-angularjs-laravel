<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class SubCategory extends Model
{

	protected $table = "sub_categories";
	
	public function category()
	{
		return $this->belongsTo('App\Model\Category');
	}

	public function product()
	{
		return $this->hasMany('App\Model\Product');
	}

}
