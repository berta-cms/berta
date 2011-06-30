<?
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.customEntryHeader.php
 * Type:     function
 * Name:     customEntryHeader
 * Purpose:  
 * -------------------------------------------------------------
 */
function smarty_function_customEntryHeader($params, &$smarty) {
	global $berta;
	$settings = $berta->template->settings;
	
	if($berta->environment != 'engine') return '';
	
	$markedValue = !empty($params['entry']['marked']['value']) ? 1 : 0;
	
	return <<<DOC
		<a class="xCreateNewEntry xPanel xAction-entryCreateNew" href="#"><span>create new entry here</span></a>
	
		<div class="xEntryEditWrap">
			<div class="xEntryEditWrapButtons xPanel">
				<div class="xEntryCheck"><label><span class="xEditableRealCheck xProperty-marked">$markedValue</span> marked</label></div>
				<a href="#" class="xEntryMove xHandle" title="drag to move around"><span>move entry</span></a>
				<a href="#" class="xEntryToBack" title="send to back behind others"><span>send to back</span></a>
				
				<a href="#" class="xEntryDelete xAction-entryDelete" title="delete"><span>delete entry</span></a>
				
			</div>
DOC;
}
?>