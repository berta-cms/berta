<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Factory as Auth;
use \Illuminate\Http\Request;

/**
 * @class AuthenticateAPI
 *
 * This class authenticates requests.
 */
class Authenticate
{
    /**
     * The authentication guard factory instance.
     *
     * @var \Illuminate\Contracts\Auth\Factory
     */
    protected $auth;

    /**
     * Create a new middleware instance.
     *
     * @param  \Illuminate\Contracts\Auth\Factory  $auth
     * @return void
     */
    public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }

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
        $apiPrefix = env('API_PREFIX', '_api');
        $isAPIRequest = strpos($request->getRequestUri(), '/'. $apiPrefix) === 0;

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
