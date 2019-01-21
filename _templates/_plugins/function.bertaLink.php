<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.bertaLink.php
 * Type:     function
 * Name:     bertaLink
 * Purpose:
 * -------------------------------------------------------------
 */
function smarty_function_bertaLink($params, &$smarty)
{
    global $berta, $SITE_ROOT_URL, $options;

    $settings = $berta->template->settings;
    $constructPrettyLink = $berta->apacheRewriteUsed && $berta->environment == 'site';
    $alwaysSelectTag = $berta->settings->get('navigation', 'alwaysSelectTag') == 'yes';

    if (!empty($params['section']) && empty($berta->sections[$params['section']])) {
        $params['section'] = reset(array_keys($berta->sections));
    }

    // return external link, if one specified
    if ($berta->sections[$params['section']]['@attributes']['type'] == 'external_link' && !empty($berta->sections[$params['section']]['link'])) {
        return $berta->sections[$params['section']]['link']['value'];
    }

    $hasSSComponent = !empty($params['tag']) && !empty($berta->tags[$params['section']]);
    $sectionKeys = array_keys($berta->sections);
    $sectionIsFirst = $params['section'] == reset($sectionKeys);
    $sectionHasDirectContent = !empty($berta->sections[$params['section']]['@attributes']['has_direct_content']);

    $subSectionIsFirst = true;
    if ($hasSSComponent) {
        $sectionTagsKeys = array_keys($berta->tags[$params['section']]);
        $subSectionIsFirst = $alwaysSelectTag && $params['tag'] == reset($sectionTagsKeys);
    }

    $link = [];
    $site = '';

    if (isset($params['site']) && $params['site'] !== '0') {
        $site = $params['site'];
    } elseif (!empty($options['MULTISITE'])) {
        $site = $options['MULTISITE'];
    }

    if (!empty($site)) {
        $link[] = !$constructPrettyLink ? ('site=' . $site) : $site;
    }

    if (!empty($params['section'])) {
        if (!$sectionIsFirst || $berta->environment == 'engine'
            || $sectionHasDirectContent && count($berta->tags[$params['section']]) > 0
            || !$subSectionIsFirst) {
            $link[] = !$constructPrettyLink ? ('section=' . $params['section']) : $params['section'];
        }
    }

    if ($hasSSComponent) {
        if ($berta->environment == 'engine' || $sectionHasDirectContent || !$subSectionIsFirst) {
            $link[] = !$constructPrettyLink ? ('tag=' . $params['tag']) : $params['tag'];
        }
    }

    if ($constructPrettyLink) {
        return $SITE_ROOT_URL . implode('/', $link) . ($link ? '/' : '');
    } else {
        return (isset($params['absRoot']) ? $SITE_ROOT_URL : '.') . ($link ? ('?' . implode('&', $link)) : '');
    }
}
