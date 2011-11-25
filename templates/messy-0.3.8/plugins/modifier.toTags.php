<?
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     modifier.toTags.php
 * Type:     modifier
 * Name:     toTags
 * Purpose:  converts tags array to tags list
 * -------------------------------------------------------------
 */
function smarty_modifier_toTags($tags) {
	global $berta;
	
	if($tags) { 
		// if tags is not an empty array, format it
		$separator = '&nbsp;/ ';
		return implode($separator, $tags);
	}
	
	return '';
}
?>