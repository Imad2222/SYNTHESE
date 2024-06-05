<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;

use Illuminate\Http\Request;

class CategoryController extends Controller
{

    public function index( Request $request )
    {
        $perpage= $request->input('perpage', 3); // Nombre d'éléments par page
        $categories = Category::paginate( $perpage );
        return response()->json( [
            'status' => 200,
            'category' => $categories,
        ] );
    }

    public function allcategory()
    {
        $categories = Category::where('status', '0')->get(); // en recupere les categories dont le status est egale a 0
        return response()->json( [
            'status' => 200,
            'category' => $categories,
        ] );
    }

    

    public function edit( $id )
    {
        $category = Category::find( $id );
        if ( $category )
        {
            return response()->json( [
                'status' => 200,
                'category' => $category,
            ] );
        }
        else
        {
            return response()->json( [
                'status' => 404,
                'message' => 'No Category Found',
            ] );
        }
    }
    
    public function store( Request $request )
    {
        //validate the request
        $validator = Validator::make( $request->all(), [
            'meta_title' => 'required|max:191',
            'slug' => 'required|max:191',
            'name' => 'required|max:191',
        ]);
        if ( $validator->fails() )
        {
            return response()->json( [
                'status' => 400,
                'errors' => $validator->messages(),
            ] );
        }
        else
        {

            $category = new Category();
            $category->meta_title = $request->input('meta_title');
            $category->meta_keyword = $request->input('meta_keyword');
            $category->meta_descrip = $request->input('meta_descrip');
            $category->slug = $request->input('slug');
            $category->name = $request->input('name');
            $category->description = $request->input('description');
            $category->status = $request->input('status') == true ? '1' : '0';
            $category->save();
            return response()->json( [
                'status' => 200,
                'message' => 'Category Added successfully',
            ] );
        }

    }

    public function update( Request $request, $id )
    {
        //validate the request
        $validator = Validator::make( $request->all(), [
            'meta_title' => 'required|max:191',
            'slug' => 'required|max:191',
            'name' => 'required|max:191',
        ]);
        if ( $validator->fails() )
        {
            return response()->json( [
                'status' => 422,
                'errors' => $validator->messages(),
            ] );
        }
        else
        {

            $category = Category::find( $id );
            if ( $category )
            {
                $category->meta_title = $request->input('meta_title');
                $category->meta_keyword = $request->input('meta_keyword');
                $category->meta_descrip = $request->input('meta_descrip');
                $category->slug = $request->input('slug');
                $category->name = $request->input('name');
                $category->description = $request->input('description');
                $category->status = $request->input('status') == true ? '1' : '0';
                $category->save();
                return response()->json( [
                    'status' => 200,
                    'message' => 'Category Updated successfully',
                ] );
            }
            else
            {
                return response()->json( [
                    'status' => 404,
                    'message' => 'No Category ID Found',
                ] );

           }

       }
    }

    public function destroy( $id )
    {
        $category = Category::find( $id );
        if ( $category )
        {
            $category->delete();
            return response()->json( [
                'status' => 200,
                'message' => 'Category Deleted successfully',
            ] );
        }
        else
        {
            return response()->json( [
                'status' => 404,
                'message' => 'No Category ID Found',
            ] );
        }
    }
}
