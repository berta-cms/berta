<?php
namespace App\Shared;

use App\Shared\Storage;

class ImageHelpers
{
    /**
     * Returns single gallery image with additional options for frontend
     *
     * @param array $image Single image
     * @param float $sizeRatio Range 0 - 1
     * @param array $entry Single entry
     * @param Storage $storageService
     * @param array $siteSettings
     * @return null|array
     */
    public static function getGalleryImage(
        array $image,
        $sizeRatio,
        array $entry,
        Storage $storageService,
        array $siteSettings
    )
    {
        // Ratio is calculated only for mashup template first page marked entries
        // isset($this->siteTemplateSettings['firstPage']['imageSizeRatio']) ? $this->siteTemplateSettings['firstPage']['imageSizeRatio'] : 1;
        if ($sizeRatio <= 0) {
            $sizeRatio = 1;
        }

        $isImage = isset($image['@attributes']['type']) && $image['@attributes']['type'] == 'image';
        $isPoster = isset($image['@attributes']['poster_frame']);
        $imageName = $isPoster ? $image['@attributes']['poster_frame'] : $image['@attributes']['src'];

        if (!$isImage && !$isPoster) {
            return null;
        }

        $alt = null;
        $caption = null;
        $width = null;
        $height = null;
        $srcset = null;
        $imagePath = $storageService->MEDIA_ROOT . '/' . $entry['mediafolder'] . '/';
        $imageUrlPath = $storageService->MEDIA_URL . '/' . $entry['mediafolder'] . '/';

        if (isset($image['@value'])) {
            $alt = str_replace(array("\r\n", "\n"), " ", $image['@value']);
            $alt = trim(preg_replace('/\s\s+/', ' ', htmlspecialchars(strip_tags($alt))));
            $caption = $image['@value'];
        }

        if (isset($image['@attributes']['width']) && isset($image['@attributes']['height'])) {
            $width = (int) $image['@attributes']['width'];
            $height = (int) $image['@attributes']['height'];
        }

        if ($isPoster || !$width || !$height) {
            $imageSize = getimagesize($imagePath . $imageName);
            if ($imageSize) {
                $width = (int) $imageSize[0];
                $height = (int) $imageSize[1];
            }
        }

        $imageSize = isset($entry['mediaCacheData']['@attributes']['size']) ? $entry['mediaCacheData']['@attributes']['size'] : 'large';

        $imageTargetWidth = $siteSettings['media']['images' . ucfirst($imageSize) . 'Width'];
        $imageTargetHeight = $siteSettings['media']['images' . ucfirst($imageSize) . 'Height'];

        $widthOriginal = $width;
        $heightOriginal = $height;
        $imageNameOriginal = $imageName;

        if ($width && $height && $imageTargetWidth && $imageTargetHeight && ($width > $imageTargetWidth || $height > $imageTargetHeight)) {

            list($width, $height) = self::fitInBounds($width, $height, $imageTargetWidth, $imageTargetHeight);

            $imageName = self::getResizedSrc($imagePath, $imageName, $width, $height);

            // start generate image for 2x displays
            $imageTargetWidth2x = $width * 2;
            $imageTargetHeight2x = $height * 2;
            if ($widthOriginal && $heightOriginal && $imageTargetWidth2x && $imageTargetHeight2x && ($widthOriginal >= $imageTargetWidth2x || $heightOriginal >= $imageTargetHeight2x)) {
                list($width2x, $height2x) = self::fitInBounds($widthOriginal, $heightOriginal, $imageTargetWidth2x, $imageTargetHeight2x);
                $imageName2x = self::getResizedSrc($imagePath, $imageNameOriginal, $width2x, $height2x);
                $srcset = $imageUrlPath . $imageName . ' 1x, ' . $imageUrlPath . $imageName2x . ' 2x';
            }
            // end generate image for 2x displays
        }

        return [
            'src' => $imageUrlPath . $imageName,
            'width' => $width,
            'height' => $height,
            'srcset' => $srcset,
            'alt' => $alt,
            'caption' => $caption,
        ];
    }

    public static function fitInBounds($w, $h, $boundsW, $boundsH)
    {
        $rw = $w / $boundsW;
        $rh = $h / $boundsH;

        if ($rw > $rh) {
            $newH = round($h / $rw);
            $newW = $boundsW;
        } else {
            $newW = round($w / $rh);
            $newH = $boundsH;
        }

        return array($newW, $newH);
    }

    public static function getResizedSrc($folder, $src, $w, $h)
    {
        $newSrc = '_' . $w . 'x' . $h . '_' . $src;
        if (file_exists($folder . $newSrc) || self::createThumbnail($folder . $src, $folder . $newSrc, $w, $h)) {
            return $newSrc;
        } else {
            return $src;
        }
    }

