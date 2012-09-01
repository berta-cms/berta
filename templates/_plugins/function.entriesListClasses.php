<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.entriesListClasses.php
 * Type:     function
 * Name:     entriesListClasses
 * Purpose:  
 * -------------------------------------------------------------
 */
function smarty_function_entriesListClasses($params, &$smarty) {
	global $berta;
	
	$classes = array('xEntriesList');
	$classes[] = 'xSection-' . $berta->sectionName;
	$classes[] = 'xTag-' . $berta->tagName;

	return implode(' ', $classes);
}
?>