<?php



class BertaEditor extends BertaContent {
	
	public static function getSectionMediafolder($sName) {
		$mediaRoot = self::$options['MEDIA_ROOT'];
		$sectionMfName = $sName . '-background';
		
		if(file_exists($mediaRoot . $sectionMfName) && is_dir($mediaRoot . $sectionMfName)) {
			$MFTestNum = 1;
			do {
				$mFTest = $sectionMfName . $MFTestNum;
				$MFTestNum++;
			} while(file_exists($mediaRoot . $mFTest));
			
			$sectionMfName = $mFTest;
		}
		
		return $sectionMfName;
	}
	
	public static function saveSections($sections) {
		$sectionsToSave = array('section' => array());
		foreach($sections as $s) $sectionsToSave['section'][] = $s;
		
		Array_XML::addCDATA($sectionsToSave);
		if($xml = Array_XML::array2xml($sectionsToSave, 'sections')) {
			$fileName = self::$options['XML_ROOT'] . self::$options['sections.xml'];
			file_put_contents($fileName, $xml);
			@chmod($fileName, 0666);
			return true;
		}
	}
	
	public static function deleteSection($sectionName) {

		// delete all media
		$dirsDeleted = true;
		$blog = BertaEditor::loadBlog($sectionName);
		if(!empty($blog['entry'])) foreach($blog['entry'] as $e) {
			if(!empty($e['mediafolder']['value'])) {
				$mediaFolder = self::$options['MEDIA_ROOT'] . $e['mediafolder']['value'];
				if(file_exists($mediaFolder)) {
					$dir = opendir($mediaFolder);
					while($fItem = readdir($dir)) {
						if($fItem != '.' && $fItem != '..') {
							@unlink($mediaFolder . '/' . $fItem);
						}	
					}
					$dirsDeleted &= @rmdir($mediaFolder);
				}
			}
		}
		
		// delete content
		if($dirsDeleted) {
			$xmlPath = realpath(self::$options['XML_ROOT'] . str_replace('%', $sectionName, self::$options['blog.%.xml']));
			if(!$xmlPath || @unlink($xmlPath)) {
				$oldSectionsList = BertaEditor::getSections();
				// delete all section background media
				if(!empty($oldSectionsList[$sectionName]['mediafolder']['value'])) {
					$sectionMediaFolder = self::$options['MEDIA_ROOT'] . $oldSectionsList[$sectionName]['mediafolder']['value'];
					if(file_exists($sectionMediaFolder)) {
						$dir = opendir($sectionMediaFolder);
						while($fItem = readdir($dir)) {
							if($fItem != '.' && $fItem != '..') {
								@unlink($sectionMediaFolder . '/' . $fItem);
							}	
						}
						$dirsDeleted &= @rmdir($sectionMediaFolder);
					}
				}
				if(isset($oldSectionsList[$sectionName])) unset($oldSectionsList[$sectionName]);
				BertaEditor::saveSections($oldSectionsList);
				
				return true;
				
			} else
				return false;
		} else
			return false;
	}
	
	
	
	
	public static function saveBlog($sName, &$blog) {
		
		

		
		if(empty($blog['@attributes'])) $blog['@attributes'] = array();
		if(empty($blog['@attributes']['section'])) $blog['@attributes']['section'] = $sName;
		
		$blog['@attributes']['last_upd_ver'] = self::$options['int_version'];
		
		$blogCopy = array_copy($blog);
		Array_XML::addCDATA($blogCopy);
		
		if($xml = Array_XML::array2xml($blogCopy, 'blog')) {
			$fileName = self::$options['XML_ROOT'] . str_replace('%', $sName, self::$options['blog.%.xml']);
			file_put_contents($fileName, $xml);
			@chmod($fileName, 0666);
			return true;
		}
	}
	
	
	
	
	
	
	