    private static function createThumbnail($imagePath, $thumbPath, $thumbWidth, $thumbHeight)
    {
        if (is_file($imagePath)) {
            $imageInfo = getimagesize($imagePath);

            $canMakeThumb = function_exists('imagejpeg') &&
                (($imageInfo[2] == IMAGETYPE_GIF && function_exists('imagecreatefromgif')) ||
                ($imageInfo[2] == IMAGETYPE_JPEG && function_exists('imagecreatefromjpeg')) ||
                ($imageInfo[2] == IMAGETYPE_PNG && function_exists('imagecreatefrompng')));

            if ($canMakeThumb) {

                if ($thumbWidth && !$thumbHeight) {
                    $thumbHeight = ($thumbWidth / $imageInfo[0]) * $imageInfo[1];
                } elseif (!$thumbWidth && $thumbHeight) {
                    $thumbWidth = ($thumbHeight / $imageInfo[1]) * $imageInfo[0];
                }

                $imageThumb = self::smart_resize_image($imagePath, $thumbWidth, $thumbHeight, false, 'return', false);
                if ($imageThumb) {
                    switch ($imageInfo[2]) {
                        case IMAGETYPE_GIF:
                            // Don't resize animated gifs
                            if (self::is_animated($imagePath)) {
                                copy($imagePath, $thumbPath);
                            } else {
                                imagegif($imageThumb, $thumbPath);
                            }
                            break;
                        case IMAGETYPE_JPEG:
                            imagejpeg($imageThumb, $thumbPath, 97);
                            break;
                        case IMAGETYPE_PNG:
                            imagepng($imageThumb, $thumbPath);
                            break;
                        default:
                            return false;
                    }
                    if (file_exists($thumbPath)) {
                        @chmod($thumbPath, 0666);
                    }

                    return true;
                }
            }
        }

        return false;
    }

    // credit to Maxim Chernyak
    // http://mediumexposure.com/techblog/smart-image-resizing-while-preserving-transparency-php-and-gd-library
    private static function smart_resize_image(
        $file,
        $width = 0,
        $height = 0,
        $proportional = false,
        $output = 'file',
        $delete_original = true,
        $use_linux_commands = false) {

        if ($height <= 0 && $width <= 0) {
            return false;
        }

        # Setting defaults and meta
        $info = getimagesize($file);
        $image = '';
        $final_width = 0;
        $final_height = 0;
        list($width_old, $height_old) = $info;

        # Calculating proportionality
        if ($proportional) {
            if ($width == 0) {
                $factor = $height / $height_old;
            } elseif ($height == 0) {
                $factor = $width / $width_old;
            } else {
                $factor = min($width / $width_old, $height / $height_old);
            }

            $final_width = round($width_old * $factor);
            $final_height = round($height_old * $factor);
        } else {
            $final_width = round(($width <= 0) ? $width_old : $width);
            $final_height = round(($height <= 0) ? $height_old : $height);
        }

        # Loading image to memory according to type
        switch ($info[2]) {
            case IMAGETYPE_GIF:$image = imagecreatefromgif($file);
                break;
            case IMAGETYPE_JPEG:$image = imagecreatefromjpeg($file);
                break;
            case IMAGETYPE_PNG:$image = imagecreatefrompng($file);
                break;
            default:return false;
        }

        // Don't resize animated gifs
        if ($info[2] == IMAGETYPE_GIF && self::is_animated($file)) {

            $image_resized = imagecreatefromgif($file);

        } else {
            # This is the resizing/resampling/transparency-preserving magic
            $image_resized = imagecreatetruecolor($final_width, $final_height);
            if (($info[2] == IMAGETYPE_GIF) || ($info[2] == IMAGETYPE_PNG)) {
                $transparency = imagecolortransparent($image);

                if ($transparency >= 0) {
                    $transparent_color = @imagecolorsforindex($image, $transparency); // for animated gifs sometimes error is thrown :(
                    $transparency = imagecolorallocate($image_resized, $transparent_color['red'], $transparent_color['green'], $transparent_color['blue']);
                    imagefill($image_resized, 0, 0, $transparency);
                    imagecolortransparent($image_resized, $transparency);
                } elseif ($info[2] == IMAGETYPE_PNG) {
                    imagealphablending($image_resized, false);
                    $color = imagecolorallocatealpha($image_resized, 0, 0, 0, 127);
                    imagefill($image_resized, 0, 0, $color);
                    imagesavealpha($image_resized, true);
                }
            }
            imagecopyresampled($image_resized, $image, 0, 0, 0, 0, $final_width, $final_height, $width_old, $height_old);
        }

        # Taking care of original, if needed
        if ($delete_original) {
            if ($use_linux_commands) {
                exec('rm ' . $file);
            } else {
                @unlink($file);
            }

        }

        # Preparing a method of providing result
        switch (strtolower($output)) {
            case 'browser':
                $mime = image_type_to_mime_type($info[2]);
                header("Content-type: $mime");
                $output = null;
                break;
            case 'file':
                $output = $file;
                break;
            case 'return':
                return $image_resized;
                break;
            default:
                break;
        }

        # Writing image according to type to the output destination
        switch ($info[2]) {
            case IMAGETYPE_GIF:
                imagegif($image_resized, $output);
                break;
            case IMAGETYPE_JPEG:
                imagejpeg($image_resized, $output, 97);
                break;
            case IMAGETYPE_PNG:
                imagepng($image_resized, $output);
                break;
            default:
                return false;
        }

        return true;
    }

    private static function is_animated($filename)
    {

        if (!($fh = @fopen($filename, 'rb'))) {
            return false;
        }
        $count = 0;
        //an animated gif contains multiple "frames", with each frame having a
        //header made up of:
        // * a static 4-byte sequence (\x00\x21\xF9\x04)
        // * 4 variable bytes
        // * a static 2-byte sequence (\x00\x2C) (some variants may use \x00\x21 ?)

        // We read through the file til we reach the end of the file, or we've found
        // at least 2 frame headers
        while (!feof($fh) && $count < 2) {
            $chunk = fread($fh, 1024 * 100); //read 100kb at a time
            $count += preg_match_all('#\x00\x21\xF9\x04.{4}\x00(\x2C|\x21)#s', $chunk, $matches);
        }
        fclose($fh);

        return $count > 1;
    }
}
