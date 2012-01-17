<?php

class BertaGallery extends BertaBase {
	
	public static function getImagesArray($entry) {
		$imgs = array();
		if(!empty($entry['mediaCacheData']['file']) && count($entry['mediaCacheData']['file']) > 0) {
			$imgs = array();
			Array_XML::makeListIfNotList($entry['mediaCacheData']['file']);
			foreach($entry['mediaCacheData']['file'] as $idx => $im) {
				if((string) $idx == '@attributes') continue;
				if($im['@attributes']['type'] == 'image')
					$imgs[] = $im;
				elseif($im['@attributes']['type'] == 'video' && !empty($im['@attributes']['poster_frame']))
					$imgs[] = $im;
			}
		}
		return $imgs;
	}
	
	public static function getHTMLForEntry($entry, $isAdminMode = false) {
		$imgs = BertaGallery::getImagesArray($entry);
		$galleryType = !empty($entry['mediaCacheData']['@attributes']['type']) ? $entry['mediaCacheData']['@attributes']['type'] : 'slideshow';
		$imageSize = !empty($entry['mediaCacheData']['@attributes']['size']) ? $entry['mediaCacheData']['@attributes']['size'] : 'large';

        //return entry ID - needed for milkbox
		$galleryFullScreen = !$isAdminMode && isset($entry['mediaCacheData']['@attributes']['fullscreen']) && $entry['mediaCacheData']['@attributes']['fullscreen']=='yes'?$entry['id']['value']:false;

		
		$galleryAutoPlay = !empty($entry['mediaCacheData']['@attributes']['autoplay']) ? $entry['mediaCacheData']['@attributes']['autoplay'] : '0';
		$galleryLinkAddress = !empty($entry['mediaCacheData']['@attributes']['link_address']) ? 'xGalleryLinkAddress-' . $entry['mediaCacheData']['@attributes']['link_address'] : 'xGalleryLinkAddress-http://';

		return BertaGallery::getHTML($imgs, $entry['mediafolder']['value'], $galleryType, $isAdminMode, false, 1, $galleryFullScreen, $imageSize, $galleryAutoPlay, $galleryLinkAddress);
	}
	
