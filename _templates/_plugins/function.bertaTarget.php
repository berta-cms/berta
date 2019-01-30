<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.bertaTarget.php
 * Type:     function
 * Name:     bertaLink
 * Purpose:
 * -------------------------------------------------------------
 */
function smarty_function_bertaTarget($params, &$smarty)
{
    global $berta;

    if (!empty($params['section']) && empty($berta->sections[$params['section']])) {
        $params['section'] = reset(array_keys($berta->sections));
    }

    // return external link, if one specified
    $sType = $berta->sections[$params['section']]['@attributes']['type'];
    if ($sType == 'external_link') {
        $target = !empty($berta->sections[$params['section']]['target']) ?
                    $berta->sections[$params['section']]['target']['value'] :
                    (!empty($berta->template->sectionTypes[$sType]['params']['target']['default']) ?
                        $berta->template->sectionTypes[$sType]['params']['target']['default'] :
                        '_self');
        return $target;
    } else {
        return '_self';
    }
}
