<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.videoTutorials.php
 * Type:     function
 * Name:     pageHeader
 * Purpose:  
 * -------------------------------------------------------------
 */
function smarty_function_videoTutorials($params, &$smarty) {
	global $berta;
	
	return $berta->security->userLoggedIn ?
				BertaEditor::getBertaVideoLinks() :
				'';
}
?>