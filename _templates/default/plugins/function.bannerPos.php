<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.bannerPos.php
 * Type:     function
 * Name:     bannerPos
 * Purpose:
 * -------------------------------------------------------------
 */
function smarty_function_bannerPos($params, &$smarty)
{
    global $berta;

    if (!empty($params['xy_name'])) {
        $params['xy'] = $smarty->getTemplateVars($params['xy_name']);
    }

    $pos = !empty($params['xy']) ? explode(',', $params['xy']) :
        [
            rand($placeInFullScreen ? 0 : 900, 960),
            rand($placeInFullScreen ? 0 : 30, $placeInFullScreen ? 600 : 200)
        ];
    return "left:{$pos[0]}px;top:{$pos[1]}px;";
}
