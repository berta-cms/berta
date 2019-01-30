<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.additionalTextPos.php
 * Type:     function
 * Name:     additionalTextPos
 * Purpose:
 * -------------------------------------------------------------
 */
function smarty_function_additionalTextPos($params, &$smarty)
{
    global $berta;

    $freeXMin = $freeXMax = 0;

    if ($berta->template->settings->get('pageLayout', 'contentPosition') == 'left') {
        $freeXMin = (int) $berta->template->settings->get('pageLayout', 'contentWidth');
        $freeXMax = $freeXMin + 100;
    }

    $pos = !empty($params['xy']) ? explode(',', $params['xy']) :
        [
            rand($freeXMin, $freeXMax),
            40
        ];
    return "left:{$pos[0]}px;top:{$pos[1]}px;";
}
