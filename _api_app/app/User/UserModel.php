<?php

namespace App\User;

use Illuminate\Auth\Authenticatable;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;

class UserModel implements
    AuthenticatableContract,
    AuthorizableContract
{
    use Authenticatable, Authorizable;
    public $name;
    public $password;
    public $features;

    public function __construct() {
        /** @var {array} $options - Gets the old berta user from PHP file. */
        /** @todo: Fix this, make user storage safer! */
        include realpath(config('app.old_berta_root'). '/engine/config/inc.conf.php');

        $this->name = $options['AUTH_user'];
        $this->password = $options['AUTH_password'];
        $this->features = $this->getFeatures();
    }


    /**
     * Get the name of the unique identifier for the user.
     *
     * @return string
     */
    public function getAuthIdentifierName()
    {
        return 'name';
    }

    /**
     * Get the unique identifier for the user.
     *
     * @return mixed
     */
    public function getAuthIdentifier()
    {
        return $this->name;
    }

    private function getFeatures()
    {
        $features = [];

        //hosting plan file
        $path = config('app.old_berta_root') . '/engine/plan';

        if (file_exists($path)) {
            $plan = intval(file_get_contents($path));
            // Berta plans
            // 1 - Basic
            // 2 - Pro
            // 3 - Shop

            if ($plan > 1) {
                $features[] = 'multisite';
            }

            if ($plan == 3) {
               $features[] = 'shop';
            }
        }

        return $features;
    }

}
