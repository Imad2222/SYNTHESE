<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        
        //validate incoming request
        $validator= Validator::make($request->all(), [
            'name' => 'required|string|max:191',
            'email' => 'required|email|unique:users|max:191|unique:users,email',
            'password' => 'required|min:6'
        ]);
        
        if($validator->fails())
        {
            return response()->json(['Validation_errors' => $validator->messages(),
        ]);
        }

        else
        {
            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
            ]);
            $token = $user->createToken($user->email.'_Token')->plainTextToken;

            return response()->json([
                'status' => 200,
                'token' => $token,
                'username' => $user->name,
                'message' => 'Registered successfully',

            ]);
        }
    }

    public function login(Request $request){
        $validator= Validator::make($request->all(), [
            'email' => 'required|email|max:191',
            'password' => 'required|min:6'
        ]);
        if($validator->fails())
        {
            return response()->json(['Validation_errors' => $validator->messages(),
        ]);
        }
        else 
        {
            $user=User::where('email', $request->email)->first();

            if (!$user || ! Hash::check($request->password, $user->password)) 
            {
                return response()->json([
                    'status' => 401,
                    'message' => 'Authentification error. Please check your login information.',
                ]);
            }

            else
             {
                if($user->role_as == 1) // si l'utilisateur est admin
                {
                    $role='admin';
                    $token = $user->createToken($user->email.'_AdminToken',['server:admin'])->plainTextToken;
                }
                else
                {
                    $role='';
                    $token = $user->createToken($user->email.'_Token',[''])->plainTextToken; // token unique pour chaque utilisateur apres la connexion
                }

                
                return response()->json([
                'status' => 200,
                'token' => $token,
                'username' => $user->name,
                'message' => 'Logged in successfully',
                'role' => $role
              ]);

            }

            

        }
        
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();
        return response()->json([
            'status' => 200,
            'message' => 'Logged out successfully',
        ]);
    }
}
