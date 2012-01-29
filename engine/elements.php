<?

define('AUTH_AUTHREQUIRED', true);
define('BERTA_ENVIRONMENT', 'engine');
include('inc.page.php');
include_once('_classes/Zend/Json.php');
include_once('_classes/class.array_xml.php');
include_once('_classes/class.bertaeditor.php');

header('Content-Type: text/plain; charset=utf8');

$jsonRequest = !empty($_REQUEST['json']) ? stripslashes($_REQUEST['json']) : false;

if($jsonRequest) {
    //var_dump($_REQUEST);
	//echo str_replace(array("\n", "\r"), array('\n', ''), $jsonRequest) . "\n\n";
	$decoded = $result = Zend_Json::decode(str_replace(array("\n", "\r"), array('\n', ''), $jsonRequest));
	//	var_dump($decoded);
	
	switch($decoded['property']) {
		
		case 'gallery':
		
			if($decoded['section'] && $decoded['entry']) {
				$blog = BertaContent::loadBlog($decoded['section']);
				$entry = BertaContent::getEntry($decoded['entry'], $blog);
				
				echo BertaGallery::getHTMLForEntry($entry, true);
				
				
			}
			
			break;


		case 'galleryEditor':
		
			if($decoded['section'] && $decoded['entry']) {
				$blog = BertaEditor::loadBlog($decoded['section']);
				$entry = BertaEditor::getEntry($decoded['entry'], $blog);
				
				if($entry) {

					$galType = !empty($entry['mediaCacheData']['@attributes']['type']) ? $entry['mediaCacheData']['@attributes']['type'] : 'slideshow';
					$imageSize = !empty($entry['mediaCacheData']['@attributes']['size']) ? $entry['mediaCacheData']['@attributes']['size'] : 'large';
					$FullScreen=!empty($entry['mediaCacheData']['@attributes']['fullscreen']) ? $entry['mediaCacheData']['@attributes']['fullscreen'] : $berta->settings->get('entryLayout', 'galleryFullScreenDefault');
					$autoPlay = !empty($entry['mediaCacheData']['@attributes']['autoplay']) ? $entry['mediaCacheData']['@attributes']['autoplay'] : '0';
					$linkAddress = !empty($entry['mediaCacheData']['@attributes']['link_address']) ? $entry['mediaCacheData']['@attributes']['link_address'] : '';
					
					echo '<div class="xEntryGalleryEditor-wrap"><div class="xEntryGalleryEditor xPanel">';
						//echo ';

						echo '<div class="xEntryGalleryMenu">';
							echo '<div class="xEntryMedia tab">',
									'<a href="#" class="xParams-media selected" title="add images and videos"><span>media</span></a>',	
								 '</div>';
							echo '<div class="xEntryMediaSettings tab">',
									'<a href="#" class="xParams-media_settings" title="gallery settings"><span>settings</span></a>',	
								 '</div>';

							echo '<div class="xEntryFullScreenSettings tab ">',
									'<a href="#" class="xParams-fullscreen" title="lightbox on/off"><span>lightbox</span></a>',
								 '</div>';

							echo '<div class="xEntryImageSizeSettings tab ">',
									'<a href="#" class="xParams-image_size" title="large/small image size"><span>image size</span></a>',
								 '</div>';

							echo '<a class="xEntryGalCloseLink xEditorLink" href="#" title="close image editor"><span>X</span></a>';
						echo '</div>';
						
						echo '<div class="xEntryGalleryAddMedia">';
							echo '<div class="xEntryAddImagesFallback">' .
									'<iframe name="xEntryUploadFrame' . $entry['id']['value'] . '" id="xEntryUploadFrame' . $entry['id']['value'] . '" class="xEntryUploadFrame"></iframe>' . 
									'<form target="xEntryUploadFrame' . $entry['id']['value'] . '" action="' . $ENGINE_ABS_ROOT . 'upload.php?section=' . $decoded['section'] . '&amp;entry=' . $entry['id']['value'] . '&amp;mediafolder=' . $entry['mediafolder']['value'] . '&amp;session_id=' . session_id() . '" class="xEntryGalleryForm" method="post" enctype="multipart/form-data">' . 
										'<input type="hidden" name="upload_key" value="" />' . 
										'<input type="hidden" name="upload_type" value="fallback" />' . 
										//'<input type="file" name="Filedata" class="xUploadFile" /> ' .
										'<input type="submit" value="Upload" class="xUploadButton" />' .
									'</form>' . 
								 '</div>';
							echo '<a class="xEntryAddImagesLink xEditorLink xHidden" href="#"><span>+ add media</span></a>';
						echo '</div>';

						echo '<div class="xEntryGallerySettings xGreyBack xHidden">';
							echo '<div class="caption">gallery type</div>',
								 '<div class="xEntrySetGalType xEditableSelectRC xCommand-SET_GALLERY_TYPE" x_options="slideshow||row||link">' . $galType . '</div><br class="clear" />';
							echo '<div class="xEntrySlideshowSettings' . ($galType == 'slideshow' ? '' : ' xHidden') . '">',
									'<div class="caption">autoplay seconds</div>',
								 	'<div class="xEntryAutoPlay xEditableRC xCommand-SET_AUTOPLAY xCaption-0" title="' . $autoPlay . '">' . $autoPlay . '</div>',
								 '</div>';
							echo '<div class="xEntryLinkSettings' . ($galType == 'link' ? '' : ' xHidden') . ' ">',
									'<div class="caption">link address</div>',
									'<div class="xEntryLinkAddress xEditableRC xCommand-SET_LINK_ADDRESS" title="' . ($linkAddress ? $linkAddress : 'http://') . '">' . ($linkAddress ? $linkAddress : 'http://') . '</div>',
								 '</div>';
						echo '</div>';
						
						echo '<div class="xEntryGalleryFullScreen xHidden">';
							echo '<div class="caption">fullscreen</div>',
								 '<div class="xEntrySetFullScreen xEditableSelectRC xCommand-SET_FULLSCREEN" x_options="yes||no">' . $FullScreen . '</div><br class="clear" />';
						echo '</div>';
						
						echo '<div class="xEntryGalleryImageSize xHidden">';
							echo '<div class="caption">image size</div>',
								 '<div class="xEntrySetImageSize xEditableSelectRC xCommand-SET_GALLERY_SIZE" x_options="large||small">' . $imageSize . '</div><br class="clear" />';
						echo '</div>';
						
						echo '<div class="images"><ul>';
							if(!empty($entry['mediaCacheData']['file']) && count($entry['mediaCacheData']['file']) > 0) {
								// if the xml tag is not a list tag, convert it.
								Array_XML::makeListIfNotList($entry['mediaCacheData']['file']);
					
								// print out images
								foreach($entry['mediaCacheData']['file'] as $idx => $im) {
									if((string) $idx == '@attributes') continue;
									$imageThumbSrc = false;
									$imageWidth = 'auto';
									if($im['@attributes']['type'] == 'video') {
										if(!empty($im['@attributes']['poster_frame'])) {
	 										$imSrc = $options['MEDIA_ROOT'] . $entry['mediafolder']['value'] . '/' . (string) $im['@attributes']['poster_frame'];
											$imageThumbSrc = BertaEditor::images_getSmallThumbFor($imSrc);
											$imageSize = getimagesize($imageThumbSrc);
											$imageWidth = $imageSize[0] + 'px';
										}
										
										echo '<li class="video" filename="' . (string) $im['@attributes']['src'] . '" fileinfo="' . '' . '">';
										echo '<div class="placeholderContainer" style="background-image: ' . ($imageThumbSrc ? ('url(' . $imageThumbSrc . '?no_cache=' . rand() . ')') : 'none') . '; width: ' . $imageWidth . ';"><div class="placeholder"></div></div>';
										echo '<span class="grabHandle xMAlign-container"><span class="xMAlign-outer"><a class="xMAlign-inner" title="click and drag to move"><span></span></a></span></span>';
										echo '<a href="#" class="delete"></a>';
										echo '<div class="dimsForm">' . 
												'<div class="posterContainer"></div><a class="poster" href="#">' . ($imageThumbSrc ? 'change' : 'upload') . ' poster frame</a>' .
												/*'<span class="dim" property="width" x_params="' . $im['value'] . '">' . (!empty($im['@attributes']['width']) ? $im['@attributes']['width'] : BertaEditor::getXEmpty('width')) . '</span> x ' .
												'<span class="dim" property="height" x_params="' . $im['value'] . '">' . (!empty($im['@attributes']['height']) ? $im['@attributes']['height'] : BertaEditor::getXEmpty('height')) . '</span>' . */
											 '</div>';
										echo '<div class="xEGEImageCaption ' . $xEditSelectorMCESimple . ' xProperty-galleryImageCaption xCaption-caption xParam-' . $im['@attributes']['src'] . '">', !empty($im['value']) ? $im['value'] : '', '</div>';
										echo '</li>';
										echo "\n";
										
									} else {
										$imSrc = $options['MEDIA_ROOT'] . $entry['mediafolder']['value'] . '/' . (string) $im['@attributes']['src'];
										$imageThumbSrc = BertaEditor::images_getSmallThumbFor($imSrc);
										if($imageThumbSrc) {
											echo '<li filename="' . (string) $im['@attributes']['src'] . '" fileinfo="' . '' . '">';
											echo '<img class="img" src="' . $imageThumbSrc . '" />';
											echo '<span class="grabHandle xMAlign-container"><span class="xMAlign-outer"><a class="xMAlign-inner" title="click and drag to move"><span></span></a></span></span>';
											echo '<a href="#" class="delete"></a>';
											echo '<div class="xEGEImageCaption ' . $xEditSelectorMCESimple . ' xProperty-galleryImageCaption xCaption-image-caption xParam-' . $im['@attributes']['src'] . '">', !empty($im['value']) ? $im['value'] : '', '</div>';
											echo '</li>';
										}
									
									}

								}
							} else {
								//echo '<li class="placeholder"><img src="' . $ENGINE_ROOT . 'layout/gallery-placeholder.gif" /></li>';
							}
						echo "</ul></div>\n";
						//echo '</form>';
					echo "</div></div>\n";
				}
				
				
			}
		
		
			break;
		
		
		case 'bgEditor':
		
			if($decoded['section']) {
				
				$sections = BertaEditor::getSections();
				$section = $sections[$decoded['section']];

				if(!empty($section['mediafolder']['value']))
					$sectionMF = $section['mediafolder']['value'];
				else
					$sectionMF = BertaEditor::getSectionMediafolder($section['name']['value']);
				
				$autoPlay = !empty($section['mediaCacheData']['@attributes']['autoplay']) ? $section['mediaCacheData']['@attributes']['autoplay'] : '0';
				$bgSize = !empty($section['mediaCacheData']['@attributes']['image_size']) ? $section['mediaCacheData']['@attributes']['image_size'] : 'medium';
				$bgFading = !empty($section['mediaCacheData']['@attributes']['fade_content']) ? $section['mediaCacheData']['@attributes']['fade_content'] : 'disabled';
				
				$bgColor = !empty($section['sectionBgColor']['value']) ? $section['sectionBgColor']['value'] : '#ffffff';
				$bgColorText = !empty($section['sectionBgColor']['value']) ? $section['sectionBgColor']['value'] : 'none';
				$bgCaptionColor = !empty($section['mediaCacheData']['@attributes']['caption_color']) ? $section['mediaCacheData']['@attributes']['caption_color'] : '#ffffff';
				$bgCaptionColorText = !empty($section['mediaCacheData']['@attributes']['caption_color']) ? $section['mediaCacheData']['@attributes']['caption_color'] : 'none';
				$bgCaptionBackColorTmp = !empty($section['mediaCacheData']['@attributes']['caption_bg_color']) ? explode(',', $section['mediaCacheData']['@attributes']['caption_bg_color']) : explode(',', '255,255,255');
				
				$bgCaptionBackColor = '#';
				foreach($bgCaptionBackColorTmp as $val)
					$bgCaptionBackColor .= dechex($val);
					
				$bgCaptionBackColorTextTmp = !empty($section['mediaCacheData']['@attributes']['caption_bg_color']) ? explode(',', $section['mediaCacheData']['@attributes']['caption_bg_color']) : 'none';
				if($bgCaptionBackColorTextTmp != 'none') {
					$bgCaptionBackColorText = '#';
					foreach($bgCaptionBackColorTextTmp as $val)
						$bgCaptionBackColorText .= dechex($val);
				} else {
					$bgCaptionBackColorText = 'none';
				}
				
				echo '<div id="xBgEditorPanel" class="xPanel">';
					echo '<div class="xBgEditorTabs">';
						echo '<div class="xBgMediaTab tab">',
					    		'<a href="#" class="xParams-media selected" title="add images and videos"><span>media</span></a>',	
					    	 '</div>';
					    echo '<div class="xBgSettingsTab tab">',
					    		'<a href="#" class="xParams-settings" title="background settings"><span>background settings</span></a>',	
					    	 '</div>';
						echo '<div class="xBgSlideshowSettingsTab tab">',
					    		'<a href="#" class="xParams-slideshow_settings" title="slideshow settings"><span>slideshow settings</span></a>',	
					    	 '</div>';
						echo '<div class="xBgImgSizeSettingsTab tab">',
					    		'<a href="#" class="xParams-image_size_settings" title="image size"><span>image size</span></a>',	
					    	 '</div>';
					    echo '<a class="xBgEditorCloseLink" href="#" title="close background editor"><span>X</span></a>';
					echo '</div>';
					
					echo '<div class="xBgAddMedia">';
					    echo '<div class="xBgAddImagesFallback">' .
					    		'<iframe name="xBgUploadFrame" id="xBgUploadFrame" class="xBgUploadFrame"></iframe>' . 
					    		'<form target="xBgUploadFrame" action="' . $ENGINE_ABS_ROOT . 'upload.php?section=' . $section['name']['value'] . '&amp;mediafolder=' . $sectionMF . '&amp;session_id=' . session_id() . '&amp;section_background=true" class="xBgEditorForm" method="post" enctype="multipart/form-data">' . 
					    			'<input type="hidden" name="upload_key" value="" />' . 
					    			'<input type="hidden" name="upload_type" value="fallback" />' . 
					    			//'<input type="file" name="Filedata" class="xUploadFile" /> ' .
					    			'<input type="submit" value="Upload" class="xUploadButton" />' .
					    		'</form>' . 
					    	 '</div>';
					    echo '<a class="xBgAddImagesLink xHidden" href="#"><span>+ add media</span></a>';
					echo '</div>';
				
					echo '<div class="xBgSettings xHidden">';
					   	echo '<div class="xBgFadingSettings">',
					    		'<div class="caption">fade content</div>',
					    	 	'<div class="xBgFading xEditableSelectRC xCommand-SET_BG_FADE_CONTENT" x_options="enabled||disabled">' . $bgFading . '</div>',
								'<br class="clear" />',
							 '</div>';
						echo '<div class="xBgColorSettings">',
					    		'<div class="caption">background color</div>',
					    	 	'<div class="xBgColor xEditableColor xProperty-sectionBgColor xNoHTMLEntities xCSSUnits-0 xRequired-1 " title="' . $bgColor . '">' . $bgColorText . '</div>',
								'<div class="xBgColorReset xReset xCommand-sectionBgColorReset xParams-sectionBgColor"><a href="#"><span>remove</span></a></div>',
								'<br class="clear" />',
								'<div class="caption">caption text color</div>',
					    	 	'<div class="xBgColor xEditableColor xCommand-SET_BG_CAPTION_COLOR xNoHTMLEntities xCSSUnits-0 xRequired-1 " title="' . $bgCaptionColor . '">' . $bgCaptionColorText . '</div>',
								'<div class="xBgColorReset xReset xCommand-RESET_BG_CAPTION_COLOR xParams-SET_BG_CAPTION_COLOR"><a href="#"><span>remove</span></a></div>',
								'<br class="clear" />',
								'<div class="caption">caption background color</div>',
					    	 	'<div class="xBgColor xEditableColor xCommand-SET_BG_CAPTION_BACK_COLOR xNoHTMLEntities xCSSUnits-0 xRequired-1 " title="' . $bgCaptionBackColor . '">' . $bgCaptionBackColorText . '</div>',
								'<div class="xBgColorReset xReset xCommand-RESET_BG_CAPTION_BACK_COLOR xParams-SET_BG_CAPTION_BACK_COLOR"><a href="#"><span>remove</span></a></div>',
								'<br class="clear" />',
							 '</div>';
					echo '</div>';
					
					echo '<div class="xBgImgSizeSettings xHidden">';
					    echo '<div class="caption">background image size</div>',
							 '<div class="xBgImgSize xEditableSelectRC xCommand-SET_BG_IMG_SIZE" x_options="large||medium||small">' . $bgSize . '</div>',
							 '<br class="clear" />';
					echo '</div>';
					
					echo '<div class="xBgSlideshowSettings xHidden">';
					    echo '<div class="caption">autoplay seconds</div>',
							 '<div class="xBgAutoPlay xEditableRC xCommand-SET_AUTOPLAY xCaption-0" title="' . $autoPlay . '">' . $autoPlay . '</div>',
							 '<br class="clear" />';
					echo '</div>';
							 
					echo '<div class="images"><ul>';
					    if(!empty($section['mediaCacheData']['file']) && count($section['mediaCacheData']['file']) > 0) {
					    	// if the xml tag is not a list tag, convert it.
					    	Array_XML::makeListIfNotList($section['mediaCacheData']['file']);
					
					    	// print out images
					    	foreach($section['mediaCacheData']['file'] as $idx => $im) {
					    		if((string) $idx == '@attributes') continue;
					    		$imageThumbSrc = false;
					    		$imageWidth = 'auto';
					    		if($im['@attributes']['type'] == 'video') {
					    			if(!empty($im['@attributes']['poster_frame'])) {
	 				    				$imSrc = $options['MEDIA_ROOT'] . $section['mediafolder']['value'] . '/' . (string) $im['@attributes']['poster_frame'];
					    				$imageThumbSrc = BertaEditor::images_getSmallThumbFor($imSrc);
					    				$imageSize = getimagesize($imageThumbSrc);
					    				$imageWidth = $imageSize[0] + 'px';
					    			}
					    			
					    			echo '<li class="video" filename="' . (string) $im['@attributes']['src'] . '" fileinfo="' . '' . '">';
					    			echo '<div class="placeholderContainer" style="background-image: ' . ($imageThumbSrc ? ('url(' . $imageThumbSrc . '?no_cache=' . rand() . ')') : 'none') . '; width: ' . $imageWidth . ';"><div class="placeholder"></div></div>';
					    			echo '<span class="grabHandle xMAlign-container"><span class="xMAlign-outer"><a class="xMAlign-inner" title="click and drag to move"><span></span></a></span></span>';
					    			echo '<a href="#" class="delete"></a>';
					    			echo '<div class="dimsForm">' . 
					    					'<div class="posterContainer"></div><a class="poster" href="#">' . ($imageThumbSrc ? 'change' : 'upload') . ' poster frame</a>' .
					    					/*'<span class="dim" property="width" x_params="' . $im['value'] . '">' . (!empty($im['@attributes']['width']) ? $im['@attributes']['width'] : BertaEditor::getXEmpty('width')) . '</span> x ' .
					    					'<span class="dim" property="height" x_params="' . $im['value'] . '">' . (!empty($im['@attributes']['height']) ? $im['@attributes']['height'] : BertaEditor::getXEmpty('height')) . '</span>' . */
					    				 '</div>';
					    			echo '<div class="xEGEImageCaption ' . $xEditSelectorMCESimple . ' xProperty-galleryImageCaption xCaption-caption xParam-' . $im['@attributes']['src'] . '">', !empty($im['value']) ? $im['value'] : '', '</div>';
					    			echo '</li>';
					    			echo "\n";
					    			
					    		} else {
					    			$imSrc = $options['MEDIA_ROOT'] . $section['mediafolder']['value'] . '/' . (string) $im['@attributes']['src'];
					    			$imageThumbSrc = BertaEditor::images_getSmallThumbFor($imSrc);
					    			if($imageThumbSrc) {
					    				echo '<li filename="' . (string) $im['@attributes']['src'] . '" fileinfo="' . '' . '">';
					    				echo '<img class="img" src="' . $imageThumbSrc . '" />';
					    				echo '<span class="grabHandle xMAlign-container"><span class="xMAlign-outer"><a class="xMAlign-inner" title="click and drag to move"><span></span></a></span></span>';
					    				echo '<a href="#" class="delete"></a>';
					    				echo '<div class="xEGEImageCaption ' . $xEditSelectorMCESimple . ' xProperty-galleryImageCaption xCaption-image-caption xParam-' . $im['@attributes']['src'] . '">', !empty($im['value']) ? $im['value'] : '', '</div>';
					    				echo '</li>';
					    			}
					    		
					    		}
				
					    	}
					    } else {
					    	//echo '<li class="placeholder"><img src="' . $ENGINE_ROOT . 'layout/gallery-placeholder.gif" /></li>';
					    }
					echo "</ul></div>\n";
				echo '</div>';
			}
			break;
	}
	
	
	
}


?>
