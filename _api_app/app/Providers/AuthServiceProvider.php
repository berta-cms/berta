<?php

namespace App\Providers;

use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

/**
 * For `\BertaSecurity` to work, we need other Berta classes, because there many configuration options that are
 * defined there. All of these includes are only used to make `\BertaSecurity` work.
 */
require_once(realpath(__DIR__.'/../../../engine/_classes/class.bertabase.php'));
require_once(realpath(__DIR__.'/../../../engine/_classes/class.bertautils.php'));
/** @var {\Berta} \Berta - Old berta app class */
require_once(realpath(__DIR__.'/../../../engine/_classes/class.berta.php'));
/** @var {\BertaSecurity} \BertaSecurity - Old berta security class, so the old login system would work  */
require_once(realpath(__DIR__.'/../../../engine/_classes/class.bertasecurity.php'));


class AuthServiceProvider extends ServiceProvider
{
    private $bertaSecurity;
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        /** @var {array} $options - this gets the berta version */
        include realpath(__DIR__.'/../../../engine/inc.version.php');
        \Berta::$options['version'] = $options['version'];
        /** @! This may not work with berta deep in subdirectories */
        \Berta::$options['SITE_ABS_ROOT'] = str_replace('\\', '/', dirname(dirname($_SERVER['PHP_SELF'])));
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

        Auth::viaRequest('api', function ($request) {
            if(!defined('DO_UPLOAD')) define('DO_UPLOAD', false);


            if (DO_UPLOAD && isset($_GET['session_id'])) {
                session_write_close();
                session_id($_GET['session_id']);
                session_start();
                return true;
            }

            $bertaSecurity = new \BertaSecurity();

            if(!$bertaSecurity->authentificated) {
                return null;
            }

            return true;
        });
    }
}
