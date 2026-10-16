<?php

date_default_timezone_set(@date_default_timezone_get());

$options['IS_AJAX'] = $IS_AJAX;

if (empty($options)) {
    $options = [];
}
include_once $ENGINE_ROOT_PATH . '_classes/class.bertabase.php';
BertaBase::$options = $options;
$options = &BertaBase::$options;

// user configuration variables

require 'config/inc.conf.php';

/**
 * Berta's release version
 */
require 'inc.version.php';

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Base paths - absolute root and host
 */
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

$options['tags'] = [];
$options['tags']['all_value'] = 'a181a603769c1f98ad927e7367c7aa51';

/**
 * System folders
 */
$options['ENGINE_ROOT_URL'] = $ENGINE_ROOT_URL;
$options['ENGINE_ROOT_PATH'] = $ENGINE_ROOT_PATH;
$options['SITE_ROOT_PATH'] = $SITE_ROOT_PATH;
$options['SITE_ROOT_URL'] = $SITE_ROOT_URL;

$options['TEMPLATES_ROOT'] = $SITE_ROOT_PATH . '_templates/';
$options['TEMPLATES_ABS_ROOT'] = $options['SITE_ROOT_URL'] . '_templates/';
$options['TEMPLATES_FULL_SERVER_PATH'] = $SITE_ROOT_PATH . '_templates' . '/';

$options['PREVIEW_FOLDER'] = isset($_REQUEST['preview']) ? 'preview/' : '';

/**
 * Writable folders
 */
$options['XML_MAIN_ROOT'] = $SITE_ROOT_PATH . 'storage/';
$options['XML_SITES_ROOT'] = $options['XML_MAIN_ROOT'] . '-sites/';

$options['MULTISITES'] = BertaContent::getSites(! $INDEX_INCLUDED);
$options['MULTISITE'] = BertaContent::getSite($options);

$options['MEDIA_FOLDER_NAME'] = 'media';

if (! empty($options['MULTISITE'])) {
    $options['XML_ROOT'] = $options['XML_SITES_ROOT'] . $options['MULTISITE'] . '/' . $options['PREVIEW_FOLDER'];

    $options['MEDIA_ROOT'] = $options['XML_ROOT'] . $options['MEDIA_FOLDER_NAME'] . '/';
    $options['MEDIA_URL'] = '/storage/-sites/' . $options['MULTISITE'] . '/' . $options['PREVIEW_FOLDER'] . $options['MEDIA_FOLDER_NAME'] . '/';

    $options['CACHE_ROOT'] = $options['XML_ROOT'] . 'cache/';
    $options['MEDIA_ABS_ROOT'] = $options['SITE_ROOT_URL'] . 'storage/-sites/' . $options['MULTISITE'] . '/' . $options['PREVIEW_FOLDER'] . 'media/';
    $options['CACHE_ABS_ROOT'] = $options['SITE_ROOT_URL'] . 'storage/-sites/' . $options['MULTISITE'] . '/' . $options['PREVIEW_FOLDER'] . 'cache/';
} else {
    $options['XML_ROOT'] = $SITE_ROOT_PATH . 'storage/' . $options['PREVIEW_FOLDER'];

    $options['MEDIA_ROOT'] = $SITE_ROOT_PATH . 'storage/' . $options['PREVIEW_FOLDER'] . $options['MEDIA_FOLDER_NAME'] . '/';
    $options['MEDIA_URL'] = $SITE_ROOT_URL . 'storage/' . $options['PREVIEW_FOLDER'] . $options['MEDIA_FOLDER_NAME'] . '/';

    $options['CACHE_ROOT'] = $SITE_ROOT_PATH . 'storage/' . $options['PREVIEW_FOLDER'] . 'cache/';
    $options['MEDIA_ABS_ROOT'] = $options['SITE_ROOT_URL'] . 'storage/' . $options['PREVIEW_FOLDER'] . 'media/';
    $options['CACHE_ABS_ROOT'] = $options['SITE_ROOT_URL'] . 'storage/' . $options['PREVIEW_FOLDER'] . 'cache/';
}

/**
 * Berta's hosting options
 */
require 'inc.hosting.php';

// Row gallery image limit returned from server
// Remaining images will be rendered in frontend
$options['row_gallery_image_limit'] = [
    'large' => 3,
    'medium' => 5,
    'small' => 7,
];

/**
 * Editables
 */
$xEmpty = 'xEmpty';
