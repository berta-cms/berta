<?
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.entryHeader.php
 * Type:     function
 * Name:     entryHeader
 * Purpose:  
 * -------------------------------------------------------------
 */
function smarty_function_entryHeader($params, &$smarty) {
	global $berta;
	$settings = $berta->template->settings;
	
	if($berta->environment != 'engine') return '';
	
	$moveButton = $berta->subSectionName ? 
		'<a href="#" class="xEntryMoveForbidden" title="entries can be sorted only when you are NOT in subsection!"><span>move entry</span></a>' : 
		'<a href="#" class="xEntryMove" title="drag to move"><span>move entry</span></a>';
	$subSections = '';
	/*if(!empty($params['entry'])) {
		if(!empty($params['entry']['subsections'])) {
			$subSections = '<span class="xEntrySubSections xEditable xProperty-subsections">'; 
			$subSections .= implode(', ', $params['entry']['subsections']);
			$subSections .= '</span>';
		} else {
			$subSections = '<span class="xEntrySubSections xEditable xProperty-subsections"></span>';
		}
	}*/
	$markedValue = !empty($params['entry']['marked']['value']) ? 1 : 0;
	
	return <<<DOC
		<a class="xCreateNewEntry xPanel xAction-entryCreateNew" href="#"><span>create new entry here</span></a>
	
		<div class="xEntryEditWrap">
			<div class="xEntryEditWrapButtons xPanel">
				$moveButton
				
				<a href="#" class="xEntryDelete xAction-entryDelete" title="delete"><span>delete entry</span></a>
				<div class="xEntryCheck"><label>marked <span class="xEditableRealCheck xProperty-marked">$markedValue</span></label></div>
				<br class="clear" />
			</div>
DOC;
}
?>