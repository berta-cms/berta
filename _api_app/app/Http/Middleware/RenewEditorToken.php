<?php

namespace App\Http\Middleware;

use App\User\EditorToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Renews the editor's session token while the editor is used (EditorToken::renewal()): the new token goes back in
 * the X-Berta-Token header, which the editor stores, and in the token cookie. Runs after Authenticate.
 */
class RenewEditorToken
{
    public const TOKEN_HEADER = 'X-Berta-Token';

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $response->isSuccessful() || ! preg_match('/Bearer\s(\S+)/', (string) $request->headers->get('x-authorization'), $matches)) {
            return $response;
        }

        $renewed = (new EditorToken)->renewal($matches[1]);

        if ($renewed !== null) {
            $response->headers->set(self::TOKEN_HEADER, $renewed);
            // A response carrying a session token must never be stored by a proxy or CDN.
            $response->headers->set('Cache-Control', 'no-store, private');
            EditorToken::setCookie($renewed);
        }

        return $response;
    }
}