	public static function deleteEntry($entryId, &$blog) {
		$entryNum = false;
		for($i = 0; $i < count($blog['entry']); $i++)
			if(!empty($blog['entry'][$i]) && $blog['entry'][$i]['id']['value'] == $entryId) {
				$entryNum = $i;
				break;
			}
		
		if($entryNum !== false) {
			$entry = $blog['entry'][$entryNum];
			
			// delete all media
			$dirDeleted = true;
			if(file_exists(self::$options['MEDIA_ROOT'] . $entry['mediafolder']['value'])) {
				$dir = opendir(self::$options['MEDIA_ROOT'] . $entry['mediafolder']['value']);
				while($fItem = readdir($dir)) {
					if($fItem != '.' && $fItem != '..') {
						@unlink(self::$options['MEDIA_ROOT'] . $entry['mediafolder']['value'] . '/' . $fItem);
					}	
				}
				
				$dirDeleted = @rmdir(self::$options['MEDIA_ROOT'] . $entry['mediafolder']['value']);
			}
			
			// delete media folder
			if($dirDeleted) {
				
				// delete entry
				array_splice($blog['entry'], $entryNum, 1);
				if(count($blog['entry']) < 1 || (!empty($blog['entry']['@attributes']) && count($blog['entry']) == 1)) {
					unset($blog['entry']);
				} 
				return true;
			
			} else {
				return false;
			}
		}			
	}
	
	
	

	public static function saveTags($tags, $sectionsList = false) {
		$arrayToSave = array('section' => array());
		foreach($tags as $sName => $s) {
			if(!$sectionsList || isset($sectionsList[$sName])) {
				$sectionTags = array();
				$c = 0;
				foreach($s as $tName => $t) {
					$sectionTags[] = array('@attributes' => array('name' => $tName, 'entry_count' => $t['entry_count']), 'value' => $t['title']);
					$c += (int) $t['entry_count'];
				}
				$arrayToSave['section'][] = array('@attributes' => array('name' => $sName, 'entry_count' => $c), 'tag' => $sectionTags);
			}
		}
		Array_XML::addCDATA($arrayToSave);
		
		if($xml = Array_XML::array2xml($arrayToSave, 'sections')) {
			$fileName = self::$options['XML_ROOT'] . self::$options['tags.xml'];
			if(@file_put_contents($fileName, $xml)) {
				@chmod($fileName, 0666);
				return true;
			}
		}
		
		return false;
	}
	public static function populateTags($sectionName, &$blog) {
		$tagsArr = BertaEditor::getTags();
		$newCache = array();
		$allHaveTags = true;
		if(!empty($blog['entry'])) {
			foreach($blog['entry'] as $eId => $e) {
				if($eId === '@attributes') continue;
				//echo '<p>'; print_r($e['subsections']);
				$hasTags = false;
				if(isset($e['tags'])) {
					
					Array_XML::makeListIfNotList($e['tags']['tag']);
					foreach($e['tags']['tag'] as $t) {
						
						if($tName = trim((string) $t['value'])) {
							$tName = strtolower(BertaUtils::canonizeString($tName, '-', '-'));
							
							$c = isset($newCache[$tName]) ? $newCache[$tName]['entry_count'] : 0;
							$newCache[$tName] = array('title' => $t['value'], 'entry_count' => ++$c);
							
							$hasTags = true;
						}
					}
				}
				
				$allHaveTags &= $hasTags;
			}
		}
		$tagsArr[$sectionName] = $newCache;
		
		// update direct content property
		$sectionsList = BertaEditor::getSections();
		if(!empty($sectionsList[$sectionName])) {
			if(empty($sectionsList[$sectionName]['@attributes'])) $sectionsList[$sectionName]['@attributes'] = array();
			$sectionsList[$sectionName]['@attributes']['has_direct_content'] = !$allHaveTags ? '1' : '0';
		}
		BertaEditor::saveSections($sectionsList);
		
		// save subsections list
		BertaEditor::saveTags($tagsArr, $sectionsList);
		
		return $tagsArr;
	}
	
	
	public static function updateSectionEntryCount($sectionName, &$blog) {
		$numEntries = !empty($blog['entry']) ? count($blog['entry']) : 0;
		
		$sectionsList = BertaEditor::getSections();
		if(!empty($sectionsList[$sectionName])) {
			if(empty($sectionsList[$sectionName]['@attributes'])) $sectionsList[$sectionName]['@attributes'] = array();
			$sectionsList[$sectionName]['@attributes']['entry_count'] = $numEntries;
		}
		BertaEditor::saveSections($sectionsList);
	}
	
