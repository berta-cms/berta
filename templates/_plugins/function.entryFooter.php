<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.entryFooter.php
 * Type:     function
 * Name:     entryFooter
 * Purpose:  
 * -------------------------------------------------------------
 */
function smarty_function_entryFooter($params, &$smarty) {
	global $berta;
	$settings = $berta->template->settings;
	
	if($berta->environment != 'engine') return '';
	
	return '</div>';
}
?>