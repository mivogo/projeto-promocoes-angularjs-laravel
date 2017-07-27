<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class SubCategory extends Model
{
	public function category()
	{
		return $this->belongsTo('App\Model\Category');
	}
}