	public static function setUpdateTimesForAll(&$blog) {
		if(!empty($blog['entry'])) {
			foreach($blog['entry'] as $eId => $e) {
				if($eId === '@attributes') continue;
				$blog['entry'][$eId]['updated'] = array('value' => date('d.m.Y H:i:s'));
			}
		}
	}
	
	
	
	public static function updateImageCacheForSection(&$section) {
		if(!empty($section)) {

			$mediaFiles = array();
			if(!empty($section['mediafolder']['value']))
			    $mediaFiles = BertaEditor::gatherMediaFilesIn($section['mediafolder']['value']);
			    
			//var_dump($mediaFiles);

			if($mediaFiles) {

			    $sectionCache =& $section['mediaCacheData'];

			    if(!count($sectionCache) || empty($sectionCache['file'])) {
			    	// if the media cache is empty, create a fresh array
                    $mediaCacheData=array('file' => array());
                    if (isset($section['mediaCacheData'])){
                          $mediaCacheData=array_merge($section['mediaCacheData'], $mediaCacheData);
                    }
                    $section['mediaCacheData']=$mediaCacheData;

			    	$sectionCache =& $section['mediaCacheData'];
			    	foreach($mediaFiles as $im) {
			    		$attr = array('type' => $im['type'], 'src' => $im['src']);
			    		if(!empty($im['poster_frame'])) $attr['poster_frame'] = $im['poster_frame'];
			    		if(!empty($im['width'])) $attr['width'] = $im['width'];
			    		if(!empty($im['height'])) $attr['height'] = $im['height'];
			    		$sectionCache['file'][] = array('value' => '', '@attributes' => $attr);
			    	}
			    	
			    	// if moving from an older version of XML
			    	unset($sectionCache['images']);
			    	unset($sectionCache['videos']);

			    	//echo "\n\n-----\n\n"; var_dump($entryCache);
			    } else {
			    	Array_XML::makeListIfNotList($sectionCache['file']);

			    	//echo "\n\n-----\n\n"; var_dump($entryCache);

			    	// first check if all items in cache are still inside the folder
			    	foreach($sectionCache['file'] as $cacheIndex => $cacheIm) {
			    		
			    		// try to find the entry among the files in the folder
			    		$foundIndex = false;
			    		foreach($mediaFiles as $i => $im) {
			    			
			    			// *** compatibility with versions <= 0.5.5b
			    			$isFromOldVersion = empty($cacheIm['@attributes']['src']);
			    			$srcFromCache = $isFromOldVersion ? $cacheIm['value'] : $cacheIm['@attributes']['src'];
			    			
			    			// if image found in cache, update cache entry
			    			if($srcFromCache == $im['src']) {
			    				$foundIndex = true;
			    				$_section = array('@attributes' => array());
			    				if(!$isFromOldVersion) $_section['value'] = !empty($cacheIm['value']) ? $cacheIm['value'] : '';
			    				if(!empty($cacheIm['@attributes'])) $_section['@attributes'] = $cacheIm['@attributes'];
			    				$_section['@attributes']['src'] = $im['src'];
			    				
			    				$_section['@attributes']['type'] = $im['type'];
			    				if(!empty($im['poster_frame'])) $_section['@attributes']['poster_frame'] = $im['poster_frame'];
			    				if(!empty($im['width'])) $_section['@attributes']['width'] = $im['width'];
			    				if(!empty($im['height'])) $_section['@attributes']['height'] = $im['height'];
			    				
			    				$sectionCache['file'][$cacheIndex] = $_section;
			    				
			    				unset($mediaFiles[$i]);
			    				break;
			    			}
			    		}
			    		
			    		// if the file was not found in the folder, delete the entry
			    		if(!$foundIndex) unset($sectionCache['file'][$cacheIndex]);
			    	}

			    	// loop through the rest of real files and add them to cache
			    	foreach($mediaFiles as $im) {
			    		$attr = array('type' => $im['type'], 'src' => $im['src']);
			    		if(!empty($im['poster_frame'])) $attr['poster_frame'] = $im['poster_frame'];
			    		if(!empty($im['width'])) $attr['width'] = $im['width'];
			    		if(!empty($im['height'])) $attr['height'] = $im['height'];
			    		$sectionCache['file'][] = array('value' => '', '@attributes' => $attr);
			    	}

			    	//echo "\n\n-----\n\n"; var_dump($entryCache);

			    	// compact arrays
			    	$sectionCache['file'] = array_values($sectionCache['file']);
			    	
			    	// if moving from an older version of XML
			    	unset($sectionCache['images']);
			    	unset($sectionCache['videos']);

			    	//echo "\n\n-----\n\n"; var_dump($entryCache);
			    }

			} else {
                $mediaCacheData=array('file' => array());
                
                if (isset($section['mediaCacheData'])) {
                    $mediaCacheData=array_merge($section['mediaCacheData'], $mediaCacheData);
                } 
                
                $section['mediaCacheData']=$mediaCacheData;

			}

		}
	}
	
	
	
