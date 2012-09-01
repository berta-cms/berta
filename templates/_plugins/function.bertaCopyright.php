<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.bertaCopyright.php
 * Type:     function
 * Name:     bertaCopyright
 * Purpose:  
 * -------------------------------------------------------------
 */
function smarty_function_bertaCopyright($params, &$smarty) {
	$str = I18n::_('berta_copyright_text');
	if(!empty($_SERVER['SERVER_ADDR']) && in_array($_SERVER['SERVER_ADDR'], BertaBase::$options['hip_ipaddr'])) {
		$str .= ', hosted&nbsp;on&nbsp;<a href="http://hip-hosting.com/" target="_blank" title="Friendly web hosting">HIP</a>';
	}
	
	return $str;
}
?>