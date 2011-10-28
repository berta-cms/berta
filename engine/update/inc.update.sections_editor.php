<?php

//$propSplit = explode('/', $decoded['property']);
//$property = $propSplit[1];
$property = $decoded['property'];



	
if($property == 'title') {	// section title
	$sectionsList = BertaEditor::getSections();
	$sName = $decoded['section'];
	$returnUpdate = $sNewTitle = $decoded['value'];
	$returnReal = $sNewName = strtolower(BertaUtils::canonizeString($sNewTitle, '-', '-'));
	
	
	$fName = $options['XML_ROOT'] . str_replace('%', $sName, $options['blog.%.xml']);
	$fNewName = $options['XML_ROOT'] . str_replace('%', $sNewName, $options['blog.%.xml']);
	//echo $fName, ' ', $fNewName;
	
	
	if(!file_exists($fName)) {
		$returnError = 'current section storage file does not exist! you\'ll have to delete this section!';
		$returnUpdate = !empty($sectionsList[$sName]['title']) ? $sectionsList[$sName]['title']['value'] : '';
		$returnReal = $sName;
	} 
	elseif(file_exists($fNewName)) {
		$returnError = 'section cannot be created! another section with the same (or too similar name) exists.';
		$returnUpdate = !empty($sectionsList[$sName]['title']) ? $sectionsList[$sName]['title']['value'] : '';
		$returnReal = $sName;
	} 
	else {
		if(!@rename($fName, $fNewName)) {
			$returnError = 'section storage file cannot be renamed! check permissions and be sure the name of the section is not TOO fancy.';
		} else {
			@chmod($fNewName, 0666);
			
			// update title...
			$sectionsListNew = array();
			foreach($sectionsList as $sN => $s) {
				if($sN == $sName) {
					$s['title']['value'] = $sNewTitle;
					$s['name']['value'] = $sNewName;
					$sectionsListNew[$sNewName] = $s;
				} else
					$sectionsListNew[$sN] = $s;
			}
			
			// save...
			BertaEditor::saveSections($sectionsListNew);
			
			// update subsections and tags caches...
			$newBlog = BertaEditor::loadBlog($sNewName);
			
			$ssArr = BertaEditor::getTags();
			if(isset($ssArr[$sName])) {
				$ssArr[$sNewName] = $ssArr[$sName];
				unset($ssArr[$sName]);
			}
			BertaEditor::saveTags($ssArr);
			BertaEditor::populateTags($sNewName, $newBlog);
		}
	}
	
			
}
else if($property == 'type') {	// section external link
	$sectionsList = BertaEditor::getSections();
	$returnUpdate = $returnReal = trim($decoded['value']);
	$sName = $decoded['section'];
	
	foreach($sectionsList as $sN => $s) {
		if($sN == $sName) {
			$sectionsList[$sN]['@attributes']['type'] = $returnUpdate;
			
			if(!empty($berta->template->sectionTypes)) {
				foreach($berta->template->sectionTypes as $sT => $sTParams) {
					if($returnUpdate == $sT) {
						if(!empty($sTParams['params'])) {
							foreach($sTParams['params'] as $pName => $p) {
								$value = !empty($s[$pName]['value']) ? $s[$pName]['value'] : '';
								if(!$value && $p['default']) $value = $p['default'];
								$returnParams .= BertaEditor::getSettingsItemEditHTML($pName, $p, $value, array('xSection' => $sN, 'xSectionField'));
							}
						}
						break;
					}
				}
			}
			break;
		}
	}
	BertaEditor::saveSections($sectionsList);
	
	
}
else if($property == 'published') {	// attributes
	$sectionsList = BertaEditor::getSections();
	$returnUpdate = $returnReal = trim($decoded['value']) == '1' ? '1' : '0';
	$sName = $decoded['section'];
	
	foreach($sectionsList as $sN => $s) {
		if($sN == $sName) {
			$sectionsList[$sN]['@attributes'][$property] = $returnUpdate;
			break;
		}
	}
	BertaEditor::saveSections($sectionsList);
}
else if($decoded['action'] == 'ORDER_SECTIONS') {	// apply the new order
	$oldSectionsList = BertaEditor::getSections();
	$newSectionsList = array();
	foreach($decoded['value'] as $s) $newSectionsList[$s] = $oldSectionsList[$s];
	BertaEditor::saveSections($newSectionsList);			
}
else if($decoded['action'] == 'CREATE_NEW_SECTION') {
	$sTitle = 'untitled' . uniqid();
	$sName = strtolower(BertaUtils::canonizeString($sTitle, '-', '-'));
	//echo " {$decoded['value']} $sName ";
	$emptyXML = '<?xml version="1.0" encoding="utf-8"?><blog></blog>';
	$fName = $options['XML_ROOT'] . str_replace('%', $sName, $options['blog.%.xml']);
	if(file_exists($fName)) {
		$returnError = 'section cannot be created! another section with the same (or too similar name) exists.';
	} else {
		if(!@file_put_contents($fName, $emptyXML)) {
			$returnError = 'section cannot be created! the storage file cannot be created. check permissions and be sure the name of the section is not TOO fancy.';
		} else {
			@chmod($fName, 0666);

			$possibleTypes = 'default|Default';
			$typeParams = array();
			if(!empty($berta->template->sectionTypes)) {
				$possibleTypes = array();
				foreach($berta->template->sectionTypes as $sT => $sTParams) {
					$possibleTypes[] = "$sT|{$sTParams['title']}";
					if(!empty($sTParams['params'])) $typeParams[$sT] = $sTParams['params'];
				}
				$possibleTypes = implode('||', $possibleTypes);
			}
			$type = 'Default';

			$returnUpdate = '';
			$returnUpdate .= '<div class="csHandle"><span class="handle"></span></div>';
			$returnUpdate .= '<div class="csTitle"><span class="' . $xEditSelectorSimple . ' xProperty-title xNoHTMLEntities xSection-' . $sName . '">' . BertaEditor::getXEmpty('sectionTitle') . '</span></div>';
			//$returnUpdate .= '<div class="csBehaviour"><span class="' . $xEditSelectorSelect . ' xProperty-sectionsEditor/behaviour xParam-' . $sName . '" x_options="normal||external link">normal</span></div>';
			$returnUpdate .= '<div class="csBehaviour"><span class="' . $xEditSelectorSelectRC . ' xProperty-type xSection-' . $sName . ' xSectionField" x_options="' . $possibleTypes . '">' . htmlspecialchars($type) . '</span></div>';

			//$returnUpdate .= '<div class="csBehaviour"><a href="#">reload page</a></div>';
			$returnUpdate .= '<div class="csDetails"></div>';
			//$returnUpdate .= '<div class="csLink"><span class="' . $xEditSelectorSimple . ' xProperty-sectionLink xParam-' . $sName . '" title="Link of the website where to lead the visitor when s/he navigates to this section">' . BertaEditor::getXEmpty('sectionLink') . '</span></div>';
			$returnUpdate .= '<div class="csPub"><span class="' . $xEditSelectorYesNo . ' xProperty-published xSection-' . $sName . '">1</span></div>';
			$returnUpdate .= '<div class="csDelete"><a href="#" class="xSectionDelete">delete</a></div>';
			$returnReal = $sName;

			$sectionsList = BertaEditor::getSections();
			$sectionsList[$sName] = array(
				'@attributes' => array('tags_behavior' => 'invisible', 'published'=>1),
				'name' => $sName, 
				'title' => array('value' => '')
			);
			BertaEditor::saveSections($sectionsList);
		}
	}
	
}
else if($decoded['action'] == 'DELETE_SECTION') {	// delete a section
	if(!BertaEditor::deleteSection($decoded['value']))
		$returnError = 'Section cannot be deleted! Check permissions.';
}
else {
	
	$returnUpdate = $returnReal = trim($decoded['value']);
	$sName = trim($decoded['section']);

	if(strtolower($sName) != 'title' && strtolower($sName) != 'name') {
		$sectionsList = BertaEditor::getSections();
		foreach($sectionsList as $sN => $s) {
			if($sN == $sName) {
				$sectionsList[$sN][$property] = array('value' => $returnUpdate);
				break;
			}
		}
		BertaEditor::saveSections($sectionsList);
	} else {
		$returnError = 'Template-specific properties cannot override system properties! Check template settings.';
	}
	
}







?>