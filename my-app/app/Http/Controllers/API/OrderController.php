<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $perpage= $request->input('perpage', 3); // Nombre d'éléments par page
        $orders = Order::paginate($perpage);
        return response()->json([
            'status' => 200,
            'orders' => $orders,
        ]);
    }

    public function show($id)
    {
        $order = Order::findOrFail($id); // Assurez-vous que l'ordre existe
        return response()->json([
            'status' => 200,
            'order' => $order,
        ]);
    }
}
