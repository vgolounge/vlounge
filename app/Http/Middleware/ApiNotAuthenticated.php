<?php

namespace App\Http\Middleware;

use App\Auth;
use App\StatusCode;
use Closure;
use Illuminate\Http\Request;

class ApiNotAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $guard = null)
    {
        if (!Auth::check())
            return response()->json(
                [
                    'status' => StatusCode::GENERIC_INTERNAL_ERROR,
                    'message' => 'Not authenticated.'
                ]
            );

        return $next($request);
    }
}