	public static function updateImageCacheFor(&$blog, $entryId = false) {
		if(!empty($blog['entry'])) {
			foreach($blog['entry'] as $eId => $e) {
				if((string) $eId == '@attributes') continue;
				if(!$entryId || (!empty($e['id']['value']) && $entryId == $e['id']['value'])) {

					$mediaFiles = array();
					if(!empty($e['mediafolder']['value']))
						$mediaFiles = BertaEditor::gatherMediaFilesIn($e['mediafolder']['value']);
						
					//var_dump($mediaFiles);

					if($mediaFiles) {

						$entryCache =& $blog['entry'][$eId]['mediaCacheData'];

						if(!count($entryCache) || empty($entryCache['file'])) {
							// if the media cache is empty, create a fresh array
                            $mediaCacheData=array('file' => array());
                            if (isset($blog['entry'][$eId]['mediaCacheData'])){
                                  $mediaCacheData=array_merge($blog['entry'][$eId]['mediaCacheData'], $mediaCacheData);
                            }
                            $blog['entry'][$eId]['mediaCacheData']=$mediaCacheData;

							$entryCache =& $blog['entry'][$eId]['mediaCacheData'];
							foreach($mediaFiles as $im) {
								$attr = array('type' => $im['type'], 'src' => $im['src']);
								if(!empty($im['poster_frame'])) $attr['poster_frame'] = $im['poster_frame'];
								if(!empty($im['width'])) $attr['width'] = $im['width'];
								if(!empty($im['height'])) $attr['height'] = $im['height'];
								$entryCache['file'][] = array('value' => '', '@attributes' => $attr);
							}
							
							// if moving from an older version of XML
							unset($entryCache['images']);
							unset($entryCache['videos']);

							//echo "\n\n-----\n\n"; var_dump($entryCache);

						} else {

							Array_XML::makeListIfNotList($entryCache['file']);

							//echo "\n\n-----\n\n"; var_dump($entryCache);

							// first check if all items in cache are still inside the folder
							foreach($entryCache['file'] as $cacheIndex => $cacheIm) {
								
								// try to find the entry among the files in the folder
								$foundIndex = false;
								foreach($mediaFiles as $i => $im) {
									
									// *** compatibility with versions <= 0.5.5b
									$isFromOldVersion = empty($cacheIm['@attributes']['src']);
									$srcFromCache = $isFromOldVersion ? $cacheIm['value'] : $cacheIm['@attributes']['src'];
									
									// if image found in cache, update cache entry
									if($srcFromCache == $im['src']) {
										$foundIndex = true;
										$entry = array('@attributes' => array());
										if(!$isFromOldVersion) $entry['value'] = !empty($cacheIm['value']) ? $cacheIm['value'] : '';
										if(!empty($cacheIm['@attributes'])) $entry['@attributes'] = $cacheIm['@attributes'];
										$entry['@attributes']['src'] = $im['src'];
										
										$entry['@attributes']['type'] = $im['type'];
										if(!empty($im['poster_frame'])) $entry['@attributes']['poster_frame'] = $im['poster_frame'];
										if(!empty($im['width'])) $entry['@attributes']['width'] = $im['width'];
										if(!empty($im['height'])) $entry['@attributes']['height'] = $im['height'];
										
										$entryCache['file'][$cacheIndex] = $entry;
										
										unset($mediaFiles[$i]);
										break;
									}
								}
								
								// if the file was not found in the folder, delete the entry
								if(!$foundIndex) unset($entryCache['file'][$cacheIndex]);
							}

							// loop through the rest of real files and add them to cache
							foreach($mediaFiles as $im) {
								$attr = array('type' => $im['type'], 'src' => $im['src']);
								if(!empty($im['poster_frame'])) $attr['poster_frame'] = $im['poster_frame'];
								if(!empty($im['width'])) $attr['width'] = $im['width'];
								if(!empty($im['height'])) $attr['height'] = $im['height'];
								$entryCache['file'][] = array('value' => '', '@attributes' => $attr);
							}

							//echo "\n\n-----\n\n"; var_dump($entryCache);

							// compact arrays
							$entryCache['file'] = array_values($entryCache['file']);
							
							// if moving from an older version of XML
							unset($entryCache['images']);
							unset($entryCache['videos']);

							//echo "\n\n-----\n\n"; var_dump($entryCache);

						}

					} else {

                        $mediaCacheData=array('file' => array());
                        if (isset($blog['entry'][$eId]['mediaCacheData'])){
                            $mediaCacheData=array_merge($blog['entry'][$eId]['mediaCacheData'], $mediaCacheData);
                        }
                        $blog['entry'][$eId]['mediaCacheData']=$mediaCacheData;

					}
				}
			}

		}
	}
	
