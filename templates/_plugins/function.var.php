<?
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.var.php
 * Type:     function
 * Name:     messStyles
 * Purpose:  
 * -------------------------------------------------------------
 */
function smarty_function_var($params, &$smarty) {
	if($params['var']) {
		return $smarty->getTemplateVars($params['var']);
	}
	
	return "";
}

?>