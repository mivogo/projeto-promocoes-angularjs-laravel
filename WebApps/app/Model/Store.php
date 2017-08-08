<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
	public function retailer()
	{
		return $this->belongsTo('App\Model\Retailer');
	}

	public function location()
	{
		return $this->belongsTo('App\Model\Location');
	}
}
