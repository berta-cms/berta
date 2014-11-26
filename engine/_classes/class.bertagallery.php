<?php

class BertaGallery extends BertaBase {

    public static function getImagesArray($entry) {
        $imgs = array();
        if(!empty($entry['mediaCacheData']['file']) && count($entry['mediaCacheData']['file']) > 0) {
            $imgs = array();
            Array_XML::makeListIfNotList($entry['mediaCacheData']['file']);
            foreach($entry['mediaCacheData']['file'] as $idx => $im) {
                if((string) $idx == '@attributes') continue;
                $imgs[] = $im;
            }
        }
        return $imgs;
    }

    public static function getHTMLForEntry($entry, $isAdminMode = false) {
    	global $berta;
        $imgs = BertaGallery::getImagesArray($entry);
        $galleryType = !empty($entry['mediaCacheData']['@attributes']['type']) ? $entry['mediaCacheData']['@attributes']['type'] : 'slideshow';
        $imageSize = !empty($entry['mediaCacheData']['@attributes']['size']) ? $entry['mediaCacheData']['@attributes']['size'] : 'large';

        //return entry ID - needed for milkbox
        $galleryFullScreen = !$isAdminMode && isset($entry['mediaCacheData']['@attributes']['fullscreen']) && $entry['mediaCacheData']['@attributes']['fullscreen']=='yes'?$entry['id']['value']:false;


        $galleryAutoPlay = !empty($entry['mediaCacheData']['@attributes']['autoplay']) ? $entry['mediaCacheData']['@attributes']['autoplay'] : '0';
        $gallerySlideNumbersVisible = !empty($entry['mediaCacheData']['@attributes']['slide_numbers_visible']) ? $entry['mediaCacheData']['@attributes']['slide_numbers_visible'] : $berta->settings->get('entryLayout', 'gallerySlideNumberVisibilityDefault');
        $galleryLinkAddress = !empty($entry['mediaCacheData']['@attributes']['link_address']) ? $entry['mediaCacheData']['@attributes']['link_address'] : '';
        $galleryLinkTarget = !empty($entry['mediaCacheData']['@attributes']['linkTarget']) ? $entry['mediaCacheData']['@attributes']['linkTarget'] : '';

        $rowGalleryPadding = !empty($entry['mediaCacheData']['@attributes']['row_gallery_padding']) ? $entry['mediaCacheData']['@attributes']['row_gallery_padding'] : false;

        return BertaGallery::getHTML($imgs, $entry['mediafolder']['value'], $galleryType, $isAdminMode, false, 1, $galleryFullScreen, $imageSize, $galleryAutoPlay, $gallerySlideNumbersVisible, $galleryLinkAddress, $galleryLinkTarget, $rowGalleryPadding);
    }

