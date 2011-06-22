<?

error_reporting(E_ALL);
@ini_set("display_errors", 1);


// Set multibyte encoding to UTF-8 for better canonization of strings
if(function_exists('mb_internal_encoding') && function_exists('mb_regex_encoding')) {
	@mb_internal_encoding("UTF-8"); 
	@mb_regex_encoding("UTF-8");
}

// basic paths...

if(empty($INDEX_INCLUDED)) $INDEX_INCLUDED = false;
if(empty($SITE_ROOT)) $SITE_ROOT = $INDEX_INCLUDED ? './' : '../';
if(empty($ENGINE_ROOT)) $ENGINE_ROOT = $SITE_ROOT . 'engine/';
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

include_once $ENGINE_ROOT . '_classes/class.berta.php';
include_once $ENGINE_ROOT . '_classes/class.bertagallery.php';
include_once $ENGINE_ROOT . 'inc.engineprefs.php';			// since this include $options refer to BertaBase::$options
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
$options['ENVIRONMENT'] = BERTA_ENVIRONMENT;

$berta = new Berta();
if(AUTH_AUTHREQUIRED && !$berta->security->authentificated) {
	$berta->security->goToLoginPage($ENGINE_ROOT . 'login.php');
}




// settings ------------------------------------------------------------------------------------------------------------------------------------------

include($ENGINE_ROOT . 'inc.settings.php');
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