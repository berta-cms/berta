<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.messStyles.php
 * Type:     function
 * Name:     messStyles
 * Purpose:
 * -------------------------------------------------------------
 */
function smarty_function_messStyles($params, &$smarty) {
	global $berta;

	$s =& $berta->template->settings;
	$isResponsive = $s->get('pageLayout', 'responsive')=='yes';

	if ($isResponsive) return;

	$placeInFullScreen = !empty($params['entry']) ? !empty($params['entry']['updated']) : true;

	$pos = !empty($params['xy']) ? explode(',', $params['xy']) :
		array(
			rand($placeInFullScreen ? 0 : 900, 960),
			rand($placeInFullScreen ? 0 : 30, $placeInFullScreen ? 600 : 200)
		);
	return "left:{$pos[0]}px;top:{$pos[1]}px;";
}

?>