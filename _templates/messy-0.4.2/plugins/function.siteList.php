<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.siteList.php
 * Type:     function
 * Name:     siteList
 * Purpose:
 * -------------------------------------------------------------
 */
function smarty_function_siteList() {

	$content = file_get_contents('http://hosting.berta.me/site-list');
	$sites = json_decode($content);
	$list = array();
	$html = '<div class="xEntry">';

	foreach ($sites as $site) {
		$firstChar = substr($site->address, 0, 1);
		$list[$firstChar][] = $site->address;
	}

	foreach ($list as $letter=>$sites) {
		$html .= '<h2>'.$letter.'</h2>';
		foreach ($sites as $site) {
			$html .= '<a href="http://'.$site.'" target="_blank">'.$site.'</a> ';
		}
	}

	return $html . '</div>';
}

?>