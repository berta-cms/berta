<?php

namespace App\User;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

use App\Shared\Helpers;
use App\User\UserModel;


class UserAuthServiceProvider extends ServiceProvider
{
    private $bertaSecurity;
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
        require_once(realpath(config('app.old_berta_root'). '/engine/_classes/class.bertabase.php'));
        require_once(realpath(config('app.old_berta_root'). '/engine/_classes/class.bertautils.php'));
        /** @var {\Berta} \Berta - Old berta app class */
        require_once(realpath(config('app.old_berta_root'). '/engine/_classes/class.berta.php'));
        /** @var {\BertaSecurity} \BertaSecurity - Old berta security class, so the old login system would work  */
        require_once(realpath(config('app.old_berta_root'). '/engine/_classes/class.bertasecurity.php'));

        /** @var {array} $options - this gets the berta version */
        include realpath(config('app.old_berta_root'). '/engine/inc.version.php');
        \Berta::$options['version'] = $options['version'];
        /** @! This may not work with berta deep in subdirectories */
        \Berta::$options['SITE_ROOT_URL'] = '/';

        $this->bertaSecurity = new \BertaSecurity();
    }

    /**
     * Boot the authentication services for the application.
     *
     * @return void
     */
    public function boot()
    {
        // Here you may define how you wish users to be authenticated for your Lumen
        // application. The callback which receives the incoming request instance
        // should return either a User instance or null. You're free to obtain
        // the User instance via an API token or any other method necessary.

        Auth::viaRequest('jwt_token', function ($request) {
            $token = $this->getBearerToken();

            if (!$token) {
                return null;
            }

            if (Helpers::validate_token($token)) {
                return new UserModel();
            } else {
                return null;
            }
        });
    }

    /**
     * Get hearder Authorization
     * */
    function getAuthorizationHeader()
    {
        $headers = null;
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER["Authorization"]);
        } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) { //Nginx or fast CGI
            $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            // Server-side fix for bug in old Android versions (a nice side-effect of this fix means we don't care about capitalization for Authorization)
            $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
            //print_r($requestHeaders);
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }
        return $headers;
    }
    /**
     * get access token from header
     * */
    function getBearerToken()
    {
        $headers = $this->getAuthorizationHeader();
        // HEADER: Get the access token from the header
        if (!empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                return $matches[1];
            }
        }
        return null;
    }
}
