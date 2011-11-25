<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     modifier.defaultText.php
 * Type:     modifier
 * Name:     defaultText
 * Purpose:  shows text from xml or shows default text, if not defined
 * -------------------------------------------------------------
 */
function smarty_modifier_defaultText($text, $defaultText) {
	global $berta;
	
	if($text) { 
		return $text;
	}
	
	return $defaultText;
}
?>