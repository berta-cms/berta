<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Factory as Auth;
use Illuminate\Http\Request;

class Authenticate
{
    protected $auth;

    /**
     * Create a new middleware instance.
     *
     * @return void
     */
    public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $guard = null)
    {
        $apiPrefix = config('app.api_prefix');
        $isAPIRequest = strpos($request->getRequestUri(), '/' . $apiPrefix) === 0;

        if ($this->auth->guard($guard)->guest()) {
            if ($isAPIRequest) {
                // Return JSON for API requests, so JS would work correctly.
                return response()->json(['message' => 'Unauthorized', 'data' => null], 401);
            }

            return response('Unauthorized', 401);
        }

        return $next($request);
    }
}