	public static function getHTML($imgs, $mediaFolderName, $galleryType, $isAdminMode = false, $bReturnFullInfo = false, $sizeRatio = 1, $galleryFullScreen = false, $imageSize = 'large', $galleryAutoPlay = '0', $galleryLinkAddress = '') {
		global $berta;
		$strOut = '';
		
		$mFolder = self::$options['MEDIA_ROOT'] . $mediaFolderName . '/';
		$mFolderABS = self::$options['MEDIA_ABS_ROOT'] . $mediaFolderName . '/';

		$imageTargetWidth = $berta->template->settings->get('media', 'images' . ucfirst($imageSize) . 'Width', false, true);
		$imageTargetHeight = $berta->template->settings->get('media', 'images' . ucfirst($imageSize) . 'Width', false, true);

		// print output ...
	
		if($imgs && count($imgs) > 0) {
			list($firstImageHTML, $firstImageWidth, $firstImageHeight) = BertaGallery::getImageHTML($imgs[0], $mediaFolderName, $isAdminMode, $sizeRatio, $imageTargetWidth, $imageTargetHeight);
			
			$strOut = '<div class="xGalleryContainer xGalleryHasImages xGalleryType-' . $galleryType . ' xGalleryAutoPlay-' . $galleryAutoPlay . ' ' . ($galleryType == 'link' ? $galleryLinkAddress : '') . '">';
			$strOut .= "<div class=\"xGallery\" style=\"width: {$firstImageWidth}px; height: {$firstImageHeight}px;\">";
			$strOut .= $firstImageHTML;
			if($isAdminMode) $strOut .= '<a href="#" class="xGalleryEditButton xEditorLink xSysCaption xMAlign-container"><span class="xMAlign-outer"><span class="xMAlign-inner">edit gallery</span></span></a>';
			$strOut .= '</div>';
			$strOut .= BertaGallery::getNavHTML($imgs, $galleryType, $mFolder, $mFolderABS, $isAdminMode, $sizeRatio, $imageTargetWidth, $imageTargetHeight, $galleryFullScreen);
			$strOut .= '</div>';
				
		} elseif($isAdminMode) {
			$strOut = '<div class="xGalleryContainer">'; //.
						//'<img src="' . $options['MEDIA_ROOT'] . $p['mediafolder']['value'] . '/' . $imgs[0] . '" alt="' . (!empty($p['title']['value']) ? htmlspecialchars($p['title']['value']) : '') . '" />' . 
					  //'</div>';
		
			$strOut .= '<div class="imageEmpty">';
			if($isAdminMode) $strOut .= '<a href="#" class="xGalleryEditButton">' . BertaContent::getXEmpty('gallery') . '</a>';
			$strOut .= '</div>';
		
			$strOut .= '</div>';
		}
	
		return $bReturnFullInfo ?
			   array($strOut, $firstImageWidth, $firstImageHeight) : 
			   $strOut;
	}
	
	
	public static function getImageHTML($img, $mediaFolder, $isAdminMode = false, $sizeRatio = 1, $imageTargetWidth = 0, $imageTargetHeight = 0) {
		$mFolder = self::$options['MEDIA_ROOT'] . $mediaFolder . '/';
		$mFolderABS = self::$options['MEDIA_ABS_ROOT'] . $mediaFolder . '/';
		$realWidth = $width = $realHeight = $height = 0;
		
		$firstImageHTML = $firstImageWidth = $firstImageHeight = null;
		if($img) {
			if($img['@attributes']['type'] == 'image' || !empty($img['@attributes']['poster_frame'])) {
				
				$isPoster = !empty($img['@attributes']['poster_frame']);
				$imgSrc = $isPoster ? $img['@attributes']['poster_frame'] : $img['@attributes']['src'];
				
				if(!empty($img['@attributes']['width']) && !empty($img['@attributes']['height'])) {
					$width = (int) $img['@attributes']['width'];
					$height = (int) $img['@attributes']['height'];
				}
				
				if($isPoster || !$width || !$height) {
					$imgSize = getimagesize($mFolder . $imgSrc);
					$width = $imgSize ? (int) $imgSize[0] : false;
					$height = $imgSize ? (int) $imgSize[1] : false;
				}
				
				
				
				if($width && $height && $imageTargetWidth && $imageTargetHeight && ($width > $imageTargetWidth || $height > $imageTargetHeight)) {
					list($width, $height) = self::fitInBounds($width, $height, $imageTargetWidth, $imageTargetHeight);
					
					$imgSrc = self::getResizedSrc($mFolder, $imgSrc, $width, $height);
				}
				
				$width = round($width * $sizeRatio);
				$height = round($height * $sizeRatio);
				
				$firstImageHTML = '<div class="xGalleryItem xGalleryItemType-image xImgIndex-1" style="' . ($width ? "width:{$width}px;" : '') . '' . ($height ? "height:{$height}px;" : '') . '">' .
									'<img src="' . $mFolderABS . $imgSrc . '" ' . ($width ? "width=\"$width\"" : '') . ' ' . ($height ? "height=\"$height\"" : '') . ' />' .
									'<div class="xGalleryImageCaption">' . (!empty($img['value']) ? $img['value'] : '') . '</div>' .
								  '</div>';
			}
			
		}

		return array($firstImageHTML, $width, $height);
	}
	
	
	private static function getNavHTML($imgs, $galleryType, $mFolder, $mFolderABS, $isAdminMode = false, $sizeRatio = 1, $imageTargetWidth = 0, $imageTargetHeight = 0, $galleryFullScreen = false) {

        //milkbox fullscreen
        $milkbox='';

        //print_R ($imgs);

		$navStr = '<ul class="xGalleryNav" ' . ((count($imgs) == 1 || $galleryType == 'row' || $galleryType == 'link') ? 'style="display:none"' : '') . '>'; // <link/> / added || $galleryType == 'link'
		for($i = 0; $i < count($imgs); $i++) {
			$width = $height = $isPoster = 0;
			
			if($imgs[$i]['@attributes']['type'] == 'video') {
				$src = !empty($imgs[$i]['@attributes']['poster_frame']) ? $imgs[$i]['@attributes']['poster_frame'] : '';
				if($src) $isPoster = true;
				$videoLink = $mFolderABS . $imgs[$i]['@attributes']['src'];
				$origLink = '';
			} else {
				$src = $imgs[$i]['@attributes']['src'];

				// For caompatibility with versions < 0.6.6 leave the search for "original" images
				$origLink = file_exists($mFolder . "_orig_" . $imgs[$i]['@attributes']['src']) ? 
								$mFolderABS . "_orig_" . $imgs[$i]['@attributes']['src'] : 
								$mFolderABS . $src;									
				$videoLink = '';
			}
			
			if(!empty($imgs[$i]['@attributes']['width']) && !empty($imgs[$i]['@attributes']['height']) && !$isPoster) {
				$width = (int) $imgs[$i]['@attributes']['width'];
				$height = (int) $imgs[$i]['@attributes']['height'];
			}
			
			if((!$width || !$height) && $src) {
				$imgSize = getimagesize($mFolder . $src);
				$width = $imgSize ? (int) $imgSize[0] : false;
				$height = $imgSize ? (int) $imgSize[1] : false;
			}
			
			if($width && $height && $imageTargetWidth && $imageTargetHeight && ($width > $imageTargetWidth || $height > $imageTargetHeight)) {
				list($width, $height) = self::fitInBounds($width, $height, $imageTargetWidth, $imageTargetHeight);
				$src = self::getResizedSrc($mFolder, $src, $width, $height);
			}
			
			$width = round($width * $sizeRatio);
			$height = round($height * $sizeRatio);
		
			$navStr .= '<li><a href="' . ($src ? $mFolderABS . $src : '#') . ($isAdminMode ? '?no_cache=' . rand() : '') . '" ' . 
							  'class="xType-' . $imgs[$i]['@attributes']['type'] . ' ' . 
							  		 'xVideoHref-' . $videoLink . ' ' .
									 'xOrigHref-' . $origLink . ' ' .
							  		 'xW-' . $width . ' ' .
							  		 'xH-' . $height . ' ' .
                                     'xImgIndex-' . ($i+1) . ' ' .
							  '" target="_blank"><span>' .
				 ($i + 1) . 
				 '</span></a><div class="xGalleryImageCaption">' . (!empty($imgs[$i]['value']) ? $imgs[$i]['value'] : '') . '</div></li>' . "\n";

            if ($galleryFullScreen){
                if (!empty($videoLink)){
                    //add video link properties
                    //instead of video, show only poster
				    $origLink = file_exists($mFolder . self::$options['images']['orig_prefix'] . $imgs[$i]['@attributes']['poster_frame']) ?
								$mFolderABS . self::$options['images']['orig_prefix'] . $imgs[$i]['@attributes']['poster_frame'] :
								$mFolderABS . $imgs[$i]['@attributes']['poster_frame'];
                }
                $milkbox .= '<a href="'.$origLink.'" rel="milkbox[gallery-'.$galleryFullScreen.']" title="'.htmlspecialchars(strip_tags($imgs[$i]['value'])).'" >#</a>';
            }
		}
		$navStr .= '</ul>';
		
        if ($galleryFullScreen){
            $navStr .= '<div class="xFullscreen">'.$milkbox.'</div>';
        }

		return $navStr;
	}
	
	
	private static function fitInBounds($w, $h, $boundsW, $boundsH) {
		$rw = $w / $boundsW;
		$rh = $h / $boundsH;
		
		if($rw > $rh) {
			$newH = round($h / $rw);
			$newW = $boundsW;
		} else {
			$newW = round($w / $rh);
			$newH = $boundsH;
		}
		
		return array($newW, $newH);
	}
	
