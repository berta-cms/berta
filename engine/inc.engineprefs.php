<?php
date_default_timezone_set(@date_default_timezone_get());

$options['IS_AJAX'] = $IS_AJAX;

if(empty($options)) $options = array();
include_once $ENGINE_ROOT . '_classes/class.bertabase.php';
BertaBase::$options = $options;
$options =& BertaBase::$options;


// user configuration variables

require 'config/inc.conf.php';


/**
 * Berta's release version
 */
$options['version'] = '0.8.9b';
$options['int_version'] = '1100';


/**
 * Interface language (I18n)
 * A file named like the value of this option must be placed into engine/lang folder, containing all translations
 */

$options['default_language'] = 'en';
$options['languages'] = array('en' => 'English', 'lv' => 'Latviešu', 'fr' => 'Français', 'ru' => 'Русский', 'nl' => 'Nederlands', 'pl' => 'Polski', 'es' => 'Spanish');


$options['MOBILE_DEVICE'] = $MOBILE_DEVICE;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Base paths - absolute root and host
 */
$options['SITE_ABS_ROOT'] = $SITE_ABS_ROOT;	// $SITE_ABS_ROOT is defined in inc.page.php that includes this file
$options['SITE_HOST_ADDRESS'] = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? 'https' : 'http') .
                                    '://' . $_SERVER['HTTP_HOST'];

/**
 * File name templates
 */
$options['sites.xml'] = 'sites.xml';
$options['settings.xml'] = 'settings.xml';
$options['settings.%.xml'] = 'settings.%.xml';
$options['sections.xml'] = 'sections.xml';
$options['tags.xml'] = 'tags.xml';
$options['cache.tags.%.xml'] = 'cache.tags.%.xml';
$options['blog.%.xml'] = 'blog.%.xml';

$options['tags'] = array();
$options['tags']['all_value'] = 'a181a603769c1f98ad927e7367c7aa51';


/**
 * System folders
 */

$options['ENGINE_ROOT'] = $ENGINE_ROOT;
$options['SITE_ROOT'] = $SITE_ROOT;

$options['TEMPLATES_ROOT'] = $SITE_ROOT . 'templates/';
$options['TEMPLATES_ABS_ROOT'] = $options['SITE_ABS_ROOT'] . 'templates/';
$options['TEMPLATES_FULL_SERVER_PATH'] = realpath($SITE_ROOT . 'templates') . '/';


/**
 * Writable folders
 */

$options['XML_MAIN_ROOT'] = $SITE_ROOT . 'storage/';
$options['XML_SITES_ROOT'] = $SITE_ROOT . 'storage/-sites/';

$options['MULTISITES'] = BertaContent::getSites(!$INDEX_INCLUDED);
$options['MULTISITE'] = BertaContent::getSite($options);

$options['MEDIA_FOLDER_NAME'] = 'media';

if( !empty($options['MULTISITE']) ) {
	$options['XML_ROOT'] = $options['XML_SITES_ROOT'] . $options['MULTISITE'] . '/';
	$options['MEDIA_ROOT'] = $options['XML_ROOT'] . $options['MEDIA_FOLDER_NAME'] . '/';
	$options['MEDIA_TEMP_ROOT'] = $options['MEDIA_ROOT'];
	$options['CACHE_ROOT'] = $options['XML_ROOT'] . 'cache/';
	$options['MEDIA_ABS_ROOT'] = $options['SITE_ABS_ROOT'] . 'storage/-sites/' . $options['MULTISITE'] . '/media/';
	$options['CACHE_ABS_ROOT'] = $options['SITE_ABS_ROOT'] . 'storage/-sites/' . $options['MULTISITE'] . '/cache/';
}else{
	$options['XML_ROOT'] = $SITE_ROOT . 'storage/';
	$options['MEDIA_ROOT'] = $SITE_ROOT . 'storage/' . $options['MEDIA_FOLDER_NAME'] . '/';
	$options['MEDIA_TEMP_ROOT'] = $options['MEDIA_ROOT'];
	$options['CACHE_ROOT'] = $SITE_ROOT . 'storage/cache/';
	$options['MEDIA_ABS_ROOT'] = $options['SITE_ABS_ROOT'] . 'storage/media/';
	$options['CACHE_ABS_ROOT'] = $options['SITE_ABS_ROOT'] . 'storage/cache/';
}

