<?
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.bertaAbsPosStyle.php
 * Type:     function
 * Name:     bertaAbsPosStyle
 * Purpose:  
 * -------------------------------------------------------------
 */
function smarty_function_bertaAbsPosStyle($params, &$smarty) {
	global $berta;
	
	$pos = !empty($params['xy']) ? explode(',', $params['xy']) : 
		array(
			0, 0
		);
	return "left:{$pos[0]}px;top:{$pos[1]}px;";
}

?>