	private static function getResizedSrc($folder, $src, $w, $h) {
		$newSrc = '_'.$w.'x'.$h.'_'.$src;
		if(file_exists($folder.$newSrc) || self::createThumbnail($folder . $src, $folder . $newSrc, $w, $h)) {
			return $newSrc;
		} else {
			return $src;
		}
	}
		
	public static function createThumbnail($imagePath, $thumbPath, $thumbWidth, $thumbHeight) {
		if(file_exists($imagePath)) {
			$imageInfo = getimagesize($imagePath);

			$canMakeThumb = function_exists('imagejpeg') &&
								(($imageInfo[2] == IMAGETYPE_GIF && function_exists('imagecreatefromgif')) ||
								($imageInfo[2] == IMAGETYPE_JPEG && function_exists('imagecreatefromjpeg')) ||
								($imageInfo[2] == IMAGETYPE_PNG && function_exists('imagecreatefrompng')));

			if($canMakeThumb) {
				
				if($thumbWidth && !$thumbHeight) {
					$thumbHeight = ($thumbWidth / $imageInfo[0]) * $imageInfo[1];
				} elseif(!$thumbWidth && $thumbHeight) {
					$thumbWidth = ($thumbHeight / $imageInfo[1]) * $imageInfo[0];
				}
				
				$imageThumb = BertaUtils::smart_resize_image($imagePath, $thumbWidth, $thumbHeight, false, 'return', false);
				if($imageThumb) {
					switch ($imageInfo[2]) {
				      case IMAGETYPE_GIF:   imagegif($imageThumb, $thumbPath);    break;
				      case IMAGETYPE_JPEG:  imagejpeg($imageThumb, $thumbPath, 90);   break;
				      case IMAGETYPE_PNG:   imagepng($imageThumb, $thumbPath);    break;
				      default: return false;
				    }
					if(file_exists($thumbPath)) @chmod($thumbPath, 0666);
					
					return true;
				}
			}
		}

		return false;
	}
	
