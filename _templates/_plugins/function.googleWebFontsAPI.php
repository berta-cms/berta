<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.googleWebFontsAPI.php
 * Type:     function
 * Name:     googleWebFontsAPI
 * Purpose:
 * -------------------------------------------------------------
 */
function smarty_function_googleWebFontsAPI()
{
    global $berta;

    $s = $berta->template->settings;
    $fonts = [];
    $js_include = '';

    $generalFontSettings = $s->get('generalFontSettings', 'googleFont');
    if (!empty($generalFontSettings)) {
        $fonts[] = urlencode($generalFontSettings);
    }

    $pageHeading = $s->get('pageHeading', 'googleFont');
    if (!empty($pageHeading)) {
        $fonts[] = urlencode($pageHeading);
    }

    $menu = $s->get('menu', 'googleFont');
    if (!empty($menu)) {
        $fonts[] = urlencode($menu);
    }

    $subMenu = $s->get('subMenu', 'googleFont');
    if (!empty($subMenu)) {
        $fonts[] = urlencode($subMenu);
    }

    $entryHeading = $s->get('entryHeading', 'googleFont');
    if (!empty($entryHeading)) {
        $fonts[] = urlencode($entryHeading);
    }

    $entryFooter = $s->get('entryFooter', 'googleFont');
    if (!empty($entryFooter)) {
        $fonts[] = urlencode($entryFooter);
    }

    $sideBar = $s->get('sideBar', 'googleFont');
    if (!empty($sideBar)) {
        $fonts[] = urlencode($sideBar);
    }

    $tagsMenu = $s->get('tagsMenu', 'googleFont');
    if (!empty($sideBar)) {
        $fonts[] = urlencode($tagsMenu);
    }

    $heading = $s->get('heading', 'googleFont');
    if (!empty($heading)) {
        $fonts[] = urlencode($heading);
    }

    $heading = $berta->settings->get('shop', 'priceItemgoogleFont');
    if (!empty($heading)) {
        $fonts[] = urlencode($heading);
    }

    if ($fonts) {
        $js_include = "<link href='//fonts.googleapis.com/css?family=" . implode('|', $fonts) . "&amp;subset=latin,latin-ext,cyrillic-ext,greek-ext,greek,vietnamese,cyrillic' rel='stylesheet' type='text/css'>";
    }

    return $js_include;
}
