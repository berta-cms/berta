<?php
/** THis file can not be loaded directly through browser, it's only meant to be included */
$included_files = get_included_files();
if (!in_array(__FILE__, get_included_files()) || $included_files[0] == __FILE__) {
    /* IF this file is not included, redirect to root of the page */
    header('Location: /');
    exit;
}

if ($berta->security->userLoggedIn) {
    include_once $ENGINE_ROOT_PATH . '_classes/class.bertaeditor.php';
}
//$t->point("page");

// ------------------------------------------------------------------------------------------------------------------------------
//  GPC variables   -------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------

$site = null;
$sectionName = false;
$subSectionName = false;
$tagName = false;
$urlStr = false;
if ($berta->apacheRewriteUsed) {
    include $ENGINE_ROOT_PATH . '_classes/class.clean_url.php';
    $cU = new CleanURL();

    $urlStr = $_SERVER['REQUEST_URI'];
    if (strpos($urlStr, $SITE_ROOT_URL) === 0) {
        $urlStr = substr($urlStr, strlen($SITE_ROOT_URL) - 1);
    }
    $cU->parseURL($urlStr);

    if (!empty($options['MULTISITE'])) {
        $urlParts = $cU->getParts(3);
        $site = $urlParts[0];
        $sectionName = $urlParts[1];
        $tagName = $urlParts[2];
    } else {
        $urlParts = $cU->getParts(2);
        $sectionName = $urlParts[0];
        $tagName = $urlParts[1];
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
    header('Location: ' . ($berta->environment == 'engine' ? $ENGINE_ROOT_URL : $SITE_ROOT_URL));
    include dirname(__dir__) . '/error/404.php';
    exit;
}
//$t->point("content init");

// ------------------------------------------------------------------------------------------------------------------------------
//  CHECK VERSIONS   ------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------

if (empty($berta->content['@attributes']['last_upd_ver']) || ($berta->content['@attributes']['last_upd_ver'] != $options['version'])) {
    include_once $ENGINE_ROOT_PATH . 'inc.version_check_and_updates.php';
}

// ------------------------------------------------------------------------------------------------------------------------------
//  HTML OUTPUT   ---------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------

$html = $berta->output();
echo $html;

//$t->point("html written");
//echo '<br class="clear" />'; $t->report();