	public static function images_getGridImageFor($mFolder, $fName, $fSizes) {
		global $berta;
	
		$imageTargetWidth = $berta->template->settings->get('media', 'imagesSmallWidth', false, true);
		$imageTargetHeight = $berta->template->settings->get('media', 'imagesSmallWidth', false, true);
		
		if($fSizes[0] && $fSizes[1] && $imageTargetWidth && $imageTargetHeight && 
		  ($fSizes[0] > $imageTargetWidth || $fSizes[0] > $imageTargetHeight)) {
		    list($gridWidth, $gridHeight) = self::fitInBounds($fSizes[0], $fSizes[1], $imageTargetWidth, $imageTargetHeight);					
		    $gridImagePath = self::getResizedSrc($mFolder, $fName, $gridWidth, $gridHeight);
		}
		
		return $mFolder . $gridImagePath;
	}
	
	public static function getHTMLForGridView($section) {
		global $berta;
	
		$imgs = BertaGallery::getImagesArray($section);	
		$mediaFolder = $section['mediafolder'];
		$mFolder = self::$options['MEDIA_ROOT'] . $mediaFolder . '/';
		$width = $height = 0;
		
		$imageTargetWidth = $berta->template->settings->get('media', 'imagesSmallWidth', false, true);
		$imageTargetHeight = $berta->template->settings->get('media', 'imagesSmallWidth', false, true);
		
		if($berta->environment == 'engine') {
			$linkHref = '?section=' . $section['name'];
		} elseif($berta->environment == 'site' && isset($_REQUEST['__rewrite'])) {
			$linkHref = $section['name'];
		} elseif($berta->environment == 'site' && !isset($_REQUEST['__rewrite'])) {
			$linkHref = '?section=' . $section['name'];
		}
		
		if($imgs && count($imgs) > 0)
			foreach ($imgs as $img) {
				if($img['@attributes']['type'] == 'image') {
				
					$imgSrc = $img['@attributes']['src'];
					
					if(!empty($img['@attributes']['width']) && !empty($img['@attributes']['height'])) {
						$width = (int) $img['@attributes']['width'];
						$height = (int) $img['@attributes']['height'];
					}
					
					if(!$width || !$height) {
						$imgSize = getimagesize($mFolder . $imgSrc);
						$width = $imgSize ? (int) $imgSize[0] : false;
						$height = $imgSize ? (int) $imgSize[1] : false;
					}
					
					if($width && $height && $imageTargetWidth && $imageTargetHeight && 
					  ($width > $imageTargetWidth || $height > $imageTargetHeight)) {
						list($width, $height) = self::fitInBounds($width, $height, $imageTargetWidth, $imageTargetHeight);					
						$imgSrc = self::getResizedSrc($mFolder, $imgSrc, $width, $height);
					}
				
					
					$returnImages .= '<div class="box"><a href="' . $linkHref . '"><img class="gridItem" src="' . $mFolder . $imgSrc . '" /></a></div>';
				}
			}

		return $returnImages;
	}


}




?>