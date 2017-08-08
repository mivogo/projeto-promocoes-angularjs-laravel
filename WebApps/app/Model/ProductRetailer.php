<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Sofa\Eloquence\Eloquence;

class ProductRetailer extends Model
{

	use Eloquence;

	public function retailer()
	{
		return $this->belongsTo('App\Model\Retailer');
	}

	public function product()
	{
		return $this->belongsTo('App\Model\Product');
	}
}
