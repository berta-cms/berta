<?php

if (empty($INDEX_INCLUDED)) {
    $INDEX_INCLUDED = false;
}
if (!$INDEX_INCLUDED) {
    define('AUTH_AUTHREQUIRED', true);  // require authentification if inside engine folder
    define('BERTA_ENVIRONMENT', 'engine');
} else {
    define('SETTINGS_INSTALLREQUIRED', true);  // don't require INSTALL if just watching the site
}

//include_once ($INDEX_INCLUDED ? 'engine/' : '') . '_classes/class.timing.php';
//$t = new Timing();
//$t->point("init");

include dirname(__dir__) . '/inc.page.php';
if ($berta->security->userLoggedIn) {
    include_once $ENGINE_ROOT_PATH . '_classes/class.bertaeditor.php';
}
//$t->point("page");

// ------------------------------------------------------------------------------------------------------------------------------
//  GPC variables   -------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------

$sectionName = $subSectionName = $tagName = $urlStr = false;
if ($berta->apacheRewriteUsed) {
    include $ENGINE_ROOT_PATH . '_classes/class.clean_url.php';
    $cU = new CleanURL();

    $urlStr = $_SERVER['REQUEST_URI'];
    if (strpos($urlStr, $SITE_ROOT_URL) === 0) {
        $urlStr = substr($urlStr, strlen($SITE_ROOT_URL) - 1);
    }
    $cU->parseURL($urlStr);

    if (!empty($options['MULTISITE'])) {
        $cU->setParts('site', 'sectionName', 'tagName');
    } else {
        $cU->setParts('sectionName', 'tagName');
    }
    $querySectionName = $sectionName;
} else {
    $urlStr = $_SERVER['REQUEST_URI'];

    $sectionName = $querySectionName = !empty($_REQUEST['section']) ? strtolower($_REQUEST['section']) : false;
    //$subSectionName = !empty($_REQUEST['subsection']) ? strtolower($_REQUEST['subsection']) : false;
    $tagName = !empty($_REQUEST['tag']) ? strtolower($_REQUEST['tag']) : false;
}

// ------------------------------------------------------------------------------------------------------------------------------
//  INIT CONTENT   --------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------

$berta->initContent($urlStr, $sectionName, $tagName);
if ($querySectionName && $querySectionName != 'sitemap.xml' && $berta->sectionName != $querySectionName) {
    header('HTTP/1.1 301 Moved Permanently');
    header('Location: ' . ($berta->environment == 'engine' ? $ENGINE_ABS_ROOT : $SITE_ROOT_URL));
    include '../error/404.php';
    exit;
}
//$t->point("content init");

// ------------------------------------------------------------------------------------------------------------------------------
//  CHECK VERSIONS   ------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------

if (empty($berta->content['@attributes']['last_upd_ver']) || ($berta->content['@attributes']['last_upd_ver'] < $options['int_version'])) {
    include_once $ENGINE_ROOT_PATH . 'inc.version_check_and_updates.php';
}

// ------------------------------------------------------------------------------------------------------------------------------
//  HTML OUTPUT   ---------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------

$html = $berta->output();
echo $html;

//$t->point("html written");
//echo '<br class="clear" />'; $t->report();
