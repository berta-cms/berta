<?
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
	
	return 'mess xEditableDragXY xProperty-' . $params['property'];
}

?>