<?php

error_reporting(E_ALL);
@ini_set('display_errors', 1);
@ini_set('ignore_user_abort', 1);

/**
 * Here are included everything that needs to be autoloaded. So we can use it through `Use` keyword.
 *
 * @var {Symfony\Component\ClassLoader\ClassLoader} $loader
 * @var {Monolog\Logger} $logger
 */
include_once 'loader.helper.php';

// You can now use your logger
// $logger->info('My logger is now ready');

// detect ajax request
$IS_AJAX = isset($_SERVER['HTTP_X_REQUESTED_WITH']) && ! empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';

// Detects mobile devices
include_once '_lib/mobile_device_detect/mobile_device_detect.php';
$DEVICE_USER_AGENT = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
$MOBILE_DEVICE = mobile_device_detect($DEVICE_USER_AGENT);

// Set multibyte encoding to UTF-8 for better canonization of strings
if (function_exists('mb_internal_encoding') && function_exists('mb_regex_encoding')) {
    @mb_internal_encoding('UTF-8');
    @mb_regex_encoding('UTF-8');
}

// basic paths...

if (empty($INDEX_INCLUDED)) {
    $INDEX_INCLUDED = false;
}

/** @var {string} $SITE_ROOT_PATH - Berta site source root directory location on the disc.
 * Used for PHP file includes and file saving/loading.
 */
if (empty($SITE_ROOT_PATH)) {
    $SITE_ROOT_PATH = dirname(__DIR__) . '/';
}

/** @var {string} $SITE_ROOT_URL - The root path of site used in URL generation.
 * Normally '/' (representing 'berta.me/'). */
if (empty($SITE_ROOT_URL)) {
    $SITE_ROOT_URL = '/';
}

/** @var {string} $ENGINE_ROOT_PATH - Berta engine location on the disc.
 * Used for PHP file includes and file saving/loading. */
if (empty($ENGINE_ROOT_PATH)) {
    $ENGINE_ROOT_PATH = $SITE_ROOT_PATH . 'engine/';
}

/** @var {string} $ENGINE_ROOT_URL - The root path of berta engine used in URL generation.
 * Normally '/engine' (representing 'berta.me/engine'). */
if (empty($ENGINE_ROOT_URL)) {
    $ENGINE_ROOT_URL = $SITE_ROOT_URL . 'engine/';
}

$hasSupportedPhpVersion = version_compare(PHP_VERSION, '8.2', '>=');

if (! $hasSupportedPhpVersion) {
    if (file_exists($SITE_ROOT_PATH . 'INSTALL/includes/first_visit_serverreqs.php')) {
        $CHECK_INCLUDED = true;
        include $SITE_ROOT_PATH . 'INSTALL/includes/first_visit_serverreqs.php';
    } else {
        exit('Berta needs PHP >= 8.2 support on server.');
    }
}

include 'inc.error_handling.php';
include_once 'inc.functions.php';

// prefs and basic variables -------------------------------------------------------------------------------------------------------------------------

include_once $ENGINE_ROOT_PATH . '_classes/class.berta.php';
include_once $ENGINE_ROOT_PATH . '_classes/class.bertagallery.php';
include_once $ENGINE_ROOT_PATH . 'inc.engineprefs.php';            // since this include $options refer to BertaBase::$options
include_once $ENGINE_ROOT_PATH . 'inc.sentry_error_handling.php';
if (empty($SITE_ROOT_URL)) {
    $SITE_ROOT_URL = $options['SITE_ROOT_URL'];
}

// magic quotes --------------------------------------------------------------------------------------------------------------------------------------

if (! (function_exists('get_magic_quotes_gpc') && @get_magic_quotes_gpc())) {
    function addSlashesRecursive($var)
    {
        if (is_array($var)) {
            return array_map('addSlashesRecursive', $var);
        }

        return addslashes($var);
    }
    $_GET = array_map('addSlashesRecursive', $_GET);
    $_POST = array_map('addSlashesRecursive', $_POST);
    $_REQUEST = array_map('addSlashesRecursive', $_REQUEST);
}

// authentification ----------------------------------------------------------------------------------------------------------------------------------

