<?
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.gridView.php
 * Type:     function
 * Name:     gridView
 * Purpose:  displays all section & entry images in a grid, used with masonry
 * -------------------------------------------------------------
 */
function smarty_function_gridView($params) {
	global $berta;
	
	if(!empty($params['section'])) {
		return BertaGallery::getHTMLForGridView($params['section']);
	}
	
	return '';
}
?>