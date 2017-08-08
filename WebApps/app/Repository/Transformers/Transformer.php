<?php 

namespace App\Repository\Transformers;

abstract class Transformer {

    /*
     * Transforms a collection of items
     * @param $items
     * @return array
     */
    public function transformCollection(array $items){
    	return array_map([$this, 'transform'], $items);
    }
    
    public abstract function transform($item);
}