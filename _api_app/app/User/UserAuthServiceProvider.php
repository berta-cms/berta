<?php

namespace App\User;

use App\Http\Controllers\AuthController;
use App\Shared\Helpers;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;

class UserAuthServiceProvider extends ServiceProvider
{
    private $bertaSecurity;

    private $authController;

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        /**
         * For `\BertaSecurity` to work, we need other Berta classes, because there many configuration options that are
         * defined there. All of these includes are only used to make `\BertaSecurity` work.
         */
        require_once realpath(config('app.old_berta_root') . '/engine/_classes/class.bertabase.php');
        require_once realpath(config('app.old_berta_root') . '/engine/_classes/class.bertautils.php');
        /** @var {\Berta} \Berta - Old berta app class */
        require_once realpath(config('app.old_berta_root') . '/engine/_classes/class.berta.php');
        /** @var {\BertaSecurity} \BertaSecurity - Old berta security class, so the old login system would work */
        require_once realpath(config('app.old_berta_root') . '/engine/_classes/class.bertasecurity.php');

        /** @var {array} $options - this gets the berta version */
        include realpath(config('app.old_berta_root') . '/engine/inc.version.php');
        \Berta::$options['version'] = $options['version'];
        \Berta::$options['SITE_ROOT_URL'] = '/';

        $this->bertaSecurity = new \BertaSecurity;
    }

    /**
     * Boot the authentication services for the application.
     *
     * @return void
     */
    public function boot()
    {
        // Here you may define how you wish users to be authenticated for your Laravel
        // application. The callback which receives the incoming request instance
        // should return either a User instance or null. You're free to obtain
        // the User instance via an API token or any other method necessary.

        $this->app['auth']->viaRequest('jwt_token', function ($request) {
            $token = $this->getBearerToken($request);

            if (
                $token && Helpers::validateToken($token) ||
                // If the token is not provided, we need to check if OLD berta is authenticated
                // This is due to Old Systems dependency on the new ONE, sometimes it will need to know
                // Sometimes the old system will need to know if it's authenticated through the new system
                // see: SiteSettingsConfigService.php:32 (Auth::check())
                empty($token) && $this->bertaSecurity->authentificated
            ) {
                return new UserModel;
            } else {
                $this->authController = new AuthController;
                $this->authController->logout();

                return null;
            }
        });
    }

    /**
     * Get hearder Authorization
     * */
    private function getAuthorizationHeader()
    {
        $headers = null;
        if (isset($_SERVER['X-Authorization'])) {
            $headers = trim($_SERVER['X-Authorization']);
        } elseif (isset($_SERVER['X-authorization'])) {
            $headers = trim($_SERVER['X-authorization']);
        } elseif (isset($_SERVER['x-authorization'])) {
            $headers = trim($_SERVER['x-authorization']);
        } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) { // Nginx or fast CGI
            $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            // Server-side fix for bug in old Android versions (a nice side-effect of this fix means we don't care about capitalization for Authorization)
            $requestHeaders = array_combine(
                array_map('ucwords', array_keys($requestHeaders)),
                array_values($requestHeaders)
            );

            if (isset($requestHeaders['X-Authorization'])) {
                $headers = trim($requestHeaders['X-Authorization']);
            } elseif (isset($requestHeaders['X-authorization'])) {
                $headers = trim($requestHeaders['X-authorization']);
            } elseif (isset($requestHeaders['x-authorization'])) {
                $headers = trim($requestHeaders['x-authorization']);
            }
        }

        return $headers;
    }

    /**
     * get access token from header
     * */
    private function getBearerToken(Request $request)
    {
        $headers = $request->headers->get('x-authorization', null);
        if (! $headers) {
            $headers = $this->getAuthorizationHeader();
        }

        // HEADER: Get the access token from the header
        if (! empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                return $matches[1];
            }
        }

        if (env('APP_DEBUG') && $request->isMethod('get')) {
            return $request->cookie('token', null);
        }

        return null;
    }
}
