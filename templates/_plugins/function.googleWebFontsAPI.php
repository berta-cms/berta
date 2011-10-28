<?
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.bertaAbsPosStyle.php
 * Type:     function
 * Name:     bertaAbsPosStyle
 * Purpose:  
 * -------------------------------------------------------------
 */
function smarty_function_googleWebFontsAPI() {
	global $berta;

	$s = $berta->template->settings;
	$fonts=array();
	$js_include='';
	
	$generalFontSettings = $s->get('generalFontSettings', 'googleFont');
	if (!empty($generalFontSettings)) {
		$fonts[]=urlencode($generalFontSettings);
	}
	
	$pageHeading = $s->get('pageHeading', 'googleFont');
	if (!empty($pageHeading)) {
		$fonts[]=urlencode($pageHeading);
	}	
		
	$menu = $s->get('menu', 'googleFont');
	if (!empty($menu)) {
		$fonts[]=urlencode($menu);
	}	
	
	$subMenu = $s->get('subMenu', 'googleFont');
	if (!empty($subMenu)) {
		$fonts[]=urlencode($subMenu);
	}	

	$entryHeading = $s->get('entryHeading', 'googleFont');
	if (!empty($entryHeading)) {
		$fonts[]=urlencode($entryHeading);
	}

	$entryFooter = $s->get('entryFooter', 'googleFont');
	if (!empty($entryFooter)) {
		$fonts[]=urlencode($entryFooter);
	}
	
	$sideBar = $s->get('sideBar', 'googleFont');
	if (!empty($sideBar)) {
		$fonts[]=urlencode($sideBar);
	}
	
	$tagsMenu = $s->get('tagsMenu', 'googleFont');
	if (!empty($sideBar)) {
		$fonts[]=urlencode($tagsMenu);
	}	
	
	$heading = $s->get('heading', 'googleFont');
	if (!empty($heading)) {
		$fonts[]=urlencode($heading);
	}		

	$heading = $berta->settings->get('shop', 'shopItemgoogleFont');
	if (!empty($heading)) {
		$fonts[]=urlencode($heading);
	}	

	$heading = $berta->settings->get('shop', 'priceItemgoogleFont');
	if (!empty($heading)) {
		$fonts[]=urlencode($heading);
	}	

	if ($fonts){
		$js_include="<link href='http://fonts.googleapis.com/css?family=".implode('|',$fonts)."' rel='stylesheet' type='text/css'>";
	}
	
	//print_R ($generalFontSettings);	
	
	return $js_include;
}

?>