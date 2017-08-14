<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class ShoppingList extends Model
{

	protected $fillable = [
	'name', 'description', 'retailer_id',
	];

	public function profile()
	{
		return $this->belongsTo('App\Model\Profile');
	}

	public function retailer()
	{
		return $this->belongsTo('App\Model\Retailer');
	}

	public function product()
	{
		return $this->belongsToMany('App\Model\Product')
		->withPivot('quantity')
		->withTimestamps();
	}
}