    public static function getHTML($imgs, $mediaFolderName, $galleryType, $isAdminMode = false, $bReturnFullInfo = false, $sizeRatio = 1, $galleryFullScreen = false, $imageSize = 'large', $galleryAutoPlay = '0', $gallerySlideNumbersVisible = 'yes', $galleryLinkAddress = '', $galleryLinkTarget = '', $rowGalleryPadding = false) {
        global $berta;
        $strOut = '';

        $mFolder = self::$options['MEDIA_ROOT'] . $mediaFolderName . '/';
        $mFolderABS = self::$options['MEDIA_ABS_ROOT'] . $mediaFolderName . '/';

        $imageTargetWidth = $berta->template->settings->get('media', 'images' . ucfirst($imageSize) . 'Width', false, true);
        $imageTargetHeight = $berta->template->settings->get('media', 'images' . ucfirst($imageSize) . 'Height', false, true);

        // print output ...

        if($imgs && count($imgs) > 0) {
            list($firstImageHTML, $firstImageWidth, $firstImageHeight) = BertaGallery::getImageHTML($imgs[0], $mediaFolderName, $isAdminMode, $sizeRatio, $imageTargetWidth, $imageTargetHeight);

            $specificClasses = '';
            switch($galleryType) {
	            case 'link':
	            	$specificClasses = ' xGalleryLinkAddress-' . $galleryLinkAddress;
                    $specificClasses .= ' xGalleryLinkTarget-' . $galleryLinkTarget;
	            break;

	            case 'slideshow':
	            	$specificClasses = ' xGalleryAutoPlay-' . $galleryAutoPlay . ' xSlideNumbersVisible-' . $gallerySlideNumbersVisible;
	            break;
            }

            $strOut = '<div class="xGalleryContainer xGalleryHasImages xGalleryType-' . $galleryType . $specificClasses . '">';
            $strOut .= "<div class=\"xGallery\" style=\"width: {$firstImageWidth}px; height: {$firstImageHeight}px;\"".($rowGalleryPadding ? ' xRowGalleryPadding="'.$rowGalleryPadding.'"':'').">";
            $strOut .= $firstImageHTML;
            if($isAdminMode) $strOut .= '<a href="#" class="xGalleryEditButton xEditorLink xSysCaption xMAlign-container"><span class="xMAlign-outer-gallery"><span class="xMAlign-inner-gallery">edit gallery</span></span></a>';
            $strOut .= '</div>';
            $strOut .= BertaGallery::getNavHTML($imgs, $galleryType, $mFolder, $mFolderABS, $isAdminMode, $sizeRatio, $imageTargetWidth, $imageTargetHeight, $galleryFullScreen);
            if($galleryType == 'slideshow') $strOut .= '<div class="loader xHidden"></div>';
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
                $srcset = '';

                if(!empty($img['@attributes']['width']) && !empty($img['@attributes']['height'])) {
                    $width = (int) $img['@attributes']['width'];
                    $height = (int) $img['@attributes']['height'];
                }

                if($isPoster || !$width || !$height) {
                    $imgSize = getimagesize($mFolder . $imgSrc);
                    $width = $imgSize ? (int) $imgSize[0] : false;
                    $height = $imgSize ? (int) $imgSize[1] : false;
                }

                $width_original = $width;
                $height_original = $height;
                $imgSrc_original = $imgSrc;

                if($width && $height && $imageTargetWidth && $imageTargetHeight && ($width > $imageTargetWidth || $height > $imageTargetHeight)) {
                    list($width, $height) = self::fitInBounds($width, $height, $imageTargetWidth, $imageTargetHeight);
                    $imgSrc = self::getResizedSrc($mFolder, $imgSrc, $width, $height);

                    // start generate image for @2x displays
                    $imageTargetWidth_2x = $width * 2;
                    $imageTargetHeight_2x = $height * 2;
                    if($width_original && $height_original && $imageTargetWidth_2x && $imageTargetHeight_2x && ($width_original > $imageTargetWidth_2x || $height_original > $imageTargetHeight_2x)) {
                        list($width_2x, $height_2x) = self::fitInBounds($width_original, $height_original, $imageTargetWidth_2x, $imageTargetHeight_2x);
                        $imgSrc_2x = self::getResizedSrc($mFolder, $imgSrc_original, $width_2x, $height_2x);
                        $srcset = ' srcset="' . $mFolderABS . $imgSrc . ' 1x, ' . $mFolderABS . $imgSrc_2x . ' 2x"';
                    }
                    // end generate image for @2x displays
                }

                $width = round($width * $sizeRatio);
                $height = round($height * $sizeRatio);

                $firstImageHTML = '<div class="xGalleryItem xGalleryItemType-image xImgIndex-1" style="' . ($width ? "width:{$width}px;" : '') . '' . ($height ? "height:{$height}px;" : '') . '">' .
                                    '<img src="' . $mFolderABS . $imgSrc . '" ' . ($width ? "width=\"$width\"" : '') . ' ' . ($height ? "height=\"$height\"" : '') . $srcset . ' />' .
                                    '<div class="xGalleryImageCaption">' . (!empty($img['value']) ? $img['value'] : '') . '</div>' .
                                  '</div>';
            }

        }

