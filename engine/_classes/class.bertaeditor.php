<?php
class BertaEditor extends BertaContent
{
    public static function getSectionMediafolder($sName)
    {
        $mediaRoot = self::$options['MEDIA_ROOT'];
        $sectionMfName = $sName . '-background';

        if (file_exists($mediaRoot . $sectionMfName) && is_dir($mediaRoot . $sectionMfName)) {
            $MFTestNum = 1;
            do {
                $mFTest = $sectionMfName . $MFTestNum;
                $MFTestNum++;
            } while (file_exists($mediaRoot . $mFTest));

            $sectionMfName = $mFTest;
        }

        return $sectionMfName;
    }

    public static function saveSections($sections)
    {
        $sectionsToSave = ['section' => []];
        foreach ($sections as $s) {
            $sectionsToSave['section'][] = $s;
        }

        Array_XML::addCDATA($sectionsToSave);
        if ($xml = Array_XML::array2xml($sectionsToSave, 'sections')) {
            $fileName = self::$options['XML_ROOT'] . self::$options['sections.xml'];
            file_put_contents($fileName, $xml);
            @chmod($fileName, 0666);
            return true;
        }
    }

    public static function saveBlog($sName, &$blog)
    {
        if (empty($blog['@attributes'])) {
            $blog['@attributes'] = [];
        }
        if (empty($blog['@attributes']['section'])) {
            $blog['@attributes']['section'] = $sName;
        }

        $blog['@attributes']['last_upd_ver'] = self::$options['version'];

        $blogCopy = array_copy($blog);
        Array_XML::addCDATA($blogCopy);

        if ($xml = Array_XML::array2xml($blogCopy, 'blog')) {
            $xml_file = self::$options['XML_ROOT'] . str_replace('%', $sName, self::$options['blog.%.xml']);
            $fp = fopen($xml_file, 'w');
            if (flock($fp, LOCK_EX)) {
                fwrite($fp, $xml);
                @chmod($xml_file, 0666);
                flock($fp, LOCK_UN);
                fclose($fp);
            } else {
                throw new \Exception('Could not write locked file: ' . $xml_file);
            }
            return true;
        }
    }

    public static function saveTags($tags, $sectionsList = false)
    {
        $arrayToSave = ['section' => []];
        foreach ($tags as $sName => $s) {
            if (!$sectionsList || isset($sectionsList[$sName])) {
                $sectionTags = [];
                $c = 0;
                foreach ($s as $tName => $t) {
                    $sectionTags[] = ['@attributes' => ['name' => $tName, 'entry_count' => $t['entry_count']], 'value' => $t['title']];
                    $c += (int) $t['entry_count'];
                }
                $arrayToSave['section'][] = ['@attributes' => ['name' => $sName, 'entry_count' => $c], 'tag' => $sectionTags];
            }
        }
        Array_XML::addCDATA($arrayToSave);

        if ($xml = Array_XML::array2xml($arrayToSave, 'sections')) {
            $fileName = self::$options['XML_ROOT'] . self::$options['tags.xml'];
            if (@file_put_contents($fileName, $xml)) {
                @chmod($fileName, 0666);
                return true;
            }
        }

        return false;
    }

