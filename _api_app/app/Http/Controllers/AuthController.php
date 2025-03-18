<?php

namespace App\Http\Controllers;

use App\Shared\Helpers;
use App\User\UserModel;
use Firebase\JWT\JWT;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    private $bertaSecurity;
    protected static $expiration_time = 86400; // 24 hours = 86400 seconds

    protected function generateToken()
    {
        $app_key = config('app.key');
        $payload = [
            'iat' => time(), // Time when JWT was issued.
            'exp' => time() + self::$expiration_time, // Expiration time
        ];

        return JWT::encode($payload, $app_key, 'HS256');
    }

    public function authenticate(Request $request)
    {
        $isAjax = $request->ajax();
        $token = $this->authenticateRequestAndGetToken($request);

        if (!$token) {
            if ($isAjax) {
                return Helpers::api_response('Invalid token!', (object) [], 401);
            } else {
                return new RedirectResponse(\Berta::$options['SITE_ROOT_URL'] . 'engine/login?autherror=1');
            }
        }

        setcookie('token', $token, time() + self::$expiration_time, '/');

        if ($isAjax) {
            return Helpers::api_response('Valid token');
        } else {
            return new RedirectResponse(\Berta::$options['SITE_ROOT_URL'] . 'engine/login?token=' . $token);
        }
    }

    public function logout()
    {
        /**
         * For `\BertaSecurity` to work, we need other Berta classes, because there many configuration options that are
         * defined there. All of these includes are only used to make `\BertaSecurity` work.
         */
        require_once realpath(config('app.old_berta_root') . '/engine/_classes/class.bertabase.php');
        require_once realpath(config('app.old_berta_root') . '/engine/_classes/class.bertautils.php');
        /** @var {\Berta} \Berta - Old berta app class */
        require_once realpath(config('app.old_berta_root') . '/engine/_classes/class.berta.php');
        /** @var {\BertaSecurity} \BertaSecurity - Old berta security class, so the old login system would work  */
        require_once realpath(config('app.old_berta_root') . '/engine/_classes/class.bertasecurity.php');

        /** @var {array} $options - this gets the berta version */
        include realpath(config('app.old_berta_root') . '/engine/inc.version.php');
        \Berta::$options['version'] = $options['version'];
        \Berta::$options['SITE_ROOT_URL'] = '/';

        $this->bertaSecurity = new \BertaSecurity();
        $this->bertaSecurity->destroy();

        setcookie('token', '', -1, '/');
    }

    public function apiLogin(Request $request)
    {
        $token = $this->authenticateRequestAndGetToken($request);
        if (!$token) {
            return Helpers::api_response('Login failed!', (object) [], 401);
        }

        /** @todo: remove this when we move to the new app. This will be necessary for some time for the iframe */
        setcookie('token', $token, time() + self::$expiration_time, '/');

        $user = new UserModel();

        return Helpers::api_response('Login successful!', [
            'name' => $user->name,
            'token' => $token,
            'features' => $user->features,
            'profileUrl' => $user->profile_url,
            'intercom' => $user->intercom,
            'helpcrunch' => $user->helpcrunch,
        ]);
    }

    public function apiLogout()
    {
        try {
            $this->logout();
        } catch (\Throwable $t) {
            return Helpers::api_response('Logout failed!', (object) [], 400);
        } catch (\Exception $e) {
            return Helpers::api_response('Logout failed!', (object) [], 400);
        }

        return Helpers::api_response('Logout successful');
    }

    public function changePassword(Request $request)
    {
        $old_password = $request->input('old_password');
        $new_password = $request->input('new_password');
        $retype_password = $request->input('retype_password');

        $conf_file = realpath(config('app.old_berta_root') . '/engine/config/inc.conf.php');
        include $conf_file;
        $password = $options['AUTH_password'];

        if ($password != $old_password) {
            return Helpers::api_response('Current password doesn\'t match!', (object) [], 412);
        } elseif ($new_password != $retype_password) {
            return Helpers::api_response('New and retyped password doesn\'t match!', (object) [], 412);
        } elseif (strlen($new_password) < 6) {
            return Helpers::api_response('Password must be at least 6 characters long!', (object) [], 412);
        } elseif (!preg_match('/^[A-Za-z0-9]+$/', $new_password)) {
            return Helpers::api_response('Password must contain only alphanumeric characters!', (object) [], 412);
        } elseif (!is_writable($conf_file)) {
            return Helpers::api_response('Config file is not writable!', (object) [], 400);
        } else {
            $content = file_get_contents($conf_file);
            $new_content = str_replace(
                "\$options['AUTH_password'] = '" . $old_password . "'",
                "\$options['AUTH_password'] = '" . $new_password . "'",
                $content
            );

            file_put_contents($conf_file, $new_content);
        }

        return Helpers::api_response('Password successfully changed!');
    }

    private function authenticateRequestAndGetToken(Request $request)
    {
        $token = $request->input('auth_key');
        $valid_token = false;

        if ($token && Helpers::validateToken($token)) {
            $valid_token = true;
        }

        include realpath(config('app.old_berta_root') . '/engine/config/inc.conf.php');
        $auth_user = $options['AUTH_user'];
        $auth_pass = $options['AUTH_password'];

        if (!$valid_token && !($request->input('auth_user') == $auth_user && $request->input('auth_pass') == $auth_pass)) {
            return null;
        }

        /**
         * For `\BertaSecurity` to work, we need other Berta classes, because there many configuration options that are
         * defined there. All of these includes are only used to make `\BertaSecurity` work.
         */
        require_once realpath(config('app.old_berta_root') . '/engine/_classes/class.bertabase.php');
        require_once realpath(config('app.old_berta_root') . '/engine/_classes/class.bertautils.php');
        /** @var {\Berta} \Berta - Old berta app class */
        require_once realpath(config('app.old_berta_root') . '/engine/_classes/class.berta.php');
        /** @var {\BertaSecurity} \BertaSecurity - Old berta security class, so the old login system would work  */
        require_once realpath(config('app.old_berta_root') . '/engine/_classes/class.bertasecurity.php');

        /** @var {array} $options - this gets the berta version */

        $ENGINE_ROOT_PATH = realpath(config('app.old_berta_root') . '/engine') . '/';
        include realpath(config('app.old_berta_root') . '/engine/inc.hosting.php');
        \Berta::$options['HOSTING_PROFILE'] = $options['HOSTING_PROFILE'];
        \Berta::$options['XML_ROOT'] = realpath(config('app.old_berta_root') . '/storage') . '/';
        include realpath(config('app.old_berta_root') . '/engine/inc.version.php');
        \Berta::$options['version'] = $options['version'];
        /** @! This may not work with berta deep in subdirectories */
        \Berta::$options['SITE_ROOT_URL'] = str_replace('\\', '/', dirname(dirname($_SERVER['PHP_SELF'])));

        $this->bertaSecurity = new \BertaSecurity();

        if (!$valid_token) {
            $token = $this->generateToken();
        }

        if ($this->bertaSecurity->login($auth_user, $auth_pass, $options['AUTH_user'], $options['AUTH_password'])) {
            return $token;
        }

        return null;
    }
}
