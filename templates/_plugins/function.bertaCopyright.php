<?
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
	$str = 'Built with <a href="http://www.berta.lv/" target="_blank" title="Create your own portfolio with Berta in minutes!">Berta</a>';
	if(!empty($_SERVER['SERVER_ADDR']) && in_array($_SERVER['SERVER_ADDR'], BertaBase::$options['hip_ipaddr'])) {
		$str .= ', hosted&nbsp;on&nbsp;<a href="http://hip-hosting.com/" target="_blank" title="Friendly web hosting">HIP</a>';
	}
	
	return $str;
}
?>