    public static function populateTags($sectionName, &$blog)
    {
        $tagsArr = BertaEditor::getTags();

        $newCache = [];
        $allHaveTags = true;
        if (isset($blog['entry']) && !empty($blog['entry'])) {
            foreach ($blog['entry'] as $eId => $e) {
                if ($eId === '@attributes') {
                    continue;
                }
                $hasTags = false;
                if (isset($e['tags'])) {
                    Array_XML::makeListIfNotList($e['tags']['tag']);
                    foreach ($e['tags']['tag'] as $t) {
                        if ($tName = trim((string) $t['value'])) {
                            $tName = strtolower(BertaUtils::canonizeString($tName, '-', '-'));

                            $c = isset($newCache[$tName]) ? $newCache[$tName]['entry_count'] : 0;
                            $newCache[$tName] = ['title' => $t['value'], 'entry_count' => ++$c];

                            $hasTags = true;
                        }
                    }
                }

                $allHaveTags &= $hasTags;
            }
        }

        //to keep sorting order, we need to check old and new tag arrays
        //loop through old and check if exists and update, else do not add
        $tempCache = [];
        if (isset($tagsArr[$sectionName])) {
            foreach ($tagsArr[$sectionName] as $tag => $tagVars) {
                if (isset($newCache[$tag])) {
                    $tempCache[$tag] = $newCache[$tag];
                }
            }
        }

        //loop through new and check if exists, if not - add at bottom
        foreach ($newCache as $tag => $tagVars) {
            if (!isset($tagsArr[$sectionName][$tag])) {
                $tempCache[$tag] = $tagVars;
            }
        }

        $tagsArr[$sectionName] = $tempCache;

        // update direct content property
        $sectionsList = BertaEditor::getSections();
        if (!empty($sectionsList[$sectionName])) {
            if (empty($sectionsList[$sectionName]['@attributes'])) {
                $sectionsList[$sectionName]['@attributes'] = [];
            }
            $sectionsList[$sectionName]['@attributes']['has_direct_content'] = !$allHaveTags ? '1' : '0';
        }
        BertaEditor::saveSections($sectionsList);

        // save subsections list
        BertaEditor::saveTags($tagsArr, $sectionsList);

        return $tagsArr;
    }

    public static function updateImageCacheForSection(&$section)
    {
        if (!empty($section)) {
            $mediaFiles = [];
            if (!empty($section['mediafolder']['value'])) {
                $mediaFiles = BertaEditor::gatherMediaFilesIn($section['mediafolder']['value']);
            }

            if ($mediaFiles) {
                $sectionCache = &$section['mediaCacheData'];

                if (!count($sectionCache) || empty($sectionCache['file'])) {
                    // if the media cache is empty, create a fresh array
                    $mediaCacheData = ['file' => []];
                    if (isset($section['mediaCacheData'])) {
                        $mediaCacheData = array_merge($section['mediaCacheData'], $mediaCacheData);
                    }
                    $section['mediaCacheData'] = $mediaCacheData;

                    $sectionCache = &$section['mediaCacheData'];
                    foreach ($mediaFiles as $im) {
                        $attr = ['type' => $im['type'], 'src' => $im['src']];
                        if (!empty($im['poster_frame'])) {
                            $attr['poster_frame'] = $im['poster_frame'];
                        }
                        if (!empty($im['width'])) {
                            $attr['width'] = $im['width'];
                        }
                        if (!empty($im['height'])) {
                            $attr['height'] = $im['height'];
                        }
                        $sectionCache['file'][] = ['value' => '', '@attributes' => $attr];
                    }

                    // if moving from an older version of XML
                    unset($sectionCache['images'], $sectionCache['videos']);
                } else {
                    Array_XML::makeListIfNotList($sectionCache['file']);

                    // first check if all items in cache are still inside the folder
                    foreach ($sectionCache['file'] as $cacheIndex => $cacheIm) {
                        // try to find the entry among the files in the folder
                        $foundIndex = false;
                        foreach ($mediaFiles as $i => $im) {
                            // *** compatibility with versions <= 0.5.5b
                            if (isset($cacheIm)) {
                                $isFromOldVersion = empty($cacheIm['@attributes']['src']);
                                $srcFromCache = $isFromOldVersion ? $cacheIm['value'] : $cacheIm['@attributes']['src'];

                                // if image found in cache, update cache entry
                                if ($srcFromCache == $im['src']) {
                                    $foundIndex = true;
                                    $_section = ['@attributes' => []];
                                    if (!$isFromOldVersion) {
                                        $_section['value'] = !empty($cacheIm['value']) ? $cacheIm['value'] : '';
                                    }
                                    if (!empty($cacheIm['@attributes'])) {
                                        $_section['@attributes'] = $cacheIm['@attributes'];
                                    }
                                    $_section['@attributes']['src'] = $im['src'];

                                    $_section['@attributes']['type'] = $im['type'];
                                    if (!empty($im['poster_frame'])) {
                                        $_section['@attributes']['poster_frame'] = $im['poster_frame'];
                                    }
                                    if (!empty($im['width'])) {
                                        $_section['@attributes']['width'] = $im['width'];
                                    }
                                    if (!empty($im['height'])) {
                                        $_section['@attributes']['height'] = $im['height'];
                                    }

                                    $sectionCache['file'][$cacheIndex] = $_section;

                                    unset($mediaFiles[$i]);
                                    break;
                                }
                            }
                        }

                        // if the file was not found in the folder, delete the entry
                        if (!$foundIndex) {
                            unset($sectionCache['file'][$cacheIndex]);
                        }
                    }

                    // loop through the rest of real files and add them to cache
                    foreach ($mediaFiles as $im) {
                        $attr = ['type' => $im['type'], 'src' => $im['src']];
                        if (!empty($im['poster_frame'])) {
                            $attr['poster_frame'] = $im['poster_frame'];
                        }
                        if (!empty($im['width'])) {
                            $attr['width'] = $im['width'];
                        }
                        if (!empty($im['height'])) {
                            $attr['height'] = $im['height'];
                        }
                        $sectionCache['file'][] = ['value' => '', '@attributes' => $attr];
                    }

                    // compact arrays
                    $sectionCache['file'] = array_values($sectionCache['file']);

                    // if moving from an older version of XML
                    unset($sectionCache['images'], $sectionCache['videos']);
                }
            } else {
                $mediaCacheData = ['file' => []];

                if (isset($section['mediaCacheData'])) {
                    $mediaCacheData = array_merge($section['mediaCacheData'], $mediaCacheData);
                }

                $section['mediaCacheData'] = $mediaCacheData;
            }
        }
    }

