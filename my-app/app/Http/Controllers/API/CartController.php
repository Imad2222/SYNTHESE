<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function addtocart(Request $request)
    {
        if (auth('sanctum')->check()) // s'il est authentifié 
        {
            $user_id = auth('sanctum')->user()->id;
            $product_id = $request->product_id; // $request->product_id  smiya li dayrha f react js li katssawi = product.id
            $product_qte = $request->product_qte;

            // On vérifie si le produit existe déjà dans le panier de l'utilisateur

            $productCheck = Product::where('id',$product_id)->first();

            if($productCheck)
            {
                        if(Cart::where('product_id',$product_id)->where('user_id',$user_id)->exists())
                        {
                            return response()->json([
                                'status' => 409,
                                'message' => $productCheck->name.  "  AlReady Added To Cart !",
                            ]);
                        }
                        else
                        {
                            $cartitem = new Cart;
                            $cartitem->user_id = $user_id;
                            $cartitem->product_id = $product_id;
                            $cartitem->product_qte = $product_qte;
                            $cartitem->save();
                            return response()->json([
                                'status' => 201,
                                'message' => "Added To Cart !",
                            ]);
                        }
            }
            else 
            {
                        return response()->json([
                            'status' => 404,
                            'message' => "Product Not Found !",
                        ]);
            }

        } 
        else 
        {
            return response()->json([
                'status' => 401,
                'message' => "Login to add to cart",
            ]);
        }
    }


    public function viewcart(Request $request)
    {
        if (auth('sanctum')->check()) // s'il est authentifié  il peut accéder à cette fonction
        {
            $user_id = auth('sanctum')->user()->id;
            $cartitems = Cart::where('user_id', $user_id)->get();
            return response()->json([
                'status' => 200,
                'cart' => $cartitems,
            ]);
        }
        else
        {
            return response()->json([
                'status' => 401,
                'message' => "Login To View Cart Data",
            ]);
        }
    }


    public function updatequantity($cart_id , $scope)
    {
        if (auth('sanctum')->check())  
        {   
            $user_id = auth('sanctum')->user()->id;
            $cartitem = Cart :: where ('id',$cart_id) -> where('user_id',$user_id)->first();
            if($scope == "inc"){
                $cartitem->product_qte +=1;
            }
            elseif ($scope=="dec"){
                $cartitem->product_qte -=1 ;
            }
            $cartitem->update();
            return response()->json([
                'status' => 200,
                'message' => "Quantity Updated ",
            ]);
        }

        else 
        {
            return response()->json([
                'status' => 401,
                'message' => "Login To Continue",
            ]);
        }
   }


   public function deleteCartItem($cart_id)
   {
    if (auth('sanctum')->check())
    {
        $user_id = auth('sanctum')->user()->id;
        $cart= Cart::where ('id',$cart_id) -> where('user_id',$user_id)->first(); // where user_id ... c'est t'a dire le cart qui est lié à cette user
            if ( $cart )
                {
                    $cart->delete();
                    return response()->json( [
                        'status' => 200,
                        'message' => 'Category Deleted successfully',
                    ] );
                }
            else
            {
                return response()->json( [
                    'status' => 404,
                    'message' => 'Cart Item Not Found',
                ] );
            }
    }
       
    else
    {
                return response()->json( [
                    'status' => 401,
                    'message' => 'No Category ID Found',
                ] );
    }
   }


}
