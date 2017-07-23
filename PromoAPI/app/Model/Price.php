<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
	public function retailer()
	{
		return $this->belongsTo('App\Model\Retailer');
	}
}
