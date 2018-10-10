<?php

namespace App\Http\Controllers;

use App\StatusCode;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class HomeController extends Controller
{

    public function index(Request $request)
    {
    	//if($request->session()->get('theme') == 'default' || $request->input('ui') == 'default')
//    	    return view('pages.home');
//        else
    	    return view('layouts.react');
    }
    public function getServerTime(Request $request)
    {
        response()->json([
            'status'=>StatusCode::OK,
            'time'=>[
                'datetime'=>date('Y-m-d H:i:s'),
                'unix'=>time()
            ]
        ]);
    }

    public function team_logo($team_id)
    {
        return new BinaryFileResponse(base_path("public/csgo_teams/$team_id"));
    }
}
