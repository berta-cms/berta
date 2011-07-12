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
function smarty_function_bannerPos($params, &$smarty) {
	global $berta;
	
	if(!empty($params['xy_name'])) {
		$params['xy'] = $smarty->getTemplateVars($params['xy_name']);
	}
	
	$pos = !empty($params['xy']) ? explode(',', $params['xy']) : 
		array(
			rand($placeInFullScreen ? 0 : 900, 960), 
			rand($placeInFullScreen ? 0 : 30, $placeInFullScreen ? 600 : 200)
		);
	return "left:{$pos[0]}px;top:{$pos[1]}px;";
}

?>