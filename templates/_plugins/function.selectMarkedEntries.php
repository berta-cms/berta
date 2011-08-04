<?
/*
 * Smarty plugin
 * -------------------------------------------------------------
 * File:     function.selectMarkedEntries.php
 * Type:     function
 * Name:     selectMarkedEntries
 * Purpose:  
 * -------------------------------------------------------------
 */
function smarty_function_selectMarkedEntries($params, &$smarty) {
	global $berta;
	$settings = $berta->template->settings;
	
	$count = !empty($params['count']) ? $params['count'] : 1000;
	$order = !empty($params['order']) ? $params['order'] : 'random';
	
	$return = array();

	foreach($berta->sections as $sName => $s) {
		if($sName != $berta->sectionName) {
			$entries = BertaContent::loadBlog($sName);
			if(!empty($entries['entry'])) {
				foreach($entries['entry'] as $idx => $e) {
					if($idx === '@attributes') continue;
				
					if(!empty($e['marked']['value'])) {
						$e['__section'] = $berta->sections[$sName];
						array_push($return, $e);
					}
				}
			}
		}
	}
	
	if($order == 'random') {
		shuffle($return);
	}
	
	if(count($return) > $count) {
		$return = array_slice($return, 0, $count);
	}
	
	$returnFinal = array();
	reset($return);
	while(list($i, $p) = each($return)) {
		if(!empty($p['id']) && !empty($p['id']['value']) 
				&& !empty($p['uniqid']) && !empty($p['uniqid']['value']) 
				&& !empty($p['mediafolder']) && !empty($p['mediafolder']['value'])) {
		
			$returnFinal[$p['uniqid']['value']] = BertaTemplate::entryForTemplate($p, array('section' => $p['__section']));
		}
	}
	
	
	if(!empty($params['assign'])) {
		$berta->template->addVariable($params['assign'], $returnFinal);
	} else {
		return $returnFinal;
	}
}
?>