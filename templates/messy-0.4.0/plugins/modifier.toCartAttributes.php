<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     modifier.toCartAttributes.php
 * Type:     modifier
 * Name:     toCartAttributes
 * Purpose:  converts product attributes to dropdown
 * -------------------------------------------------------------
 */
function smarty_modifier_toCartAttributes($attr) {
	global $berta;
	
	if(strlen($attr)>0) {
		$attr = explode(',', $attr);
		$attrOutStr = '<select class="cart_attributes">';
		foreach($attr as $aout) {
			$attrOutStr .= '<option value="'.htmlspecialchars($aout).'">'.htmlspecialchars($aout).'</option>';
		}
		$attrOutStr .= '</select>';
		return $attrOutStr;
	}
	
	return '';
}
?>