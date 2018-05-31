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

    public function __construct() {
        /** @var {array} $options - Gets the old berta user from PHP file. */
        /** @todo: Fix this, make user storage safer! */
        include realpath(config('app.old_berta_root'). '/engine/config/inc.conf.php');

        $this->name = $options['AUTH_user'];
        $this->password = $options['AUTH_password'];
    }


    /**
     * Get the name of the unique identifier for the user.
     *
     * @return string
     */
    public function getAuthIdentifierName()
    {
        'name';
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
}
