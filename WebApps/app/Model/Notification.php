<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Sofa\Eloquence\Eloquence;

class Notification extends Model
{
	use ELoquence;

    public function profile()
    {
        return $this->belongsToMany('App\Model\Profile')
        ->withTimestamps();
    }
}
