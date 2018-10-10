<?php

namespace App\Http\Middleware;

use App\Auth;
use Closure;
use Illuminate\Http\Request;

class AdminOnly
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
        if (!Auth::check() OR !Auth::user()->is_admin)
			abort(404);

        return $next($request);
    }
}
