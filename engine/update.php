<?


//sleep(0.2);
define('AUTH_AUTHREQUIRED', true);
define('SETTINGS_INSTALLREQUIRED', false);	// for the wizzard to be able to save settings
define('BERTA_ENVIRONMENT', 'engine');
include('inc.page.php');
include_once('_classes/Zend/Json.php');
include_once('_classes/class.array_xml.php');
include_once('_classes/class.bertaeditor.php');

$section = !empty($_REQUEST['section']) ? $_REQUEST['section'] : false;
$entry = !empty($_REQUEST['entry']) ? $_REQUEST['entry'] : false;
$property = !empty($_REQUEST['property']) ? $_REQUEST['property'] : false;
$value = !empty($_REQUEST['value']) ? $_REQUEST['value'] : false;

$jsonRequest = !empty($_REQUEST['json']) ? stripslashes($_REQUEST['json']) : false;

if($jsonRequest) {
	
	//var_dump($jsonRequest);
	// convert bad characters to their escaped equivalents
	$jsonRequest = str_replace(array("\n", "\r", "\t"), array('\n', '', ' '), $jsonRequest);
	//var_dump($jsonRequest);
	//echo str_replace(array("\n", "\r"), array('\n', ''), $jsonRequest) . "\n\n";
	
	// decode the json string into an array
	$decoded = $result = Zend_Json::decode($jsonRequest);
	if(empty($decoded['action'])) $decoded['action'] = 'SAVE';	// default action = save
	if(!isset($decoded['property'])) $decoded['property'] = '';
	
	
	$returnUpdate = $returnReal = $decoded['value'];
	$returnError = $returnEvalScript = false;
	$returnValues = array();
	$returnParams = '';
	
	// &nbsp; is put if editing an empty field (otherwise safari collapses it)
	if(is_string($decoded['value']) && trim($decoded['value']) == '&nbsp;') $returnUpdate = $returnReal = $decoded['value'] = '';
	
	// some preprocessing -------------------------------------------------------------------------------------------
	switch($decoded['property']) {
		case 'submenu':	// tags are to be formatted with a special divider in the updatable field
			$t = preg_replace("/,\s+/", ',', $decoded['value']);
			$returnUpdate = explode(',', $t);
			$returnReal = str_replace(',', ', ', $t);
			
			// eliminate items with identical canonical versions.
			$r = array();
			foreach($returnUpdate as $t) $r[strtolower(BertaUtils::canonizeString($t, '-', '-'))] = $t;
			$returnUpdate = array_values($r);
			
			// the "real" return value is done. the 
			$returnReal = implode(', ', $returnUpdate);
			break;
			
		case 'date':	// for date only the year should be displayed in the updatable field
			if(preg_match("/(\d{2})(?:\.|\/)(\d{2})(?:\.|\/)(\d{2,4})( (\d{2}):(\d{2})(:(\d{2})|)|)/", trim($decoded['value']), $regs)) {
				if(strlen($regs[3]) == 2) {
					$tY = date("Y") - 2000;
					if($regs[3] > $tY + 50)
						$regs[3] -= 100;
					$regs[3] += 2000;
				}
				$returnReal = $regs[1] . '.' . $regs[2] . '.' . $regs[3];
				if($regs[4])
					$returnReal .= " {$regs[5]}:{$regs[6]}:" . (!empty($regs[8]) ? $regs[8] : '00');
				else
					$returnReal .= " 00:00:00";
				
				$returnUpdate = $returnReal;

			} elseif(trim($decoded['value'])) {
				$returnUpdate = $decoded['before'];
				$returnReal = $decoded['before_real'];
				$returnError = 'invalid date format!';
			} else {
				$returnUpdate = $returnReal = '';

			}
			break;
		
		case 'url':	// url should be wrapped with an A tag
			if($returnReal) $href = strpos(strtolower($returnReal), '://') === false ? "http://$returnReal" : $returnReal;
			$returnUpdate = $returnReal ? ('<a href="' . $href . '" target="_blank">' . $returnReal . '</a>') : null;
			break;
		
	}
	
	switch($decoded['action']) {	
		case 'CREATE_NEW_ENTRY':
			include 'update/inc.update.createnewentry.php';
			break;
		case 'CHANGE_PASSWORD':
			include 'update/inc.update.changepassword.php';
			break;			
	}
	
	
	// update the blog or settings ---------------------------------------------------------------------------------
	if(!$returnError) {
		$allowFormatModifier = false;
		if(!empty($decoded['section'])) {	// the property is for for the blog


			if($decoded['entry']) {	// the property belongs to an entry								
				$blog = BertaEditor::loadBlog($decoded['section']);
				$e =& BertaEditor::getEntry($decoded['entry'], $blog);
				
				if($decoded['property'] == 'submenu') {	// entry tags need special attention as they are put into separate xml tags
					$e['tags'] = array('tag' => array());
					foreach($returnUpdate as $t) $e['tags']['tag'][] = array('value' => trim($t));
					$allowFormatModifier = true;	// tags always should be displayed with a modifier
				}
				elseif($decoded['property'] == 'date') {				// date is separate because it has some preprocessing
					$e[$decoded['property']] = trim($returnReal) ? array('value' => $returnReal) : NULL;
					$allowFormatModifier = true;
				}
				elseif($decoded['property'] == 'marked') {
					$e[$decoded['property']] = $returnReal ? '1' : '0';
				}
				elseif($decoded['property'] == 'entryMediaCache') {		// image cache for an entry gets updated
					$imgs = array(); $imgLinks = array();
					BertaEditor::updateImageCacheFor($blog);
				}
				elseif($decoded['property'] == 'galleryOrder') {		// update the order of images in the gallery
					Array_XML::makeListIfNotList($e['mediaCacheData']['file']);
					$returnUpdate = 'ok';
					
					$newImagesArray = array();
					foreach($decoded['value'] as $path) {
						$foundIndex = false;
						foreach($e['mediaCacheData']['file'] as $cacheIndex => $im) {
							if($im['@attributes']['src'] == $path) {
								$foundIndex = $cacheIndex;
								break;
							}
						}
						
						if($foundIndex !== false) {
							array_push($newImagesArray, $e['mediaCacheData']['file'][$cacheIndex]);
						}
					}
					
					$e['mediaCacheData']['file'] = $newImagesArray;
				}

				elseif($decoded['property'] == 'galleryImageCaption') {	// image / video caption
					$imageCache =& $e['mediaCacheData']['file'];
					Array_XML::makeListIfNotList($imageCache);
					foreach($imageCache as $cacheIndex => $im) {
						if($im['@attributes']['src'] == $decoded['params']) {
							$imageCache[$cacheIndex]['value'] = $decoded['value'];
							break;
						}
					}
					BertaEditor::updateImageCacheFor($blog, $decoded['entry']);
				}
				elseif($decoded['property'] == 'galleryImageDelete') {	// image gets deleted
					$imgToDelete = $posterToDelete = '';
					$returnUpdate = 'failed';
					Array_XML::makeListIfNotList($e['mediaCacheData']['file']);
					foreach($e['mediaCacheData']['file'] as $idx => $im)  {	// check if the passed image is really in mediaCache (a security measure)
						if((string) $idx == '@attributes') continue;
						//echo $im['value'], ' ', $decoded['value'],  " \n";
						if($im['@attributes']['src'] == $decoded['value']) {
							$imgToDelete = $im['@attributes']['src'];
							$posterToDelete = !empty($im['@attributes']['poster_frame']) ? $im['@attributes']['poster_frame'] : false;
							break;
						}
					}
					if($imgToDelete && file_exists($options['MEDIA_ROOT'] . $e['mediafolder']['value'] . '/' . $imgToDelete)) {
						if(@unlink($options['MEDIA_ROOT'] . $e['mediafolder']['value'] . '/' . $imgToDelete)) {
							BertaEditor::images_deleteDerivatives($options['MEDIA_ROOT'] . $e['mediafolder']['value'] . '/', $imgToDelete);
							
							if($posterToDelete) {
								@unlink($options['MEDIA_ROOT'] . $e['mediafolder']['value'] . '/' . $posterToDelete);
								BertaEditor::images_deleteDerivatives($options['MEDIA_ROOT'] . $e['mediafolder']['value'] . '/', $posterToDelete);
							}
							
							$returnUpdate = 'ok';
						} else
							$returnError = 'delete failed! check permissions.';
					} else
						$returnError = 'file does not exist! media cache updated.';
					BertaEditor::updateImageCacheFor($blog, $decoded['entry']);
				
				} 
				
				elseif($decoded['action'] != 'SAVE') {
					switch($decoded['action']) {
						case 'DELETE_ENTRY':
							if(!BertaEditor::deleteEntry($decoded['value'], $blog))
								$returnError = 'entry cannot be deleted! check permissions.';

							BertaEditor::updateImageCacheFor($blog);
							BertaEditor::updateSectionEntryCount($decoded['section'], $blog);
							BertaEditor::populateTags($decoded['section'], $blog);
							break;
						case 'SET_GALLERY_TYPE':
							if(empty($e['mediaCacheData']['@attributes'])) $e['mediaCacheData']['@attributes'] = array();
							$e['mediaCacheData']['@attributes']['type'] = $decoded['params'];
							break;
						case 'SET_GALLERY_SIZE':
							if(empty($e['mediaCacheData']['@attributes'])) $e['mediaCacheData']['@attributes'] = array();
							$e['mediaCacheData']['@attributes']['size'] = $decoded['params'];
							break;
						case 'SET_FULLSCREEN':
							if(empty($e['mediaCacheData']['@attributes'])) $e['mediaCacheData']['@attributes'] = array();
							$e['mediaCacheData']['@attributes']['fullscreen'] = $decoded['params'];
							break;
						case 'SET_AUTOPLAY':
							if(empty($e['mediaCacheData']['@attributes'])) $e['mediaCacheData']['@attributes'] = array();
							if(preg_match('/^\d+$/', $decoded['params'])) {
								if(preg_match('/^[0]+.[1-9]+/', $decoded['params'])) $decoded['params'] = preg_replace('/^[0]+/', '', $decoded['params']);
								$e['mediaCacheData']['@attributes']['autoplay'] = $decoded['params'];
							} else {
								$e['mediaCacheData']['@attributes']['autoplay'] = 0;
							}
							break;
						case 'SET_LINK_ADDRESS':
							if(empty($e['mediaCacheData']['@attributes'])) $e['mediaCacheData']['@attributes'] = array();
								if(!empty($decoded['params'])) {
									$e['mediaCacheData']['@attributes']['link_address'] = str_replace(' ', '', $decoded['params']);
								} else {
									$e['mediaCacheData']['@attributes']['link_address'] = 'http://';
									$returnUpdate = 'http://';
								}
							break;
						case 'PUT_BEFORE':
							$newEntriesList = array(); $entryPut = false; $hasEntries = false;
							if(!empty($blog['entry']['@attributes'])) $newEntriesList['@attributes'] = $blog['entry']['@attributes'];
							foreach($blog['entry'] as $key => $ie) {
								if($key === '@attributes') continue;
								$hasEntries = true;
								//echo $ie['id']['value'], ' - ', $decoded['value'], "\n";
								if($ie['id']['value'] == $decoded['value']) {
									$newEntriesList[] = $e;
									$entryPut = true;
								}
								
								if($ie['id']['value'] != $e['id']['value']) {
									$newEntriesList[] = $ie;
								}
							}
							if($hasEntries && !$entryPut) $newEntriesList[] = $e;
							$blog['entry'] = $newEntriesList;
						//	var_dump($blog['entry']);
					}
				}
				else {													// all other properties go straight forward into the xml
					if(empty($e['content'])) $e['content'] = array();
					$e['content'][$decoded['property']] = trim($returnReal) ? array('value' => $returnReal) : NULL;
					$allowFormatModifier = true;
				}
				
				$e['updated'] = array('value' => date('d.m.Y H:i:s'));
				BertaEditor::saveBlog($decoded['section'], $blog);
				if($decoded['property'] == 'submenu') 
					BertaEditor::populateTags($decoded['section'], $blog);
			
			} 
			else if($decoded['action'] == 'CREATE_NEW_ENTRY') {	// create new entry on the spot		
				$returnUpdate['entrynum'] = count($blog['entry']) + (isset($blog['@attributes']) ? -1 : 0);
			
			} 
			else if($decoded['action'] == 'ORDER_ENTRIES') {	// apply the new order				
				//print_r($blog['entry']);
				$blog = BertaEditor::loadBlog($decoded['section']);
				$newEntriesList = array();
				foreach($decoded['value'] as $oIdx => $oId) {
					$newEntriesList[$oIdx] = BertaEditor::getEntry($oId, $blog);
				}
				//print_r($blog['entry']);
				if(!empty($blog['entry']['@attributes'])) $newEntriesList['@attributes'] = $blog['entry']['@attributes'];
				//print_r($newEntriesList);
				$blog['entry'] = $newEntriesList;
				
				//BertaEditor::saveBlog($decoded['section'], $blog);
				//BertaEditor::populateTags($decoded['section'], $blog);
			
			} 
			else {	// section property															
				include 'update/inc.update.sections_editor.php';
				
			}
		}
		
		else if($decoded['action'] != 'SAVE') {	// parse global actions (which require no section)
			switch($decoded['action']) {
				case 'RECREATE_MEDIA_CACHE':
					$sections = BertaEditor::getSections();
					if(is_array($sections)) {
						foreach($sections as $sName => $sTitle) {
							$blog = BertaEditor::loadBlog($sName);
							if($blog) BertaEditor::updateImageCacheFor($blog);
						}
					} else {
						$returnError = 'there are no sections to update image cache for.';
					}
					break;
			}
		}
		
		else { // this appears to be a global "settings"/site property
				
			$settings = $berta->settings;
			
			if(strpos($decoded['property'], '/') !== false) {
				// in settings page all properties are with a slash
				$propPath = explode('/', $decoded['property']);
				$tName = false;
				
				if(count($propPath) == 3) {	// if there is a template component
					$tName = array_shift($propPath);
					if($berta->template->name == $tName)
						$settings = $berta->template->settings;
					else
						$returnError = "the currently selected template does not support this setting!\nplease reload the page and try again.";
				}
				
				if(!$returnError) {
					if($propPath[0] == 'siteTexts' || !empty($settings->settingsDefinition[$propPath[0]][$propPath[1]])) {
						$decoded['value'] = trim($decoded['value']);
						
						if($decoded['params'] == 'delete') {
							$decoded['value'] = '';
							$format = $settings->getDefinitionParam($propPath[0], $propPath[1], 'format');
							if($propPath[0] == 'siteTexts' && !$format) $format = 'image';
							if($format == 'image') {
								$oldF = $settings->get($propPath[0], $propPath[1]);
								@unlink($options['MEDIA_ROOT'] . $oldF);
								BertaEditor::images_deleteDerivatives($options['MEDIA_ROOT'], $oldF);
							}
						}
						
						if($decoded['value'] === '') 
							$decoded['value'] = $settings->getDefinitionParam($propPath[0], $propPath[1], 'allow_blank') ? 
												'' : $settings->getDefinitionParam($propPath[0], $propPath[1], 'default');
						
						if($settings->getDefinitionParam($propPath[0], $propPath[1], 'validator')) {
							BertaUtils::validate($decoded['value'], $returnError, $settings->getDefinitionParam($propPath[0], $propPath[1], 'validator'));
						}
						
						$settings->update($propPath[0], $propPath[1], $decoded['value']);
						$returnUpdate = $decoded['value'];
					} else {
						$returnError = "the setting is not properly defined in the configuration!\n";
						if($tName) $returnError .= 'check the configuration file for the tempalte "' . $tName . '".';
					}
				}
			} 
			elseif(!empty($decoded['property'])) {
				//echo $decoded['value'];
				//var_dump($settings->settings);
				
				$settings->update('siteTexts', $decoded['property'], /*'<![CDATA[' .*/ ($decoded['value']) /*. ']]>'*/);
				$returnUpdate = $decoded['value'];
				$allowFormatModifier = true;
			}
			
			//var_dump($settings->settings);
			
			if(!$settings->save()) {
				$returnError = "the setting could not be saved!\ncheck permissions for \"{$settings->fileName}\".";
			}
			
			
		
		}
	
	
	
		// format modifier
		if($allowFormatModifier) {
			if(!empty($decoded['format_modifier'])) {
				$berta->template->loadSmartyPlugin('modifier', $decoded['format_modifier']);
				$modName = 'smarty_modifier_' . $decoded['format_modifier'];
				if(function_exists($modName)) {
					$returnUpdate = @call_user_func($modName, $returnUpdate);
				}
			}
		}
	}
	
	// add "last updated" time
	$berta->settings->update('berta', 'lastUpdated', gmdate('D, d M Y H:i:s', time()) . ' GMT');
	$berta->settings->save();

	echo Zend_Json::encode($returnValues ?
						   $returnValues : 
						   array(
							'update' => $returnUpdate, 				// the returned value
							'updateText' => $returnUpdate, 			// the text for the returned value (used by, e.g., the RC SELECT)
							'real' => $returnReal, 					// the returned "real" value
							'eval_script' => $returnEvalScript, 
							'error_message' => $returnError,
							'params' => $returnParams
						   )
						);

} else {
	echo Zend_Json::encode(array('update' => false, 'real' => false, 'eval_script' => false, 'error_message' => 'NO DATA!'));

}


?>
