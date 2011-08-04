<?
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.additionalTextPos.php
 * Type:     function
 * Name:     additionalTextPos
 * Purpose:  
 * -------------------------------------------------------------
 */
function smarty_function_additionalTextPos($params, &$smarty) {
	global $berta;
	
	if(!empty($params['xy'])) {
		$pos = explode(',', $params['xy']);
		return "left:{$pos[0]}px;top:{$pos[1]}px;";
	}
	
	return '';
	
}

?>