	public static function gatherMediaFilesIn($folderName) {

		$imageExtensions = array('jpg', 'jpeg', 'jpe', 'gif', 'giff', 'png');
		$videoExtensions = array('mov', 'flv', 'f4v', 'avi', 'mpg', 'mpeg', 'mpe', 'mp4');
		$flashExtensions = array('swf');

		$mediaArr = array();
		$mediaIdx = 0;
		$mediaFolder = self::$options['MEDIA_ROOT'] . $folderName . '/';
		
		if(file_exists($mediaFolder)) {
			$d = dir($mediaFolder);
			$images = array();
			$imageNames = array();
			$imageInfos = array();
			$videos = array();
			$swfs = array();
			$swfInfos = array();
			
			while(false !== ($f = $d->read())) {
				if($f != '.' && $f != '..' && substr($f, 0, 1) != '_') {
					$ext = strtolower(substr(strrchr($f, '.'), 1));
					if(in_array($ext, $imageExtensions)) {
						$images[] = $f;
						$imageNames[] = substr($f, 0, strrpos($f, '.'));
						$imageInfos[] = getimagesize($mediaFolder . $f);
					} elseif(in_array($ext, $videoExtensions)) {
						$videos[] = $f;
					} elseif(in_array($ext, $flashExtensions)) {
						$swfs[] = $f;
						$swfInfos[] = getimagesize($mediaFolder . $f);
					}
				}
			}

			
			foreach($videos as $f) {
				$mediaArr[$mediaIdx] = array('type' => 'video', 'src' => $f);
				
				$fName = substr($f, 0, strrpos($f, '.'));
				$imageIndex = array_search($fName, $imageNames);
				if($imageIndex !== false) {
					$mediaArr[$mediaIdx]['poster_frame'] = $images[$imageIndex];
					$mediaArr[$mediaIdx]['width'] = $imageInfos[$imageIndex][0];
					$mediaArr[$mediaIdx]['height'] = $imageInfos[$imageIndex][1];
					array_splice($imageNames, $imageIndex, 1);
					array_splice($images, $imageIndex, 1);
					array_splice($imageInfos, $imageIndex, 1);
				} 
				
				$mediaIdx++;
			}

			
			foreach($swfs as $idx => $f) {
				$mediaArr[$mediaIdx] = array('type' => 'flash', 'src' => $f, 'width' => $swfInfos[$idx][0], 'height' => $swfInfos[$idx][1]);
				$mediaIdx++;
			}
			
			foreach($images as $idx => $f) {
				$mediaArr[$mediaIdx] = array('type' => 'image', 'src' => $f, 'width' => $imageInfos[$idx][0], 'height' => $imageInfos[$idx][1]);
				$mediaIdx++;
			}
			
			if(!function_exists('mediaArrCmp')) {
				function mediaArrCmp($m1, $m2) {
					if ($m1['src'] == $m2['src']) {
				        return 0;
				    }
				    return ($m1['src'] < $m2['src']) ? -1 : 1;
				}
			}
			usort($mediaArr, 'mediaArrCmp');
		}
		
		return $mediaArr;
	}
	
	
	
	
	public static function images_getSmallThumbFor($imagePath) {
		$fileName = basename($imagePath);
		$dirName = dirname($imagePath);
		if($dirName) $dirName .= '/';
	
		$thumbPath = $dirName . self::$options['images']['small_thumb_prefix'] . $fileName;
		
		if(file_exists($thumbPath)) {
			return $thumbPath;
		} elseif(BertaGallery::createThumbnail($imagePath, $thumbPath, self::$options['images']['small_thumb_width'], self::$options['images']['small_thumb_height'])) {
			return $thumbPath;
		}
		
		return false;
	}
	
