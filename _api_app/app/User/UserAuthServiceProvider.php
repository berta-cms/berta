<?php

namespace App\User;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

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
        \Berta::$options['SITE_ABS_ROOT'] = str_replace('\\', '/', dirname(dirname($_SERVER['PHP_SELF'])));

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

        Auth::viaRequest('api', function ($request) {

            if(!$this->bertaSecurity->authentificated) {
                return null;
            }

            return new UserModel();
        });
    }
}
