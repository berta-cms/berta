<?php
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     modifier.toDate.php
 * Type:     modifier
 * Name:     toDate
 * Purpose:  converts date string to a format according to 
 *			 actual settings
 * -------------------------------------------------------------
 */
function smarty_modifier_toDate($date) {
	global $berta;
	$settings = $berta->template->settings;
	
	$dateStr = '';
	if($settings->get('entryLayout', 'dateFormat') != 'hidden') {
		if($date) { 
			// if date is not an empty string, format it according to settings
			$dateSeparator = $settings->get('entryLayout', 'dateSeparator1');
			$timeSeparator = $settings->get('entryLayout', 'dateSeparator2');
			switch($settings->get('entryLayout', 'dateFormat')) {
				case 'year': $eD = date("Y", strtotime($date)); break;
				case 'month and year': $eD = date("m{$dateSeparator}Y", strtotime($date)); break;
				case 'day, month and year': $eD = date("d{$dateSeparator}m{$dateSeparator}Y", strtotime($date)); break;
				default: $eD = date("d{$dateSeparator}m{$dateSeparator}Y H{$timeSeparator}i{$timeSeparator}s", strtotime($date)); break;
			}
			return $eD;
		}
	}
	
	return '';
}
?>