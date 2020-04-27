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
    public $profile_url;
    public $forgot_password_url;
    public $noindex;

    public function __construct() {
        /** @var {array} $options - Gets the old berta user from PHP file. */
        /** @todo: Fix this, make user storage safer! */
        include realpath(config('app.old_berta_root'). '/engine/config/inc.conf.php');

        $this->name = $options['AUTH_user'];
        $this->password = $options['AUTH_password'];
        $this->profile_url = $this->getHostingData('HOSTING_PROFILE');
        $this->forgot_password_url = $this->getHostingData('FORGOTPASSWORD_LINK');
        $this->features = $this->getFeatures();
        $this->noindex = $this->getHostingData('NOINDEX');
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
        $has_plan = file_exists($path);
        $plan = $has_plan ? intval(file_get_contents($path)) : null;
        // Berta plans
        // 1 - Basic
        // 2 - Pro
        // 3 - Shop
        $is_trial = !$has_plan && $this->profile_url;

        if ($is_trial || $plan > 1) {
            $features[] = 'multisite';
        }

        if ($is_trial || $plan == 3) {
            $features[] = 'shop';
        }

        return $features;
    }

    private function getHostingData($item)
    {
        $ENGINE_ROOT_PATH = realpath(config('app.old_berta_root') . '/engine') . '/';
        include realpath(config('app.old_berta_root') . '/engine/inc.hosting.php');

        if (!isset($options[$item])) {
            return null;
        }

        return $options[$item];
    }

}