    public static function updateImageCacheFor(&$blog, $entryId = false)
    {
        if (!empty($blog['entry'])) {
            foreach ($blog['entry'] as $eId => $e) {
                if ((string) $eId == '@attributes') {
                    continue;
                }
                if (!$entryId || (!empty($e['id']['value']) && $entryId == $e['id']['value'])) {
                    $mediaFiles = [];
                    if (!empty($e['mediafolder']['value'])) {
                        $mediaFiles = BertaEditor::gatherMediaFilesIn($e['mediafolder']['value']);
                    }

                    if ($mediaFiles) {
                        $entryCache = &$blog['entry'][$eId]['mediaCacheData'];

                        if (!count($entryCache) || empty($entryCache['file'])) {
                            // if the media cache is empty, create a fresh array
                            $mediaCacheData = ['file' => []];
                            if (isset($blog['entry'][$eId]['mediaCacheData'])) {
                                $mediaCacheData = array_merge($blog['entry'][$eId]['mediaCacheData'], $mediaCacheData);
                            }
                            $blog['entry'][$eId]['mediaCacheData'] = $mediaCacheData;

                            $entryCache = &$blog['entry'][$eId]['mediaCacheData'];
                            foreach ($mediaFiles as $im) {
                                $attr = ['type' => $im['type'], 'src' => $im['src']];
                                if (!empty($im['poster_frame'])) {
                                    $attr['poster_frame'] = $im['poster_frame'];
                                }
                                if (!empty($im['width'])) {
                                    $attr['width'] = $im['width'];
                                }
                                if (!empty($im['height'])) {
                                    $attr['height'] = $im['height'];
                                }
                                $entryCache['file'][] = ['value' => '', '@attributes' => $attr];
                            }

                            // if moving from an older version of XML
                            unset($entryCache['images'], $entryCache['videos']);
                        } else {
                            Array_XML::makeListIfNotList($entryCache['file']);

                            // first check if all items in cache are still inside the folder
                            foreach ($entryCache['file'] as $cacheIndex => $cacheIm) {
                                // try to find the entry among the files in the folder
                                $foundIndex = false;
                                foreach ($mediaFiles as $i => $im) {
                                    // *** compatibility with versions <= 0.5.5b
                                    $isFromOldVersion = empty($cacheIm['@attributes']['src']);
                                    $srcFromCache = $isFromOldVersion ? $cacheIm['value'] : $cacheIm['@attributes']['src'];

                                    // if image found in cache, update cache entry
                                    if ($srcFromCache == $im['src']) {
                                        $foundIndex = true;
                                        $entry = ['@attributes' => []];
                                        if (!$isFromOldVersion) {
                                            $entry['value'] = !empty($cacheIm['value']) ? $cacheIm['value'] : '';
                                        }
                                        if (!empty($cacheIm['@attributes'])) {
                                            $entry['@attributes'] = $cacheIm['@attributes'];
                                        }
                                        $entry['@attributes']['src'] = $im['src'];

                                        $entry['@attributes']['type'] = $im['type'];
                                        if (!empty($im['poster_frame'])) {
                                            $entry['@attributes']['poster_frame'] = $im['poster_frame'];
                                        }
                                        if (!empty($im['width'])) {
                                            $entry['@attributes']['width'] = $im['width'];
                                        }
                                        if (!empty($im['height'])) {
                                            $entry['@attributes']['height'] = $im['height'];
                                        }

                                        $entryCache['file'][$cacheIndex] = $entry;

                                        unset($mediaFiles[$i]);
                                        break;
                                    }
                                }

                                // if the file was not found in the folder, delete the entry
                                if (!$foundIndex) {
                                    unset($entryCache['file'][$cacheIndex]);
                                }
                            }

                            // loop through the rest of real files and add them to cache
                            foreach ($mediaFiles as $im) {
                                $attr = ['type' => $im['type'], 'src' => $im['src']];
                                if (!empty($im['poster_frame'])) {
                                    $attr['poster_frame'] = $im['poster_frame'];
                                }
                                if (!empty($im['width'])) {
                                    $attr['width'] = $im['width'];
                                }
                                if (!empty($im['height'])) {
                                    $attr['height'] = $im['height'];
                                }
                                $entryCache['file'][] = ['value' => '', '@attributes' => $attr];
                            }

                            // compact arrays
                            $entryCache['file'] = array_values($entryCache['file']);

                            // if moving from an older version of XML
                            unset($entryCache['images'], $entryCache['videos']);
                        }
                    } else {
                        $mediaCacheData = ['file' => []];
                        if (isset($blog['entry'][$eId]['mediaCacheData'])) {
                            $mediaCacheData = array_merge($blog['entry'][$eId]['mediaCacheData'], $mediaCacheData);
                        }
                        $blog['entry'][$eId]['mediaCacheData'] = $mediaCacheData;
                    }
                }
            }
        }
    }

