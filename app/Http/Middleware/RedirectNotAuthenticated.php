<?php

namespace App\Http\Middleware;

use App\Auth;
use Closure;
use Illuminate\Http\Request;

class RedirectNotAuthenticated
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
            return redirect('/login');

        return $next($request);
    }
}
