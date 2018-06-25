<?php

error_reporting(E_ALL);
@ini_set("display_errors", 1);
@ini_set("ignore_user_abort", 1);

try {
    /**
     * Here are included everything that needs to be autoloaded. So we can use it through `Use` keyword.
     * @var {Symfony\Component\ClassLoader\ClassLoader} $loader
     * @var {Monolog\Logger} $logger
     */
    include_once 'loader.helper.php';

} catch (Exception $e) {}

// You can now use your logger
// $logger->info('My logger is now ready');

//detect ajax request
$IS_AJAX = isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';

// Detects mobile devices
include_once '_lib/mobile_device_detect/mobile_device_detect.php';
$MOBILE_DEVICE = mobile_device_detect($DEVICE_USER_AGENT);

// Set multibyte encoding to UTF-8 for better canonization of strings
if(function_exists('mb_internal_encoding') && function_exists('mb_regex_encoding')) {
	@mb_internal_encoding("UTF-8");
	@mb_regex_encoding("UTF-8");
}

// basic paths...

if(empty($INDEX_INCLUDED)) $INDEX_INCLUDED = false;
if(empty($SITE_ROOT_PATH)) $SITE_ROOT_PATH = dirname(__dir__). '/';
if(empty($SITE_ROOT)) $SITE_ROOT = $SITE_ROOT_PATH;
if(empty($SITE_ROOT_URL)) $SITE_ROOT_URL = '/';

if(empty($ENGINE_ROOT)) $ENGINE_ROOT = $SITE_ROOT . 'engine/';
if(empty($ENGINE_ROOT_PATH)) $ENGINE_ROOT_PATH = $SITE_ROOT_PATH . 'engine/';
if(empty($ENGINE_ROOT_URL)) $ENGINE_ROOT_URL = $SITE_ROOT_URL . 'engine/';

$SITE_ABS_ROOT = str_replace('\\', '/', dirname($_SERVER['PHP_SELF']));

if(strlen($SITE_ROOT) > 2) {	// if SITE_ROOT is "../" or "../../" etc., but not "./"
	$s = $SITE_ROOT;
	while($s) {
		$s = substr($s, 0, strlen($s) - 3);
		$SITE_ABS_ROOT = str_replace('\\', '/', dirname($SITE_ABS_ROOT));
	}
}

//if(empty($INDEX_INCLUDED)) $SITE_ABS_ROOT = str_replace('\\', '/', dirname($SITE_ABS_ROOT));
//if(!empty($IS_CSS_FILE)) $SITE_ABS_ROOT = str_replace('\\', '/', dirname($SITE_ABS_ROOT));
if($SITE_ABS_ROOT != '/') $SITE_ABS_ROOT .= '/';
$ENGINE_ABS_ROOT = $SITE_ABS_ROOT . 'engine/';


$hasPHP5 = floatval(phpversion()) >= 5;
if(!$hasPHP5) {
	if(file_exists($SITE_ROOT . 'INSTALL/includes/first_visit_serverreqs.php')) {
		$CHECK_INCLUDED = true;
		include $SITE_ROOT . 'INSTALL/includes/first_visit_serverreqs.php';
	} else {
		die('Berta needs PHP5 support on server.');
	}
}



include 'inc.error_handling.php';
include_once 'inc.functions.php';




// prefs and basic variables -------------------------------------------------------------------------------------------------------------------------

include_once $ENGINE_ROOT_PATH . '_classes/class.berta.php';
include_once $ENGINE_ROOT_PATH . '_classes/class.bertagallery.php';
include_once $ENGINE_ROOT_PATH . 'inc.engineprefs.php';			// since this include $options refer to BertaBase::$options
include_once $ENGINE_ROOT_PATH . 'inc.sentry_error_handling.php';
if(empty($SITE_ABS_ROOT)) $SITE_ABS_ROOT = $options['SITE_ABS_ROOT'];
if(empty($ENGINE_ABS_ROOT)) $ENGINE_ABS_ROOT = $options['ENGINE_ABS_ROOT'];


// magic quotes --------------------------------------------------------------------------------------------------------------------------------------