    public static function gatherMediaFilesIn($folderName)
    {
        $imageExtensions = ['jpg', 'jpeg', 'jpe', 'gif', 'giff', 'png'];
        $videoExtensions = ['mov', 'flv', 'f4v', 'avi', 'mpg', 'mpeg', 'mpe', 'mp4'];
        $flashExtensions = ['swf'];

        $mediaArr = [];
        $mediaIdx = 0;
        $mediaFolder = self::$options['MEDIA_ROOT'] . $folderName . '/';

        if (file_exists($mediaFolder)) {
            $d = dir($mediaFolder);
            $images = [];
            $imageNames = [];
            $imageInfos = [];
            $videos = [];
            $swfs = [];
            $swfInfos = [];

            while (false !== ($f = $d->read())) {
                if ($f != '.' && $f != '..' && substr($f, 0, 1) != '_') {
                    $ext = strtolower(substr(strrchr($f, '.'), 1));
                    if (in_array($ext, $imageExtensions)) {
                        $images[] = $f;
                        $imageNames[] = substr($f, 0, strrpos($f, '.'));
                        $imageInfos[] = getimagesize($mediaFolder . $f);
                    } elseif (in_array($ext, $videoExtensions)) {
                        $videos[] = $f;
                    } elseif (in_array($ext, $flashExtensions)) {
                        $swfs[] = $f;
                        $swfInfos[] = getimagesize($mediaFolder . $f);
                    }
                }
            }

            foreach ($videos as $f) {
                $mediaArr[$mediaIdx] = ['type' => 'video', 'src' => $f];

                $fName = substr($f, 0, strrpos($f, '.'));
                $imageIndex = array_search($fName, $imageNames);
                if ($imageIndex !== false) {
                    $mediaArr[$mediaIdx]['poster_frame'] = $images[$imageIndex];
                    $mediaArr[$mediaIdx]['width'] = $imageInfos[$imageIndex][0];
                    $mediaArr[$mediaIdx]['height'] = $imageInfos[$imageIndex][1];
                    array_splice($imageNames, $imageIndex, 1);
                    array_splice($images, $imageIndex, 1);
                    array_splice($imageInfos, $imageIndex, 1);
                }

                $mediaIdx++;
            }

            foreach ($swfs as $idx => $f) {
                $mediaArr[$mediaIdx] = ['type' => 'flash', 'src' => $f, 'width' => $swfInfos[$idx][0], 'height' => $swfInfos[$idx][1]];
                $mediaIdx++;
            }

            foreach ($images as $idx => $f) {
                $mediaArr[$mediaIdx] = ['type' => 'image', 'src' => $f, 'width' => $imageInfos[$idx][0], 'height' => $imageInfos[$idx][1]];
                $mediaIdx++;
            }

            if (!function_exists('mediaArrCmp')) {
                function mediaArrCmp($m1, $m2)
                {
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

    public static function images_getSmallThumbFor($imgPathInMediaFolder)
    {
        $imagePath = self::$options['MEDIA_ROOT'] . $imgPathInMediaFolder;
        $fileName = basename($imgPathInMediaFolder);

        $dirName = dirname($imgPathInMediaFolder);
        if ($dirName) {
            $dirName .= '/';
        }

        $thumbPath = self::$options['MEDIA_ROOT'] . $dirName . self::$options['images']['small_thumb_prefix'] . $fileName;
        $thumbnailURL = self::$options['MEDIA_URL'] . $dirName . self::$options['images']['small_thumb_prefix'] . $fileName;

        if (file_exists($thumbPath)) {
            return $thumbnailURL;
        } elseif (BertaGallery::createThumbnail($imagePath, $thumbPath, self::$options['images']['small_thumb_width'], self::$options['images']['small_thumb_height'])) {
            return $thumbnailURL;
        }

        return false;
    }

    public static function images_deleteDerivatives($folder, $file = '')
    {
        if ($handle = opendir($folder)) {
            /* This is the correct way to loop over the directory. */

            while (false !== ($f = readdir($handle))) {
                if (!$file || strpos($f, $file) !== false) {
                    if (substr($f, 0, 1) == '_') {
                        @unlink($folder . $f);
                    }
                }
            }

            closedir($handle);
        }
    }

    public static function getXEmpty($property)
    {
        return parent::getXEmpty($property);
    }

    public static function getSettingsItemEditHTML($property, $sDef, $value, $additionalParams = null, $tag = 'div', $path = '')
    {
        global $editsForSettings;

        $pStr = '';
        if ($additionalParams) {
            foreach ($additionalParams as $pN => $p) {
                $pStr .= $pN . (!is_null($p) ? ('-' . $p) : '') . ' ';
            }
        }
        $html = '';

        if (!empty($sDef['html_before'])) {
            $html .= $sDef['html_before'];
        }

        $html .= '<' . $tag . ' class="value ' . (!empty($editsForSettings[$sDef['format']]) ? $editsForSettings[$sDef['format']] : '') . ' ' .
                          'xProperty-' . $property . ' ' .
                          (empty($sDef['html_entities']) ? 'xNoHTMLEntities' : '') . ' ' .
                          'xCSSUnits-' . (empty($sDef['css_units']) ? '0' : '1') . ' ' .
                          (empty($sDef['link']) ? '' : 'xLink') . ' ' .
                          'xRequired-' . (!empty($sDef['allow_blank']) ? '0' : '1') . ' ' .
                          (!empty($sDef['validator']) ? 'xValidator-' . $sDef['validator'] . ' ' : '') .
                          $pStr .
                   '" title="' . htmlspecialchars($sDef['default'] ?? '') . '"';

        if (!empty($path)) {
            $html .= ' data-path="' . $path . '"';
        }

        if ($sDef['format'] == 'select' || $sDef['format'] == 'fontselect') {
            $values = [];
            if ($sDef['values'] == 'templates') {
                $values = BertaTemplate::getAllTemplates();
            } else {
                foreach ($sDef['values'] as $vK => $vV) {
                    $values[$vK] = is_string($vK) ? ($vK . '|' . $vV) : $vV;
                }
            }
            $html .= ' x_options="' . htmlspecialchars(implode('||', $values)) . '"';
            $value = isset($values[$value]) && !intval($value) > 0 ? $sDef['values'][$value] : $value;
        }

        $html .= '>';
        $html .= $value . '</' . $tag . '>';

        if (!empty($sDef['html_after'])) {
            $html .= $sDef['html_after'];
        }

        return $html;
    }
}
