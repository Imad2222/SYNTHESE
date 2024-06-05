<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;

class ProductController extends Controller
{

    public function index ( Request $request )
    {
        $perPage = $request->input('perPage', 2); // Nombre d'éléments par page
        $products = Product::paginate($perPage); // Paginer les résultats
        return response()->json([
            'status'=> 200,
            'products'=>$products
        ]);
    }

    public function store( Request $request )
    {
        //validate the request
        $validator = Validator::make( $request->all(), [
            'category_id' => 'required | max:191',
            'slug' => 'required|max:191',
            'name' => 'required|max:191',
            'meta_title' => 'required|max:191',
            'brand' => 'required|max:20',
            'selling_price' => 'required | max:20',
            'original_price' => 'required | max:20',
            'qte' => 'required | max:4',
            'image' => 'required |image|mimes:jpeg,png,jpg,gif,svg|max:4000',
            
        ] );

        if ( $validator->fails() )
        {
            return response()->json( [
                'status' => 422,
                'errors' => $validator->messages(),
                
            ] );
        }
        else
        {
            $product = new Product;
            $product->category_id = $request->input( 'category_id' );
            $product->slug = $request->input( 'slug' );
            $product->name = $request->input( 'name' );
            $product->description = $request->input( 'description' );


            $product->meta_title = $request->input( 'meta_title' );
            $product->meta_keyword = $request->input( ' meta_keyword' );
            $product->meta_descrip = $request->input( ' meta_descrip' );
            

            $product->brand = $request->input( 'brand' );
            $product->selling_price = $request->input( 'selling_price' );
            $product->original_price = $request->input( 'original_price' );
            $product->qte = $request->input( 'qte' );


            if($request->hasFile('image'))
            {
                $file = $request->file('image');
                $extention = $file->getClientOriginalExtension();
                $filename = time() .'.'.$extention;
                $file->move('uploads/product/', $filename);
                $product->image = 'uploads/product/'.$filename;
            }

            $product->featured= $request->input( 'featured' ) == true ? '1' : '0';
            $product->popular= $request->input( 'popular' ) == true ? '1' : '0';
            $product->status = $request->input( 'status' ) == true ? '1' : '0';
            $product->save();
            
            return response()->json( [
                'status' => 200,
                'message' => 'Product Added Successfully',
            ] );
        }
    }


    public function edit($id)
    {
        $product= Product::find( $id );
        if($product)
        {
            return response()->json([
                'status'=>200,
                'product'=>$product
            ]);
        }
        else
        {
            return response()->json([
                    'status'=>404,
                    'message'=>'No product found'
            ]);
        }
    }

    public function update(Request $request,$id)
    {

       //validate the request
       $validator = Validator::make( $request->all(), [
        'category_id' => 'required | max:191',
        'slug' => 'required|max:191',
        'name' => 'required|max:191',
        'meta_title' => 'required|max:191',
        'brand' => 'required|max:20',
        'selling_price' => 'required | max:20',
        'original_price' => 'required | max:20',
        'qte' => 'required | max:4',
        
    ] );

    if ( $validator->fails() )
    {
        return response()->json( [
            'status' => 422,
            'errors' => $validator->messages(),
            
        ] );
    }
    else
    {
        $product = Product::find($id);
        if ($product)
        {

        $product->category_id = $request->input( 'category_id' );
        $product->slug = $request->input( 'slug' );
        $product->name = $request->input( 'name' );
        $product->description = $request->input( 'description' );


        $product->meta_title = $request->input( 'meta_title' );
        $product->meta_keyword = $request->input( ' meta_keyword' );
        $product->meta_descrip = $request->input( ' meta_descrip' );
        

        $product->brand = $request->input( 'brand' );
        $product->selling_price = $request->input( 'selling_price' );
        $product->original_price = $request->input( 'original_price' );
        $product->qte = $request->input( 'qte' );


        if($request->hasFile('image'))
        {
            // upload image to server directory
            $path = $product->image;
            if (File::exists($path)) 
            {
                File::delete($path);
            }
            $file = $request->file('image');
            $extention = $file->getClientOriginalExtension();
            $filename = time() .'.'.$extention;
            $file->move('uploads/product/', $filename);
            $product->image = 'uploads/product/'.$filename;
        }

        $product->featured= $request->input( 'featured' );
        $product->popular= $request->input( 'popular' );
        $product->status = $request->input( 'status' );
        $product->update();
        
        return response()->json( [
            'status' => 200,
            'message' => 'Product Updated Successfully',
        ]);

        }
        
        else
        {
            return response()->json([
                    'status'=>404,
                    'message'=>'No product found'
            ]);
        }
    } 
    }
}