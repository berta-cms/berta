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
					
					echo '<div class="xEntryGalleryEditor-wrap"><div class="xEntryGalleryEditor xPanel">';
						//echo ';
						echo '<div class="xEntryGalleryToolbar xGreyBack">';
							echo '<div class="xEntryAddImagesFallback">' .
									'<iframe name="xEntryUploadFrame' . $entry['id']['value'] . '" id="xEntryUploadFrame' . $entry['id']['value'] . '" class="xEntryUploadFrame"></iframe>' . 
									'<form target="xEntryUploadFrame' . $entry['id']['value'] . '" action="' . $ENGINE_ABS_ROOT . 'upload.php?section=' . $decoded['section'] . '&amp;entry=' . $entry['id']['value'] . '&amp;mediafolder=' . $entry['mediafolder']['value'] . '&amp;session_id=' . session_id() . '" class="xEntryGalleryForm" method="post" enctype="multipart/form-data">' . 
										'<input type="hidden" name="upload_key" value="" />' . 
										'<input type="hidden" name="upload_type" value="fallback" />' . 
										//'<input type="file" name="Filedata" class="xUploadFile" /> ' .
										'<input type="submit" value="Upload" class="xUploadButton" />' .
									'</form>' . 
								 '</div>';
							echo '<a class="xEntryAddImagesLink xEditorLink xHidden" href="#"><span>add media</span></a>';
							echo '<div class="xEntrySetGalType">',
									'<a href="#" class="o1 xAction' . ($galType == 'slideshow' ? ' selected' : '') . ' xCommand-SET_GALLERY_TYPE xParams-slideshow" title="slideshow"><span>slideshow</span></a>',
									'<a href="#" class="o2 xAction' . ($galType == 'row' ? ' selected' : '') . ' xCommand-SET_GALLERY_TYPE xParams-row" title="horizontal row of images"><span>horizontal row of images</span></a>',
								 '</div>';
							echo '<div class="xEntrySetImageSize">',
									'<a href="#" class="o1 xAction' . ($imageSize == 'large' ? ' selected' : '') . ' xCommand-SET_GALLERY_SIZE xParams-large" title="Large images"><span>Large images</span></a>',
									'<a href="#" class="o2 xAction' . ($imageSize == 'small' ? ' selected' : '') . ' xCommand-SET_GALLERY_SIZE xParams-small" title="Small images"><span>Small images</span></a>',
								 '</div>';
							echo '<div class="xEntryFullScreen">',
									'<a href="#" class="' . ($FullScreen == 'yes' ? 'selected ' : '') . 'xAction xCommand-SET_FULLSCREEN xParams-' . ($FullScreen == 'yes' ? 'yes' : 'no') . '" title="Lightbox"><span>yes/no</span></a>',
								 '</div>';
							echo '<a class="xEntryGalCloseLink xEditorLink" href="#" title="close image editor"><span>close image editor</span></a>';
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
											echo '<div class="xEGEImageCaption ' . $xEditSelectorMCESimple . ' xProperty-galleryImageCaption xCaption-caption xParam-' . $im['@attributes']['src'] . '">', !empty($im['value']) ? $im['value'] : '', '</div>';
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
		
		
		
		
		
	}
	
	
	
}


?>
