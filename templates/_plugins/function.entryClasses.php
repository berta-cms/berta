<?
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.entryClasses.php
 * Type:     function
 * Name:     entryClasses
 * Purpose:  
 * -------------------------------------------------------------
 */
function smarty_function_entryClasses($params, &$smarty) {
	global $berta;
	$settings = $berta->template->settings;
	
	$classes = array('xEntry');
	
	if(!empty($params['entry'])) {
		$entry = $params['entry'];
		$classes[] = 'xEntryId-' . $entry['id'];
		
		if(!empty($entry['section']))
			$classes[] = 'xSection-' . $entry['section']['name']['value'];
	}
	
	return implode(' ', $classes);
}
?>