	public static function images_getBgImageFor($imagePath) {
		$fileName = basename($imagePath);
		$dirName = dirname($imagePath);
		if($dirName) $dirName .= '/';
	
		$bgImagePath = $dirName . self::$options['images']['bg_image_prefix'] . $fileName;
		
		list($width, $height) = getimagesize($imagePath);
		
		if(file_exists($bgImagePath)) {
			return $bgImagePath;
		} elseif(BertaGallery::createThumbnail($imagePath, $bgImagePath, $width, $height)) {
			return $bgImagePath;
		}
		
		return false;
	}
	
	/*public static function images_resampleIfNeeded($imagePath, $constraints, $widthOrig = null, $heightOrig = null) {
		if(is_null($widthOrig) || is_null($heightOrig)) {
			$imInfo = getimagesize($imagePath);
			list($widthOrig, $heightOrig) = $imInfo;
		}
 		
		$needsToBeResampled = !((!$constraints['max_width'] || $widthOrig <= $constraints['max_width']) &&
		  					  (!$constraints['max_height'] || $heightOrig <= $constraints['max_height']));
		if($needsToBeResampled) {
			// Get new dimensions
			$ratioOrig = $widthOrig/$heightOrig;

			$width = $constraints['max_width'] ? $constraints['max_width'] : $widthOrig;
			$height = $constraints['max_height'] ? $constraints['max_height'] : $heightOrig;
			if ($width/$height > $ratioOrig) {
			   $width = round($height*$ratioOrig);
			} else {
			   $height = round($width/$ratioOrig);
			}

			// check if needs resizing...
			if((!$constraints['min_width'] || $width >= $constraints['min_width']) &&
			   (!$constraints['min_height'] || $height >= $constraints['min_height'])) {
				
				$needsToBeResampled = !BertaUtils::smart_resize_image($imagePath, $width, $height);
				if(file_exists($imagePath)) chmod($imagePath, 0666);
			}
		}
		
		return !$needsToBeResampled;
	}*/
	
	public static function images_deleteDerivatives($folder, $file = '') {
		if($handle = opendir($folder)) {
		    /* This is the correct way to loop over the directory. */
		    
			while (false !== ($f = readdir($handle))) {
				if(!$file || strpos($f, $file) !== false) {
					//foreach($prefixes as $p) {
						if(substr($f, 0, 1) == '_') {
							@unlink($folder . $f);
						}
					//}
				}
		    }

		    closedir($handle);
		}
	}
	
	
	
	
	
	public static function getXEmpty($property) {
		return parent::getXEmpty($property);
	}
	