if (! defined('AUTH_AUTHREQUIRED')) {
    define('AUTH_AUTHREQUIRED', false);
}
if (! defined('BERTA_ENVIRONMENT')) {
    define('BERTA_ENVIRONMENT', 'site');
}
if (! defined('DO_UPLOAD')) {
    define('DO_UPLOAD', false);
}
$options['ENVIRONMENT'] = BERTA_ENVIRONMENT;

$berta = new Berta;

if (DO_UPLOAD && isset($_GET['session_id'])) {
    session_write_close();
    session_id($_GET['session_id']);
    session_start();
}

if (AUTH_AUTHREQUIRED && ! $berta->security->authentificated) {
    if ($IS_AJAX) {
        exit("<script>window.location.href='" . $ENGINE_ROOT_URL . 'login.php' . "'</script>");
    } elseif (DO_UPLOAD) {
        http_response_code(401);
        exit();
    } else {
        $berta->security->goToLoginPage($ENGINE_ROOT_URL . 'login.php');
    }
}

// settings ------------------------------------------------------------------------------------------------------------------------------------------

include $ENGINE_ROOT_PATH . 'inc.settings.php';

$berta->init($settingsDefinition);

// settings install management ----------------------------------------
if (! defined('SETTINGS_INSTALLREQUIRED')) {
    define('SETTINGS_INSTALLREQUIRED', true);
}
if (! empty($_REQUEST['_berta_install_done'])) {
    /** @todo: auto-create the first section */

    // final installer adjustments
    if ($berta->settings->get('texts', 'ownerName')) {
        $berta->settings->update('siteTexts', 'siteFooter', $berta->settings->get('texts', 'ownerName') . ' &copy; ');
    }
    if ($berta->settings->get('siteTexts', 'siteHeading')) {
        $berta->settings->update('texts', 'pageTitle', $berta->settings->get('siteTexts', 'siteHeading'));
    }

    $berta->settings->update('berta', 'installed', 1);
    $berta->settings->save();
}
if (SETTINGS_INSTALLREQUIRED && ! $berta->settings->get('berta', 'installed')) {
    if ($berta->security->userLoggedIn) {
        $step = ! empty($_REQUEST['_berta_install_step']) ? (int) $_REQUEST['_berta_install_step'] : 1;
        if ($step < 1) {
            $step = 1;
        }
        if ($step > 2) {
            $step = 2;
        }

        switch ($step) {
            case 1:
                if (file_exists($SITE_ROOT_PATH . 'INSTALL/includes/check.php')) {
                    $CHECK_INCLUDED = true;
                    include $SITE_ROOT_PATH . 'INSTALL/includes/check.php';
                    exit;
                }
                break;
            case 2:
                if (file_exists($SITE_ROOT_PATH . 'INSTALL/includes/wizzard.php')) {
                    $CHECK_INCLUDED = true;
                    include $SITE_ROOT_PATH . 'INSTALL/includes/wizzard.php';
                    exit;
                }
                break;
        }
    } else {
        if (file_exists($SITE_ROOT_PATH . 'INSTALL/includes/first_visit.php')) {
            $CHECK_INCLUDED = true;
            include $SITE_ROOT_PATH . 'INSTALL/includes/first_visit.php';
        } else {
            exit('Berta not installed.');
        }
        exit;
    }
}

// check installation ------------------------------------------------------------------------------------------------------------------------------------------
if (! defined('SETTINGS_INSTALLCHECKREQUIRED')) {
    define('SETTINGS_INSTALLCHECKREQUIRED', true);
}
if (SETTINGS_INSTALLCHECKREQUIRED && $berta->settings->get('berta', 'installed')) {
    include 'inc.check_installation.php';
}

// etc. ----------------------------------------------------------------------------------------------------------------------------------------------

function convertToQueryString()
{
    $strOutArr = [];
    for ($i = 0, $j = func_num_args(); $i < $j; $i += 2) {
        $itmName = func_get_arg($i);
        $itm = func_get_arg($i + 1);
        if (is_array($itm)) {
            foreach ($itm as $itmValue) {
                $strOutArr[] = $itmName . '[]=' . $itmValue;
            }
        } else {
            $strOutArr[] = $itmName . '=' . $itm;
        }
    }

    return implode('&', $strOutArr);
}
