<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CheckoutController extends Controller
{
    public function placeOrder(Request $request) 
    {
        if (auth('sanctum')->check())
        {
            $validator= Validator::make($request->all(), [
                'firstname' => 'required|max:191',
                'lastname' => 'required|max:191',
                 'address' => 'required|max:191',
                 'city'  => 'required|max:191',
                 'state'  => 'required|max:191',
                'phone' => 'required|max:191',
                'zipcode' => 'required|max:191',
                 'email' => 'required|max:191', 
                 
            ]);

                // Return validation error.
                if ($validator->fails())
                {
                   return response()->json([
                       'status'=> 422,
                       'errors'=>$validator->messages(),
                   ]);
                }
                else
                {
                    $user_id = auth('sanctum')->user()->id;
                    $order = new Order;

                    $order->user_id = auth('sanctum')->user()->id;
                    $order->firstname=$request->firstname;
                    $order->lastname=$request->lastname;
                    $order->phone=$request->phone;
                    $order->email=$request->email;
                    $order->address=$request->address;
                    $order->city=$request->city;
                    $order->state=$request->state;
                    $order->zipcode= $request->zipcode;

                    $order->payment_mode = $request->payment_mode;
                    $order->payment_id = $request->payment_id;
                    $order->tracking_no = 'fundaecom'.rand(1111,9999);
                    $order->save();

                    $cart =  Cart::where("user_id",$user_id)->get();

                    $orderitems = [];
                     foreach($cart as $item)
                     {
                         // Convertir le prix de la chaîne de caractères en un nombre
                         $price = (float) filter_var($item->product->selling_price, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);

                        $orderitems[]= [
                            'product_id' => $item->product_id, // dans Cart
                            'qte'=> $item->product_qte, // dans Cart
                            'price' => $price, // dans Product
                        ];

                        $item->product->update([
                            'qte'=> $item->product->qte - $item->product_qte
                        ]);
                     }

                     $order->orderitems()->createMany($orderitems); // creer les articles de la commande .

                     Cart::destroy($cart); // supprimer le panier apres creation de la commande .

                    return response()->json([
                        'status'=> 200,
                        'message'=>'Order Placed Successfully !',
                    ]);
                }
        }
        else
        {
            return response()->json( [
                'status' => 401,
                'message' => 'Login To Continue',
            ]);
        }
    }

    public function ValidateOrder(Request $request)
    {
        if (auth('sanctum')->check())
        {
            $validator= Validator::make($request->all(), [
                'firstname' => 'required|max:191',
                'lastname' => 'required|max:191',
                'address' => 'required|max:191',
                'city'  => 'required|max:191',
                'state'  => 'required|max:191',
                'phone' => 'required|max:191',
                'zipcode' => 'required|max:191',
                'email' => 'required|max:191', 
                 
            ]);

                // Return validation error.
                if ($validator->fails())
                {
                   return response()->json([
                       'status'=> 422,
                       'errors'=>$validator->messages(),
                   ]);
                }
                else
                {
                    return response()->json([
                        'status'=> 200,
                        'message'=> 'Form Validated Successfuly',
                    ]);
                }
            
        }
        else
        {
            return response()->json( [
                'status' => 401,
                'message' => 'Login To Continue',
            ]);
        }
    }
}
