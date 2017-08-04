<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{

	protected $casts = [
    	'relatedNames' => 'array', // Will convarted to (Array)
    ];
    
    public function favoritelist()
    {
    	return $this->belongsToMany('App\Model\FavoriteList')
    	->withTimestamps();
    }

    public function rating()
    {
    	return $this->hasMany('App\Model\Rating');
    }

    public function subcategory()
    {
    	return $this->belongsTo('App\Model\SubCategory','sub_category_id');
    }

    public function brand()
    {
    	return $this->belongsTo('App\Model\Brand');
    }

    public function retailer()
    {
    	return $this->belongsToMany('App\Model\Retailer')
    	->withTimestamps();
    }

    public function productretailer()
    {
    	return $this->hasMany('App\Model\ProductRetailer');
    }

}
