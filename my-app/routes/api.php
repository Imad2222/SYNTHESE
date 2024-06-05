<?php

use App\Http\Controllers\API\AdminProfileController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\CheckoutController;
use App\Http\Controllers\API\EmailController;
use App\Http\Controllers\API\ForgotPasswordController;
use App\Http\Controllers\API\FrontendController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\ResetPasswordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::post('password/email', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('password/reset', [ResetPasswordController::class, 'reset']);

Route::get('getCategory', [FrontendController::class, 'category']);
Route::get('fetchProducts/{slug}', [FrontendController::class, 'product']);
Route::get('viewproductdetail/{category_slug}/{product_slug}', [FrontendController::class, 'viewproduct']);
Route::post('add-to-cart', [CartController::class, 'addtocart']);
Route::get('cart', [CartController::class, 'viewcart']);
Route::put('cart-updateQuantity/{cart_id}/{scope}', [CartController::class, 'updatequantity']);
Route::delete('cart-delete/{cart_id}', [CartController::class, 'deleteCartItem']);

Route::post('place-order', [CheckoutController::class, 'placeOrder']);
Route::post('Validate-order', [CheckoutController::class, 'ValidateOrder']);

Route::post('/send-email', [EmailController::class, 'sendEmail']);

Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/checkingAuthenticated', function () {
        return response()->json(['message' => 'You are in', 'status' => 200], 200);
    });

    // en vérifiant s'il est admin ou non ...
    Route::middleware(['isAPIAdmin'])->group(function () {

        // Category
        Route::post('store-category', [CategoryController::class, 'store']);
        Route::get('view-category', [CategoryController::class, 'index']);
        Route::get('edit-category/{id}', [CategoryController::class, 'edit']);
        Route::put('update-category/{id}', [CategoryController::class, 'update']);
        Route::delete('delete-category/{id}', [CategoryController::class, 'destroy']);
        Route::get('all-category', [CategoryController::class, 'allcategory']);


        Route::get('admin/orders', [OrderController::class, 'index']);
        Route::get('view-order/{id}', [OrderController::class, 'show']);


        // Products
        Route::post('store-product', [ProductController::class, 'store']);
        Route::get('view-product', [ProductController::class, 'index']);
        Route::get('edit-product/{id}', [ProductController::class, 'edit']);
        Route::post('update-product/{id}', [ProductController::class, 'update']);
        Route::get('profile', [AdminProfileController::class, 'profile']);
    });

   



    Route::post('logout', [AuthController::class, 'logout']);
});