	public static function getBertaVideoLinks() {
		if(!empty(self::$options['remote_update_uri']) && ini_get('allow_url_fopen')) {
			$remoteResult = false;
			reset(self::$options['remote_update_uri']);
			while((!$remoteResult || empty($remoteResult['content'])) && (list(, $remoteURL) = each(self::$options['remote_update_uri']))) {
				$remoteResult = BertaUtils::getRemoteFile($remoteURL, 'videos', 5);
			}
			
			global $berta;
			$showVideos = isset($berta->settings->settings['settings']['showTutorialVideos']) ? $berta->settings->settings['settings']['showTutorialVideos'] : $berta->settings->settingsDefinition['settings']['showTutorialVideos']['default'];
	
			// $checked = isset($_COOKIE['_berta_viedeos_hidden']) ? '' : 'checked="checked"';
			$checked = $showVideos == 'yes' ? 'checked="checked"' : '';
			
			$toggleFrame_msg = I18n::_('Show this window on startup');
			$closeFrame_msg = I18n::_('Close');
			
			if($remoteResult || isset($remoteResult['content'])) {
			
				$videosList = $remoteResult['content'];
			
				$links = '';
				foreach ($videosList['video'] as $k => $v) {
					$links .= '<a class="switchVideo' . (($k+1)%3 == 0 ? ' row-last' : '') . ($k == 0 ? ' selected' : '') . '" href="' . $v['uri'] . '">' . $v['name'] . '</a>';
				}
				$firstLink = $videosList['video'][0]['uri'];
					// <img id="videoLoader" src="layout/loader.gif" alt="Loading..." />	
				$str = <<<DOC
					<div id="bertaVideosBackground"></div>
					<div id="bertaVideosWrapper">
						<div id="bertaVideos">
							<div id="videoFrameWrapper">
								
								<iframe id="videoFrame" src="$firstLink?api=1" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
							</div>
							<div id="videoLinks">
								<div class="title"><span>More videos</span></div>
								<div class="links">
									$links
									<br class="clear" />
								</div>
							</div>
							<div id="frameSettings">
								<div class="togglePopupWrapper">
									<input type="checkbox" class="togglePopup xProperty-settings/showTutorialVideos" id="togglePopup" $checked  />
									<label for="togglePopup">$toggleFrame_msg</label>
								</div>
								<div class="closeFrameWrapper">
									<a class="closeFrame" href="#">$closeFrame_msg</a>
								</div>
							</div>
						</div>
					</div>
DOC;

			} else {
			
				$error_msg = I18n::_('To enable Berta\'s tutorial videos, your computer needs to be connected to the internet!<br />When the internet access is enabled, sign out of engine panel and log in again to view the videos.');
			
				$str = <<<DOC
					<div id="bertaVideosBackground"></div>
					<div id="bertaVideosWrapper">
						<div id="bertaVideos">
							<div id="videosError">
								$error_msg
							</div>
							<div id="frameSettings">
								<div class="togglePopupWrapper">
									<input type="checkbox" class="togglePopup xProperty-settings/showTutorialVideos" id="togglePopup" $checked  />
									<label for="togglePopup">$toggleFrame_msg</label>
								</div>
								<div class="closeFrameWrapper">
									<a class="closeFrame" href="#">$closeFrame_msg</a>
								</div>
							</div>
						</div>
					</div>			
DOC;

			}
			
 			return $str;
		}
	}
	