if(!@get_magic_quotes_gpc()) {
	function addSlashesRecursive($var) {
		if(is_array($var)) return array_map('addSlashesRecursive', $var);
		return addslashes($var);
	}
	$_GET = array_map("addSlashesRecursive", $_GET);
	$_POST = array_map("addSlashesRecursive", $_POST);
	$_REQUEST = array_map("addSlashesRecursive", $_REQUEST);
}


// authentification ----------------------------------------------------------------------------------------------------------------------------------

if(!defined('AUTH_AUTHREQUIRED')) define('AUTH_AUTHREQUIRED', false);
if(!defined('BERTA_ENVIRONMENT')) define('BERTA_ENVIRONMENT', 'site');
if(!defined('DO_UPLOAD')) define('DO_UPLOAD', false);
$options['ENVIRONMENT'] = BERTA_ENVIRONMENT;

$berta = new Berta();

if (DO_UPLOAD && isset($_GET['session_id'])) {
    session_write_close();
    session_id($_GET['session_id']);
    session_start();
}

if(AUTH_AUTHREQUIRED && !$berta->security->authentificated) {
	if ($IS_AJAX){
		die("<script>window.location.href='".$ENGINE_ABS_ROOT . 'login.php'."'</script>");
    }elseif (DO_UPLOAD) {
        http_response_code(401);
        die();
	}else{
		$berta->security->goToLoginPage($ENGINE_ROOT_PATH . 'login.php');
	}
}




// settings ------------------------------------------------------------------------------------------------------------------------------------------

include($ENGINE_ROOT_PATH . 'inc.settings.php');

$berta->init($settingsDefinition);

// settings install management ----------------------------------------
if(!defined('SETTINGS_INSTALLREQUIRED')) define('SETTINGS_INSTALLREQUIRED', true);
if(!empty($_REQUEST['_berta_install_done'])) {

	// final installer adjustments
	if($berta->settings->get('texts', 'ownerName')) {
		$berta->settings->update('siteTexts', 'siteFooter', $berta->settings->get('texts', 'ownerName') . ' &copy; ');
	}
	if($berta->settings->get('siteTexts', 'siteHeading')) {
		$berta->settings->update('texts', 'pageTitle', $berta->settings->get('siteTexts', 'siteHeading'));
	}

	$berta->settings->update('berta', 'installed', 1);
	$berta->settings->save();
}
if(SETTINGS_INSTALLREQUIRED && !$berta->settings->get('berta', 'installed')) {
	if($berta->security->userLoggedIn) {
		$step = !empty($_REQUEST['_berta_install_step']) ? (int) $_REQUEST['_berta_install_step'] : 1;
		if($step < 1) $step = 1;
		if($step > 2) $step = 2;

		switch($step) {
			case 1:
				if(file_exists($SITE_ROOT . 'INSTALL/includes/check.php')) {
					$CHECK_INCLUDED = true;
					include $SITE_ROOT . 'INSTALL/includes/check.php';
					exit;
				}
				break;
			case 2:
				if(file_exists($SITE_ROOT . 'INSTALL/includes/wizzard.php')) {
					$CHECK_INCLUDED = true;
					include $SITE_ROOT . 'INSTALL/includes/wizzard.php';
					exit;
				}
				break;
		}
	} else {
		if(file_exists($SITE_ROOT . 'INSTALL/includes/first_visit.php')) {
			$CHECK_INCLUDED = true;
			include $SITE_ROOT . 'INSTALL/includes/first_visit.php';
		} else {
			die('Berta not installed.');
		}
		exit;
	}

}



// check installation ------------------------------------------------------------------------------------------------------------------------------------------
if(!defined('SETTINGS_INSTALLCHECKREQUIRED')) define('SETTINGS_INSTALLCHECKREQUIRED', true);
if(SETTINGS_INSTALLCHECKREQUIRED && $berta->settings->get('berta', 'installed')) {
	include 'inc.check_installation.php';
}


// etc. ----------------------------------------------------------------------------------------------------------------------------------------------

function convertToQueryString() {
	$strOutArr = array();
	for($i = 0, $j = func_num_args(); $i < $j; $i += 2) {
		$itmName = func_get_arg($i);
		$itm = func_get_arg($i + 1);
		if(is_array($itm)) foreach($itm as $itmValue)
			$strOutArr[] = $itmName . '[]=' . $itmValue;
		else
			$strOutArr[] = $itmName . '=' . $itm;
	}
	return implode('&', $strOutArr);
}



?>
