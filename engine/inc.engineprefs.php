<?php

if(empty($options)) $options = array();
include_once $ENGINE_ROOT . '_classes/class.bertabase.php';
BertaBase::$options = $options;
$options =& BertaBase::$options;


// user configuration variables

require 'config/inc.conf.php';


/**
 * Berta's release version
 */
$options['version'] = '0.8.4b';
$options['int_version'] = '1083';


/**
 * Interface language (I18n)
 * A file named like the value of this option must be placed into engine/lang folder, containing all translations
 */

$options['default_language'] = 'en';
$options['languages'] = array('en' => 'English', 'lv' => 'Latviešu', 'fr' => 'Français');


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

$options['XML_ROOT'] = $SITE_ROOT . 'storage/';
$options['MEDIA_FOLDER_NAME'] = 'media';
$options['MEDIA_ROOT'] = $SITE_ROOT . 'storage/' . $options['MEDIA_FOLDER_NAME'] . '/';
$options['MEDIA_TEMP_ROOT'] = $SITE_ROOT . 'storage/media/';
$options['CACHE_ROOT'] = $SITE_ROOT . 'storage/cache/';

$options['ENGINE_ABS_ROOT'] = $ENGINE_ABS_ROOT; // this is defined in inc.page.php that includes this preferences file
$options['MEDIA_ABS_ROOT'] = $options['SITE_ABS_ROOT'] . 'storage/media/';
$options['CACHE_ABS_ROOT'] = $options['SITE_ABS_ROOT'] . 'storage/cache/';


/**
 * Account link - if hosted
 */

$options['HOSTING_PROFILE'] = file_exists($ENGINE_ROOT.'hosting')?file_get_contents($ENGINE_ROOT.'hosting'):false;



/**
 * File name templates
 */

$options['settings.xml'] = 'settings.xml';
$options['settings.%.xml'] = 'settings.%.xml';
$options['sections.xml'] = 'sections.xml';
$options['tags.xml'] = 'tags.xml';
$options['cache.tags.%.xml'] = 'cache.tags.%.xml';
$options['blog.%.xml'] = 'blog.%.xml';

$options['tags'] = array();
$options['tags']['all_value'] = 'a181a603769c1f98ad927e7367c7aa51';



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