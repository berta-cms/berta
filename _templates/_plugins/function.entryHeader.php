<?php
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
	$markedValue = isset($params['entry']['marked']) && $params['entry']['marked'] ? 1 : 0;
	$tags=isset($params['entry']['tags'])?implode(', ',$params['entry']['tags']):'';
	$contentLayout=isset($params['entry']['layout']) ? $params['entry']['layout'] : 'gallery-top-description-bottom';
	$leftColWidth=isset($params['entry']['leftColWidth']) && intval($params['entry']['leftColWidth']) > 0 ? $params['entry']['leftColWidth'] : '';

	return <<<DOC
		<a class="xCreateNewEntry xPanel xAction-entryCreateNew" href="#"><span>create new entry here</span></a>

		<div class="xEntryEditWrap">
			<div class="xEntryEditWrapButtons xPanel">

				$moveButton

				<div class="tagsList">
					<div title="$tags" class="xEditableRC xProperty-submenu xFormatModifier-toTags">$tags</div>
				</div>

				<div class="xEntryDropdown"></div>

				<br class="clear" />
			</div>
			<div class="xEntryDropdownBox">
				<ul>
					<li>
						<a>
							<div class="value xEditableSelectRC xProperty-layout xNoHTMLEntities" title="" x_options="gallery-top-description-bottom||gallery-left-description-right||gallery-right-description-left">$contentLayout</div>
						</a>
					</li>
					<li>
						<div class="leftColWidth">
							<div title="leftColWidth" class="xEditable xUnits-% xProperty-leftColWidth">$leftColWidth</div>
						</div>
					</li>
					<li>
						<a><div class="xEntryCheck"><label><span class="xEditableRealCheck xProperty-marked">$markedValue</span>Marked</label></div></a>
					</li>
					<li>
						<a href="#" class="xEntryDelete xAction-entryDelete" title="delete"><span>Delete</span></a>
					</li>
				</ul>
			</div>
DOC;
}
?>