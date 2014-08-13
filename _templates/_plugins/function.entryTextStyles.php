<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.messStyles.php
 * Type:     function
 * Name:     messStyles
 * Purpose:
 * -------------------------------------------------------------
 */
function smarty_function_entryTextStyles($entry) {

	$styles = array();
	$leftColWidth = isset($entry['entry']['leftColWidth']) && intval($entry['entry']['leftColWidth']) > 0 ? intval($entry['entry']['leftColWidth']) : false;
	$layout = isset($entry['entry']['layout']) ? $entry['entry']['layout'] : false;

	if ( $leftColWidth && $layout ) {
		if ($layout == 'gallery-right-description-left'){
			$styles[] = array(
				'property' => 'width',
				'value' => $leftColWidth . '%'
			);
		}elseif($layout == 'gallery-left-description-right'){
			$styles[] = array(
				'property' => 'width',
				'value' => (100 - $leftColWidth) . '%'
			);
		}
	}

	if (count($styles)) {
		$style_attr = ' style="';
		foreach ($styles as $style) {
			$style_attr .= $style['property'].':'.$style['value'].';';
		}
		return $style_attr . '"';
	}

}
?>