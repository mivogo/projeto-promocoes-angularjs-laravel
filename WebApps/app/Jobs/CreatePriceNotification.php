<?php

namespace App\Jobs;

use App\Model\Profile;
use App\Model\Notification;
use App\Model\Product;
use App\Model\ProductRetailer;
use App\Model\Brand;
use App\Model\Retailer;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class CreatePriceNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $productretailer;
    private $percentage;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(ProductRetailer $productretailer, float $percentage)
    {
        $this->productretailer = $productretailer;
        $this->percentage = $percentage;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {   

        $profiles = Profile::all();
        $pid = $this->productretailer->product_id;

        $created = null;

        foreach ($profiles as $profile) {
            $found = $profile->product()->where('id',$pid)->first();
            if(!empty($found)){

                if(is_null($created)){
                    
                    $notification = Notification::create();
                    $notification->product_name = $this->productretailer->product->name;
                    $notification->brand_name = $this->productretailer->product->brand->name;
                    $notification->retailer_name = $this->productretailer->retailer->name;
                    $notification->price = $this->productretailer->price;
                    $notification->base_price = $this->productretailer->base_price;
                    $notification->percentage = $this->percentage;
                    $notification->save();

                    $created = $notification;
                }

                $profile->notification()->attach([$created->id => ['read' => false]]);
            }
        }

    }
}
