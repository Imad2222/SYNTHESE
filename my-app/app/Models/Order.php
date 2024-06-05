<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;
    protected $table = 'orders';
    protected $fillable = [
       'fistname',
       'lastname' ,
        'address' ,
        'city'  ,
        'state'  ,
       'phone' ,
       'zipcode',
        'email',   
        'payment_id',
        'payment_mode',
        'tracking_no,',
        'status',
        'remark'
    ];

    public function orderitems()
    {
        return $this->hasMany(Orderitems::class, 'order_id', 'id');
    }
}