$options['ENGINE_ABS_ROOT'] = $ENGINE_ABS_ROOT; // this is defined in inc.page.php that includes this preferences file


/**
 * Account link - if hosted
 */

//common hosting config file for all bertas
if (file_exists($ENGINE_ROOT.'hosting')){
	$hostingConfig = parse_ini_string( file_get_contents($ENGINE_ROOT.'hosting') );
}
$options['HOSTING_PROFILE'] = isset($hostingConfig['login']) ? $hostingConfig['login'] : false;
$options['FORGOTPASSWORD_LINK'] = isset($hostingConfig['forgotPassword']) ? $hostingConfig['forgotPassword'] : 'http://support.berta.me/kb/login-name-and-password/forgot-my-password-for-self-hosted-berta';

//individual hosting config file for berta
if (file_exists($ENGINE_ROOT.'hosting_config')){
	$hostingConfigBerta = parse_ini_string( file_get_contents($ENGINE_ROOT.'hosting_config') );
}
$options['NOINDEX'] = isset($hostingConfigBerta['noindex']) && ( $hostingConfigBerta['noindex'] === $_SERVER['HTTP_HOST'] || 'www.'.$hostingConfigBerta['noindex'] === $_SERVER['HTTP_HOST'] );


// if hosted on HIP, need to show "hosted on HIP"
//$options['hip_ipaddr'] = array('85.31.99.218', '85.31.102.201');
$options['hip_ipaddr'] = array();


// external
$options['remote_update_uri'] = array(
	'http://www.berta.me/news_ticker_videos_update.php'
);
foreach($options['hip_ipaddr'] as $ip)
	$options['remote_update_uri'][] = 'http://' . $ip . '/berta-remote/news_ticker_videos_update.php';


// thumbnail size for editor layout
$options['images']['small_thumb_width'] = false;	// false means "auto"
$options['images']['small_thumb_height'] = 80;
$options['images']['small_thumb_prefix'] = '_smallthumb_';	// MUST start with an underscore ("_")

// background image prefix
$options['images']['bg_image_prefix'] = '_bg_';
$options['images']['grid_image_prefix'] = '_grid_';

// preview pic size and prefix
$options['images']['preview_prefix'] = '_preview_';	// MUST start with an underscore ("_")

$options['images']['small_width'] = 200;
$options['images']['small_height'] = 200;

$options['images']['medium_width'] = 400;
$options['images']['medium_height'] = 400;

$options['images']['large_width'] = 600;
$options['images']['large_height'] = 600;


/**
 * Editables
 */

$xEditSelectorSimple = 'xEditable';	// simple input
$xEditSelectorColor = 'xEditableColor';	// simple input
$xEditSelectorSelect = 'xEditableSelect';	// select
$xEditSelectorSelectRC = 'xEditableSelectRC';	// select
$xEditSelectorFontSelect = 'xEditableFontSelect';	// select
$xEditSelectorImage = 'xEditableImage';	// image upload
$xEditSelectorICO = 'xEditableICO';	// ico upload
$xEditSelectorTA = 'xEditableTA';	// textarea
$xEditSelectorMCE = 'xEditableMCE';	// textarea
$xEditSelectorMCESimple = 'xEditableMCESimple';	// textarea
$xEditSelectorRC = 'xEditableRC';	// with "real" content
$xEditSelectorYesNo = 'xEditableYesNo';	// the "yes/no" switch
$xEmpty = 'xEmpty';

$editsForSettings = array('text' => $xEditSelectorSimple,
  						  'longtext' => $xEditSelectorTA,
						  'richtext' => $xEditSelectorMCESimple,
						  'color' => $xEditSelectorColor,
						  'image' => $xEditSelectorImage,
						  'icon' => $xEditSelectorICO,
						  'select' => $xEditSelectorSelectRC,
					 	  'fontselect' => $xEditSelectorFontSelect);
?>