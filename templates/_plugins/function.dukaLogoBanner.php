<?
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.dukaLogoBanner.php
 * Type:     function
 * Name:     dukaLogoBanner
 * Purpose:
 * -------------------------------------------------------------
 */
function smarty_function_dukaLogoBanner($params, &$smarty) {
	global $berta;

	$setting_pos_name = 'dukaLogoXY';
	$params = array('xy_name' => $setting_pos_name);
	$str = '<div class="floating-banner xEditableDragXY xProperty-'.$setting_pos_name.'" style="'.smarty_function_bannerPos($params, $smarty).'">
				<div class="xHandle"></div>
				<a href="http://www.duka.riga.lv/" target="_blank">
					<img src="'.BertaBase::$options['ENGINE_ROOT'].'layout/duka/duka_logo_'.$berta->settings->get('banners', 'banner_duka').'.png" />
				</a>
			</div>';

	return $str;
}
?>