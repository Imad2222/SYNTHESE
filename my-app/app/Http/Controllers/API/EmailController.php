<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    public function sendEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'message' => 'required|string'
        ]);

        $email = $request->input('email');
        $message = $request->input('message');

        Mail::raw($message, function ($mail) use ($email) {
            $mail->to('zouibi@gmail.com')
                 ->subject('New Message from ' . $email);
        });

        return response()->json(['message' => 'Email sent successfully'], 200);
    }
}
