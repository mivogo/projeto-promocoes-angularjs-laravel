<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class ProductRetailer extends Model
{
	public function retailer()
	{
		return $this->belongsTo('App\Model\Retailer');
	}

	public function product()
	{
		return $this->belongsTo('App\Model\Product');
	}
}
