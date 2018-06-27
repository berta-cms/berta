<?php
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
    $basePath = $berta::$options['MULTISITE'] . '/entry/' . $params['section'] . '/' .  $params['entry']['id'] . '/';

	if($berta->environment != 'engine') return '';

	$markedValue = !empty($params['entry']['marked']) ? 1 : 0;

	$fixedValue = !empty($params['entry']['fixed']) ? 1 : 0;
	$tags=isset($params['entry']['tags'])?implode(', ',$params['entry']['tags']):'';
	$customWidth=isset($params['entry']['width']) ? $params['entry']['width'] : '';

	$shopMenuEntry = null;
	if(isset($params['ishopentry']) && $params['ishopentry'] == 1) {

		$xUnits = $settings->get('shop', 'weightUnit');

		//build shop menu entry...
		$shopMenuEntry .= '	<div class="xEntrySeperator"></div>
							<div class="xEntryBoxParams"><b>Attribute</b>
								<div class="xEditable xProperty-cartAttributes xCaption-attribute cCartAttributes" data-path="' . $basePath . 'content/cartAttributes">'.$params['entry']['cartAttributes'].'</div>
								<div class="xEditable xProperty-weight xCaption-weight xUnits-'.$xUnits.'" data-path="' . $basePath . 'content/weight">'.$params['entry']['weight'].'</div>
							</div>';
	}

	return <<<DOC
		<a class="xCreateNewEntry xPanel xAction-entryCreateNew" href="#"><span>create new entry here</span></a>
		<div class="xEntryEditWrap">
			<div class="xEntryEditWrapButtons xPanel">

				<a href="#" class="xEntryMove xHandle" title="Drag + Shift to move all"><span>move entry</span></a>

				<div class="tagsList">
					<div title="$tags" class="xEditableRC xProperty-submenu xFormatModifier-toTags" data-path="{$basePath}tags/tag">$tags</div>
				</div>

				<div class="xEntryDropdown"></div>

			</div>
			<div class="xEntryDropdownBox">
				<ul>
					<li>
						<a href="#" class="xEntryToBack" title="send to back behind others"><span>Send to back</span></a>
					</li>
 					<li>
						<a><div class="xEntryCheck"><label><span class="xEditableRealCheck xProperty-fixed" data-path="{$basePath}content/fixed">$fixedValue</span>Fixed position</label></div></a>
					</li>
					<li>
						<div class="customWidth">
							<div title="$customWidth" class="xEditableRC xCSSUnits-1 xProperty-width" data-path="{$basePath}content/width">$customWidth</div>
						</div>
					</li>
					<li>
						<a><div class="xEntryCheck"><label><span class="xEditableRealCheck xProperty-marked" data-path="{$basePath}marked">$markedValue</span>Marked</label></div></a>
					</li>
					<li>
						<a href="#" class="xEntryDelete xAction-entryDelete" title="delete"><span>Delete</span></a>
					</li>
				</ul>
				{$shopMenuEntry}
			</div>
DOC;
}
?>
