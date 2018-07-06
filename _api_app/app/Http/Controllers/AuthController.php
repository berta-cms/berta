<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use App\Shared\Helpers;

class AuthController extends Controller
{
    protected static $expiration_time = 86400; // 24 hours = 86400 seconds

    protected function generateToken()
    {
        $app_key = config('app.key');
        $app_id = config('app.id');
        $payload = [
            'iat' => time(), // Time when JWT was issued.
            'exp' => time() + self::$expiration_time // Expiration time
        ];

        return JWT::encode($payload, $app_key);
    }

    public function authenticate(Request $request)
    {
        $token = $request->input('auth_key');
        $valid_token = false;

        if ($token && Helpers::validate_token($token)) {
            $valid_token = true;
        }

        include realpath(config('app.old_berta_root') . '/engine/config/inc.conf.php');
        $auth_user = $options['AUTH_user'];
        $auth_pass = $options['AUTH_password'];

        if (!$valid_token && !($request->input('auth_user') == $auth_user && $request->input('auth_pass') == $auth_pass)) {
            header('Location:' . \Berta::$options['SITE_ABS_ROOT'] . 'engine/login.php?autherror=1');
            exit;
        }

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

        $ENGINE_ROOT = realpath(config('app.old_berta_root'). '/engine') . '/';
        include realpath(config('app.old_berta_root'). '/engine/inc.hosting.php');
        \Berta::$options['HOSTING_PROFILE'] = $options['HOSTING_PROFILE'];
        \Berta::$options['XML_ROOT'] = realpath(config('app.old_berta_root'). '/storage') . '/';
        include realpath(config('app.old_berta_root'). '/engine/inc.version.php');
        \Berta::$options['version'] = $options['version'];
        /** @! This may not work with berta deep in subdirectories */
        \Berta::$options['SITE_ABS_ROOT'] = str_replace('\\', '/', dirname(dirname($_SERVER['PHP_SELF'])));

        $this->bertaSecurity = new \BertaSecurity();

        if (!$valid_token) {
            $token = $this->generateToken();
        }

        setcookie('token', $token, time() + self::$expiration_time, "/");

        if ($this->bertaSecurity->login($auth_user, $auth_pass, $options['AUTH_user'], $options['AUTH_password'])) {
            header('Location:' . \Berta::$options['SITE_ABS_ROOT'] . 'engine');
            exit;
        }

        header('Location:' . \Berta::$options['SITE_ABS_ROOT'] . 'engine/login.php?autherror=1');
        exit;
    }
}
