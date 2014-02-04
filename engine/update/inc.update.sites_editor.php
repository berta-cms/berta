<?php

if ($decoded['site'] == '0') {
	$decoded['site'] = 0;
}

$property = $decoded['property'];

if($property == 'name') {	// site name/slug
	$sitesList = BertaEditor::getSites();
	$sName = $decoded['site'];
	$returnReal = $sNewName = strtolower(BertaUtils::canonizeString($decoded['value'], '-', '-'));

	$fName = $options['XML_SITES_ROOT'] . $sName;
	$fNewName = $options['XML_SITES_ROOT'] . $sNewName;

	if(!file_exists($fName)) {
		$returnError = 'current site storage dir does not exist! you\'ll have to delete this site!';
		$returnUpdate = !empty($sitesList[$sName]['name']) ? $sitesList[$sName]['name']['value'] : '';
		$returnReal = $sName;
	}
	elseif(empty($sNewName)) {
		$returnError = 'site name cannot be empty!';
		$returnUpdate = !empty($sitesList[$sName]['name']) ? $sitesList[$sName]['name']['value'] : '';
		$returnReal = $sName;
	}
	elseif(file_exists($fNewName)) {
		$returnError = 'site cannot be created! another site with the same (or too similar name) exists.';
		$returnUpdate = !empty($sitesList[$sName]['name']) ? $sitesList[$sName]['name']['value'] : '';
		$returnReal = $sName;
	}
	else {
		if(!@rename($fName, $fNewName)) {
			$returnError = 'storage dir cannot be renamed! check permissions and be sure the name of the site is not TOO fancy.';
		} else {
			@chmod($fNewName, 0777);

			// update title...
			$sitesListNew = array();
			foreach($sitesList as $sN => $s) {
				if($sN === $sName) {
					$s['name']['value'] = $sNewName;
					$sitesListNew[$sNewName] = $s;
				} else
					$sitesListNew[$sN] = $s;
			}

			// save...
			BertaEditor::saveSites($sitesListNew);
		}
	}




}
else if($property == 'published') {	// attributes
	$sitesList = BertaEditor::getSites();
	$returnUpdate = $returnReal = trim($decoded['value']) == '1' ? '1' : '0';
	$sName = $decoded['site'];

	foreach($sitesList as $sN => $s) {
		if($sN === $sName) {
			$sitesList[$sN]['@attributes'][$property] = $returnUpdate;
			break;
		}
	}
	BertaEditor::saveSites($sitesList);



}
else if($decoded['action'] == 'ORDER_SITES') {	// apply the new order
	$oldSitesList = BertaEditor::getSites();
	$newSitesList = array();
	foreach($decoded['value'] as $s) $newSitesList[$s] = $oldSitesList[$s];
	BertaEditor::saveSites($newSitesList);



}
else if($decoded['action'] == 'CREATE_NEW_SITE') {

	if(!file_exists($options['XML_SITES_ROOT'])) {
		@mkdir($options['XML_SITES_ROOT'], 0777);
		@chmod($options['XML_SITES_ROOT'], 0777);
	}

	$sTitle = 'untitled' . uniqid();
	$sName = strtolower(BertaUtils::canonizeString($sTitle, '-', '-'));

	$dir = $options['XML_SITES_ROOT'] . $sName;

	@mkdir($dir, 0777);
	@chmod($dir, 0777);

	//clone contents
	$cloneFromSite = $decoded['site'];
	if ($cloneFromSite >= 0) {
		if ($cloneFromSite === 0){ //root site
			$src = $options['XML_MAIN_ROOT'];
		}else{
			$src = $options['XML_SITES_ROOT'] . $cloneFromSite;
		}
		BertaUtils::copyFolder($src, $dir);
	}
	//end clone contents

	$returnUpdate = '';
	$returnUpdate .= '<div class="csHandle"><span class="handle"></span></div>';
	$returnUpdate .= '<div class="csTitle"><span class="' . $xEditSelectorSimple . ' xProperty-title xNoHTMLEntities xSite-' . $sName . '">' . BertaEditor::getXEmpty('title') . '</span></div>';
	$returnUpdate .= '<div class="csName">'.$options['SITE_HOST_ADDRESS'].$options['SITE_ABS_ROOT'].'<span class="' . $xEditSelectorSimple . ' xProperty-name xNoHTMLEntities xSite-' . $sName . '">' . $sName . '</span></div>';
	$returnUpdate .= '<div class="csPub"><span class="' . $xEditSelectorYesNo . ' xProperty-published xSite-' . $sName . '">0</span></div>';
	$returnUpdate .= '<div class="csClone"><a href="#" class="xSiteClone">clone</a></div>';
	$returnUpdate .= '<div class="csDelete"><a href="#" class="xSiteDelete">delete</a></div>';
	$returnReal = $sName;

	$sitesList = BertaEditor::getSites();
	$sitesList[$sName] = array(
		'@attributes' => array('published'=>0),
		'name' => $sName,
		'title' => array('value' => '')
	);
	BertaEditor::saveSites($sitesList);



}
else if($decoded['action'] == 'DELETE_SITE') {	// delete a section
	if(!BertaEditor::deleteSite($decoded['value']))
		$returnError = 'Site cannot be deleted! Check permissions.';


}
else {

	$returnUpdate = $returnReal = trim($decoded['value']);
	$sName = $decoded['site'];

	if(strtolower($sName) != 'title') {
		$sitesList = BertaEditor::getSites();

		foreach($sitesList as $sN => $s) {
			if($sN === $sName) {
				$sitesList[$sN][$property] = array('value' => $returnUpdate);
				break;
			}
		}

		BertaEditor::saveSites($sitesList);
	} else {
		$returnError = 'Hacker or what?';
	}

}

?>