        return array($firstImageHTML, $width, $height);
    }


    private static function getNavHTML($imgs, $galleryType, $mFolder, $mFolderABS, $isAdminMode = false, $sizeRatio = 1, $imageTargetWidth = 0, $imageTargetHeight = 0, $galleryFullScreen = false) {

        //milkbox fullscreen
        $milkbox='';

        $navStr = '<ul class="xGalleryNav" ' . ((count($imgs) == 1 || in_array($galleryType, array('row', 'column', 'pile', 'link'))) ? 'style="display:none"' : '') . '>'; // <link/> / added || $galleryType == 'link'
        for($i = 0; $i < count($imgs); $i++) {
            $width = $height = $isPoster = 0;
            $srcset = '';

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

            //default image size (video without poster)
            $width = $width ? $width : 300;
            $height = $height ? $height : 150;

            $width_original = $width;
            $height_original = $height;
            $src_original = $src;

            if($width && $height && $imageTargetWidth && $imageTargetHeight && ($width > $imageTargetWidth || $height > $imageTargetHeight)) {
                list($width, $height) = self::fitInBounds($width, $height, $imageTargetWidth, $imageTargetHeight);
                $src = self::getResizedSrc($mFolder, $src, $width, $height);

                // start generate image for @2x displays
                $imageTargetWidth_2x = $width * 2;
                $imageTargetHeight_2x = $height * 2;
                if($width_original && $height_original && $imageTargetWidth_2x && $imageTargetHeight_2x && ($width_original > $imageTargetWidth_2x || $height_original > $imageTargetHeight_2x)) {
                    list($width_2x, $height_2x) = self::fitInBounds($width_original, $height_original, $imageTargetWidth_2x, $imageTargetHeight_2x);
                    $src_2x = self::getResizedSrc($mFolder, $src_original, $width_2x, $height_2x);
                    $srcset = ' data-srcset="' . $mFolderABS . $src . ' 1x, ' . $mFolderABS . $src_2x . ' 2x"';
                }
                // end generate image for @2x displays
            }

            $width = round($width * $sizeRatio);
            $height = round($height * $sizeRatio);

            $autoPlay = isset($imgs[$i]['@attributes']['autoplay']) ? $imgs[$i]['@attributes']['autoplay'] : 0;

            $navStr .= '<li><a href="' . ($src ? $mFolderABS . $src : '#') . ($isAdminMode ? '?no_cache=' . rand() : '') . '" ' .
                              'class="xType-' . $imgs[$i]['@attributes']['type'] . ' ' .
                                     'xVideoHref-' . $videoLink . ' ' .
                                     'xAutoPlay-' . $autoPlay . ' ' .
                                     'xOrigHref-' . $origLink . ' ' .
                                     'xW-' . $width . ' ' .
                                     'xH-' . $height . ' ' .
                                     'xImgIndex-' . ($i+1) . ' ' .
                              '"' . $srcset . ' target="_blank"><span>' .
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
                $milkbox .= '<a href="'.$origLink.'" rel="milkbox[gallery-'.$galleryFullScreen.']" title="'.htmlspecialchars($imgs[$i]['value']).'" >#</a>';
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

    public static function getResizedSrc($folder, $src, $w, $h) {
        $newSrc = '_'.$w.'x'.$h.'_'.$src;
        if(file_exists($folder.$newSrc) || self::createThumbnail($folder . $src, $folder . $newSrc, $w, $h)) {
            return $newSrc;
        } else {
            return $src;
        }
    }

    public static function createThumbnail($imagePath, $thumbPath, $thumbWidth, $thumbHeight) {
        if(is_file($imagePath)) {
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
                      case IMAGETYPE_GIF:
                        //solution for animated gif
                        if ( self::$options['HOSTING_PROFILE'] && ($imageInfo[2] == IMAGETYPE_GIF) ) {
                            $file_path = realpath($imagePath);
                            $file_info = pathinfo($file_path);
                            $thumb_info = pathinfo($thumbPath);
                            $thumbPath = $file_info['dirname'] . '/' . $thumb_info['basename'];
                            $command = "/usr/bin/convert {$file_path} -coalesce -bordercolor LightSteelBlue -border 0 -resize {$thumbWidth}x{$thumbHeight} -layers Optimize {$thumbPath}";
                            exec($command);
                        }elseif ( extension_loaded('imagick') && ($imageInfo[2] == IMAGETYPE_GIF) ) {
                            $animation = new Imagick($imagePath);
                            $animation = $animation->coalesceImages();
                            foreach ($animation as $frame)
                            {
                                $frame->thumbnailImage($thumbWidth, $thumbHeight);
                                $frame->setImagePage($thumbWidth, $thumbHeight, 0, 0);
                            }
                            $animation = $animation->deconstructImages();
                            $animation->writeImages($thumbPath, true);
                        }else{
                            imagegif($imageThumb, $thumbPath);
                        }
                        break;
                      case IMAGETYPE_JPEG:  imagejpeg($imageThumb, $thumbPath, 97);   break;
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

    public static function images_getGridImageFor($imagePath) {
		$fileName = basename($imagePath);
		$dirName = dirname($imagePath);
		if($dirName) $dirName .= '/';

		$newFileName = self::$options['images']['grid_image_prefix'] . $fileName;

		$gridImagePath = $dirName . $newFileName;
        //$sizes = getimagesize($gridImagePath);
		//if(file_exists($gridImagePath) && $sizes[0] == 140) {
        if(file_exists($gridImagePath)) {
			return $newFileName;
		} elseif(self::createThumbnail($imagePath, $gridImagePath, 140, '')) {
			return $newFileName;
		}

		return false;
	}

    public static function getHTMLForGridView($section, $tag) {
        global $berta;

        $imgs = BertaGallery::getImagesArray($section);
        $mediaFolder = $section['mediafolder'];
        $mFolder = self::$options['MEDIA_ROOT'] . $mediaFolder . '/';
        $mFolderABS = self::$options['MEDIA_ABS_ROOT'] . $mediaFolder . '/';

        $alwaysSelectTag = $berta->settings->get('navigation', 'alwaysSelectTag') == 'yes';

        $tagKeys = array_keys($berta->tags[$section['name']]);
        $notFirstTag = $tag != reset($tagKeys);

        $sectionKeys = array_keys($berta->sections);
        $firstSection = $section['name'] == reset($sectionKeys);

        if(($berta->environment == 'engine' || ($berta->environment == 'site' && !$berta->apacheRewriteUsed)) && !$firstSection) {
            $linkHref = '?section=' . $section['name'];
            if($tag != null && (($alwaysSelectTag && $notFirstTag) || !$alwaysSelectTag)) $linkHref .= '&tag=' . $tag;
        }
        elseif(($berta->environment == 'engine' || ($berta->environment == 'site' && !$berta->apacheRewriteUsed)) && $firstSection) {
            $linkHref = self::$options['SITE_ABS_ROOT'];
            if($tag != null && (($alwaysSelectTag && $notFirstTag) || !$alwaysSelectTag)) $linkHref .= '?section=' . $section['name'] . '&tag=' . $tag;
        }
        elseif($berta->environment == 'site' && $berta->apacheRewriteUsed && !$firstSection) {
            $linkHref = self::$options['SITE_ABS_ROOT'] . $section['name'] . '/';
            if($tag != null && (($alwaysSelectTag && $notFirstTag) || !$alwaysSelectTag)) $linkHref .= $tag . '/';
        }
        elseif($berta->environment == 'site' && $berta->apacheRewriteUsed && $firstSection) {
            $linkHref = self::$options['SITE_ABS_ROOT'];
            if($tag != null && (($alwaysSelectTag && $notFirstTag) || !$alwaysSelectTag)) $linkHref .= $section['name'] . '/' . $tag . '/';
        }

        if($imgs && count($imgs) > 0)
            foreach ($imgs as $img) {
                if($img['@attributes']['type'] == 'image') {
                    $imgSrc = $img['@attributes']['src'];
                	$imgSrc = self::images_getGridImageFor($mFolder . $imgSrc);
                    $returnImages .= '<div class="box"><a href="' . $linkHref . '"><img class="xGridItem" src="' . $mFolderABS . $imgSrc . '" /></a></div>';
                }
            }

        return $returnImages;
    }


}




?>