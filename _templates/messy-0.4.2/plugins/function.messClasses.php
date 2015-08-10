<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.messClasses.php
 * Type:     function
 * Name:     messClasses
 * Purpose:
 * -------------------------------------------------------------
 */
function smarty_function_messClasses($params, &$smarty) {
	global $berta;

	$s =& $berta->template->settings;
	$isResponsive = $s->get('pageLayout', 'responsive')=='yes' || (isset($params['isResponsive']) && $params['isResponsive'] == 'yes');

	if ($isResponsive) return;

	return 'mess xEditableDragXY xProperty-' . $params['property'];
}

?>