<?php

namespace App\User;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Foundation\Auth\Access\Authorizable;

class UserModel implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable;

    public $name;

    public $password;

    public $features;

    public $profile_url;

    public $forgot_password_url;

    public $plans;

    public $noindex;

    public $intercom;

    public $helpcrunch;

    public function __construct()
    {
        /** @var {array} $options - Gets the old berta user from PHP file. */
        /** @todo: Fix this, make user storage safer! */
        include realpath(config('app.old_berta_root') . '/engine/config/inc.conf.php');

        $this->name = $options['AUTH_user'];
        $this->password = $options['AUTH_password'];
        $this->profile_url = $this->getHostingData('HOSTING_PROFILE');
        $this->forgot_password_url = $this->getHostingData('FORGOTPASSWORD_LINK');
        $this->plans = $this->getHostingData('PLANS');
        $this->features = $this->getFeatures();
        $this->noindex = $this->getHostingData('NOINDEX');
        $this->intercom = $this->getIntercomData();
        $this->helpcrunch = $this->getHelpcrunchData();
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

    public function getPlan()
    {
        $path = config('app.old_berta_root') . '/engine/plan';
        if (! file_exists($path)) {
            return null;
        }

        return intval(file_get_contents($path));
    }

    public function isBertaHosting()
    {
        return ! empty($this->profile_url);
    }

    private function getFeatures()
    {
        $features = [];
        // Berta plans
        // 1 - Basic
        // 2 - Pro
        // 3 - Shop
        $plan = $this->getPlan();
        $is_trial = $plan === null && $this->profile_url;

        if (! $this->profile_url || $plan) {
            $features[] = 'custom_javascript';
        }

        if ($is_trial || $plan > 1) {
            $features[] = 'multisite';
            $features[] = 'hide_berta_copyright';
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

        if (! isset($options[$item])) {
            return null;
        }

        return $options[$item];
    }

    private function getIntercomData()
    {
        $intercomAppId = $this->getHostingData('INTERCOM_APP_ID');
        $intercomSecretKey = $this->getHostingData('INTERCOM_SECRET_KEY');
        if (! $intercomAppId || ! $intercomSecretKey) {
            return null;
        }
        $userHash = hash_hmac('sha256', $this->name, $intercomSecretKey);

        return [
            'appId' => $intercomAppId,
            'userName' => $this->name,
            'userHash' => $userHash,
        ];
    }

    private function getHelpcrunchData()
    {
        $helpcrunchApiOrganization = $this->getHostingData('HELPCRUNCH_API_ORGANIZATION');
        $helpcrunchAppId = $this->getHostingData('HELPCRUNCH_APP_ID');
        $helpcrunchApiKey = $this->getHostingData('HELPCRUNCH_API_KEY');
        $uid = ! empty($_SESSION['_berta__user']['uid']) ? $_SESSION['_berta__user']['uid'] : null;

        if (! $helpcrunchApiOrganization || ! $helpcrunchAppId || ! $helpcrunchApiKey || ! $uid) {
            return null;
        }

        $security_hash = hash_hmac('sha256', $uid, $helpcrunchApiKey);

        return [
            'organization' => $helpcrunchApiOrganization,
            'appId' => $helpcrunchAppId,
            'user_id' => $uid,
            'security_hash' => $security_hash,
            'email' => $this->name,
        ];
    }
}
