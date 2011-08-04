<?
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.bertaLink.php
 * Type:     function
 * Name:     bertaLink
 * Purpose:  
 * -------------------------------------------------------------
 */
function smarty_function_bertaLink($params, &$smarty) {
	global $berta, $SITE_ABS_ROOT;
	$settings = $berta->template->settings;
	$constructPrettyLink = $berta->apacheRewriteUsed && $berta->environment == 'site';
	$alwaysSelectTag = $berta->settings->get('navigation', 'alwaysSelectTag') == 'yes';
	
	if(!empty($params['section']) && empty($berta->sections[$params['section']]))
		$params['section'] = reset(array_keys($berta->sections));
	
	// return external link, if one specified
	if($berta->sections[$params['section']]['@attributes']['type'] == 'external_link' && !empty($berta->sections[$params['section']]['link'])) {
		return $berta->sections[$params['section']]['link']['value'];
	}
	
	$hasSSComponent = !empty($params['tag']) && !empty($berta->tags[$params['section']]);
	$sectionIsFirst = $params['section'] == reset(array_keys($berta->sections));
	$sectionHasDirectContent = !empty($berta->sections[$params['section']]['@attributes']['has_direct_content']);
	$subSectionIsFirst = $hasSSComponent ? ($alwaysSelectTag && $params['tag'] == reset(array_keys($berta->tags[$params['section']]))) : true;
	
	$link = array();
	if(!empty($params['section'])) {
		if(!$sectionIsFirst || $berta->environment == 'engine' 
			|| $sectionHasDirectContent && count($berta->tags[$params['section']]) > 0 
			|| !$subSectionIsFirst)
			$link[] = !$constructPrettyLink ? ('section=' . $params['section']) : $params['section'];
	}
	
	if($hasSSComponent) {
		if($berta->environment == 'engine' || $sectionHasDirectContent || !$subSectionIsFirst) {
			$link[] = !$constructPrettyLink ? ('tag=' . $params['tag']) : $params['tag'];
		}
	}
	//if(!empty($params['tag'])) $link[] = 'tag=' . $params['tag'];
	if($constructPrettyLink) {
		return $SITE_ABS_ROOT . implode('/', $link) . ($link ? '/' : '');
	} else {
		return '.' . ($link ? ('?' . implode('&', $link)) : '');
	}
}
?>