	public static function getTopPanelHTML($selectedSection = 'site') {
		// $tickerClass = !empty($_COOKIE['_berta_newsticker_hidden']) ? 'xHidden' : '';

		$newsTickerContent = false;
		
	//	$_SESSION['_berta_newsticker'] = false;				// for testing...
		//$_SESSION['_berta_newsticker_numtries'] = 0;		// for testing...
		
		
		if(!empty(self::$options['remote_update_uri'])) {
			if(!empty($_SESSION['_berta_newsticker'])) {
				$newsTickerContent = $_SESSION['_berta_newsticker'];
			} elseif((empty($_SESSION['_berta_newsticker_numtries']) || $_SESSION['_berta_newsticker_numtries'] < 5) && ini_get('allow_url_fopen')) {
				$remoteResult = false;
				reset(self::$options['remote_update_uri']);
				while((!$remoteResult || empty($remoteResult['content'])) && (list(, $remoteURL) = each(self::$options['remote_update_uri']))) {
					$remoteResult = BertaUtils::getRemoteFile($remoteURL, 'newsticker', 5);
				}
				//var_dump($remoteResult ); //$options['newsticker_update_uri_alt']);
				if($remoteResult && isset($remoteResult['content'])) {
					$newsTickerContent = $_SESSION['_berta_newsticker'] = $remoteResult['content'];
					setcookie('_berta_newsticker', $remoteResult['content']);
				} else {
					$newsTickerContent = $_SESSION['_berta_newsticker'] = I18n::_('To enable Berta\'s news ticker, your computer needs to be connected to the internet!');
					setcookie('_berta_newsticker', $newsTickerContent);
				}
				
				$_SESSION['_berta_newsticker_numtries'] = !empty($_SESSION['_berta_newsticker_numtries']) ? ++$_SESSION['_berta_newsticker_numtries'] : 1;
			}
		}

		// if(!$newsTickerContent) {
		// 	$tickerClass = 'xHidden';
		// }

		$m1 = I18n::_('my site');
		$m2 = I18n::_('sections');
		$m3 = I18n::_('settings');
		$m4 = I18n::_('template design');
		$m5 = I18n::_('profile');
		$m6 = I18n::_('sign out');

		$m1Class = $selectedSection == 'site' ? ' class="selected"' : '';
		$m2Class = $selectedSection == 'sections' ? ' class="selected"' : '';
		$m3Class = $selectedSection == 'settings' ? ' class="selected"' : '';
		$m4Class = $selectedSection == 'template' ? ' class="selected"' : '';
		$m5Class = $selectedSection == 'profile' ? ' class="selected"' : '';

		$m5_link=self::$options['HOSTING_PROFILE']?self::$options['HOSTING_PROFILE']:'profile.php';

		$str_start = <<<DOC
			<div id="xTopPanelContainer" class="xPanel">
				<div id="xTopPanelSlideIn"><span title="show menu">▼</span></div>
				<div id="xTopPanel">	
					<ul id="xEditorMenu">
						<li id="xTopPanelSlideOut"><span title="hide menu">▲</span></li>
						<li$m1Class id="xMySite"><a href=".">$m1</a></li><li>|</li>
						<li$m2Class id="xSections"><a href="sections.php">$m2</a></li><li>|</li>
						<li$m3Class id="xSettings"><a href="settings.php">$m3</a></li><li>|</li>
						<li$m4Class id="xTemplateDesign"><a href="settings.php?mode=template">$m4</a></li><li>|</li>
						<li$m5Class><a href="$m5_link">$m5</a></li><li>|</li>
						<li><a href="logout.php">$m6</a></li>
					</ul>
DOC;

		$str_ticker = <<<DOC
					<div id="xNewsTickerContainer">
						<div class="news-ticker-content">$newsTickerContent</div>
						<a href="#" class="close">X</a>
						<br class="clear" />
					</div>
DOC;

		$str_end = <<<DOC
				</div>
			</div>
DOC;
		

		$str = $str_start . (empty($_COOKIE['_berta_newsticker_hidden']) ? $str_ticker : '') . $str_end;

		return $str;
	}
	
	public static function getSettingsItemEditHTML($property, $sDef, $value, $additionalParams = null, $tag = 'div') {
		global $editsForSettings;
		
		$pStr = '';
		if($additionalParams) foreach($additionalParams as $pN => $p) $pStr .= $pN . (!is_null($p) ? ('-' . $p) : '') . ' ';
		$html = '';
		
		if(!empty($sDef['html_before']))
			$html .= $sDef['html_before'];
		
		$html .= '<' . $tag . ' class="value ' . (!empty($editsForSettings[$sDef['format']]) ? $editsForSettings[$sDef['format']] : '') . ' ' . 
				   		  'xProperty-' . $property . ' ' . 
						  (empty($sDef['html_entities']) ? 'xNoHTMLEntities' : '') . ' ' . 
						  'xCSSUnits-' . (empty($sDef['css_units']) ? '0' : '1') . ' ' . 
						  'xRequired-' . (!empty($sDef['allow_blank']) ? '0' : '1') . ' ' . 
						  (!empty($sDef['validator']) ? 'xValidator-' . $sDef['validator'] . ' ' : '') . 
						  $pStr . 
				   '" title="' . htmlspecialchars($sDef['default']) . '"';
		
		if($sDef['format'] == 'select' || $sDef['format'] == 'fontselect') {
			$values = array();
			if($sDef['values'] == 'templates') {
				$values = BertaTemplate::getAllTemplates();
			} else {
			//	var_dump($sDef['values']);
				foreach($sDef['values'] as $vK => $vV) {
					$values[$vK] = is_string($vK) ? ($vK . '|' . $vV) : $vV;
				}
			}
			$html .= ' x_options="' . htmlspecialchars(implode('||', $values)) . '"';
			$value = isset($values[$value]) ? $sDef['values'][$value] : $value;
		}
		
		$html .= '>';
		$html .= $value . '</' . $tag . '>';
		
		if(!empty($sDef['html_after']))
			$html .= $sDef['html_after'];
		
		return $html;
	}
	
	
}






?>