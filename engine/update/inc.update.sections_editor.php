<?php

$property = $decoded['property'];

if($property == 'title') {  // section title
    throw new Exception('Deprecated branch of code called for section editor function: Edit title!');
}
else if($property == 'type') {  // section external link
    throw new Exception('Deprecated branch of code called for section editor function: Edit type!');
}
else if($property == 'published') { // attributes
    throw new Exception('Deprecated branch of code called for section editor function: Edit published!');
}
else if($property == 'galleryOrder') {
    throw new Exception('Deprecated branch of code called for section editor function: Background gallery order!');
}
else if($property == 'galleryImageDelete') {
    $sectionsList = BertaEditor::getSections();
    $sName = $decoded['section'];

    $imgToDelete = $posterToDelete = '';
    $returnUpdate = 'failed';
    Array_XML::makeListIfNotList($sectionsList[$sName]['mediaCacheData']['file']);
    foreach($sectionsList[$sName]['mediaCacheData']['file'] as $idx => $im)  {  // check if the passed image is really in mediaCache (a security measure)
        if((string) $idx == '@attributes') continue;
        if($im['@attributes']['src'] == $decoded['value']) {
            $imgToDelete = $im['@attributes']['src'];
            $posterToDelete = !empty($im['@attributes']['poster_frame']) ? $im['@attributes']['poster_frame'] : false;
            unset($sectionsList[$sName]['mediaCacheData']['file'][$idx]);
            break;
        }
    }
    if($imgToDelete && file_exists($options['MEDIA_ROOT'] . $sectionsList[$sName]['mediafolder']['value'] . '/' . $imgToDelete)) {
        if(@unlink($options['MEDIA_ROOT'] . $sectionsList[$sName]['mediafolder']['value'] . '/' . $imgToDelete)) {
            BertaEditor::images_deleteDerivatives($options['MEDIA_ROOT'] . $sectionsList[$sName]['mediafolder']['value'] . '/', $imgToDelete);

            if($posterToDelete) {
                @unlink($options['MEDIA_ROOT'] . $sectionsList[$sName]['mediafolder']['value'] . '/' . $posterToDelete);
                BertaEditor::images_deleteDerivatives($options['MEDIA_ROOT'] . $sectionsList[$sName]['mediafolder']['value'] . '/', $posterToDelete);
            }

            $returnUpdate = 'ok';
        } else
            $returnError = 'delete failed! check permissions.';
    } else
        $returnError = 'file does not exist! media cache updated.';
    BertaEditor::updateImageCacheForSection($sectionsList[$sName]);
    BertaEditor::saveSections($sectionsList);
}
else if($decoded['property'] == 'galleryImageCaption') {    // image / video caption
    $sectionsList = BertaEditor::getSections();
    $sName = $decoded['section'];

    $imageCache =& $sectionsList[$sName]['mediaCacheData']['file'];
    Array_XML::makeListIfNotList($imageCache);
    foreach($imageCache as $cacheIndex => $im) {
        if($im['@attributes']['src'] == $decoded['params']) {
            $imageCache[$cacheIndex]['value'] = $decoded['value'];
            break;
        }
    }
    BertaEditor::updateImageCacheForSection($sectionsList[$sName]);
    BertaEditor::saveSections($sectionsList);
}
else if($decoded['action'] == 'SET_AUTOPLAY') {
    $sectionsList = BertaEditor::getSections();
    $sName = $decoded['section'];
    if(empty($sectionsList[$sName]['mediaCacheData']['@attributes'])) $sectionsList[$sName]['mediaCacheData']['@attributes'] = array();
    if(preg_match('/^\d+$/', $decoded['params'])) {
        if(preg_match('/^[0]+.[1-9]+/', $decoded['params'])) $decoded['params'] = preg_replace('/^[0]+/', '', $decoded['params']);
        $sectionsList[$sName]['mediaCacheData']['@attributes']['autoplay'] = $decoded['params'];
    } else {
        $sectionsList[$sName]['mediaCacheData']['@attributes']['autoplay'] = 0;
    }
    BertaEditor::saveSections($sectionsList);
}
else if($decoded['action'] == 'SET_BG_IMG_SIZE') {
    $sectionsList = BertaEditor::getSections();
    $sName = $decoded['section'];
    if(empty($sectionsList[$sName]['mediaCacheData']['@attributes'])) $sectionsList[$sName]['mediaCacheData']['@attributes'] = array();
    $sectionsList[$sName]['mediaCacheData']['@attributes']['image_size'] = $decoded['params'];
    BertaEditor::saveSections($sectionsList);
}
else if($decoded['action'] == 'SET_BG_CAPTION_COLOR') {
    $sectionsList = BertaEditor::getSections();
    $sName = $decoded['section'];
    if(empty($sectionsList[$sName]['mediaCacheData']['@attributes'])) $sectionsList[$sName]['mediaCacheData']['@attributes'] = array();
    $sectionsList[$sName]['mediaCacheData']['@attributes']['caption_color'] = $decoded['params'];
    BertaEditor::saveSections($sectionsList);
}
else if($decoded['action'] == 'SET_BG_CAPTION_BACK_COLOR') {
    $sectionsList = BertaEditor::getSections();
    $sName = $decoded['section'];
    if(empty($sectionsList[$sName]['mediaCacheData']['@attributes'])) $sectionsList[$sName]['mediaCacheData']['@attributes'] = array();
    $sectionsList[$sName]['mediaCacheData']['@attributes']['caption_bg_color'] = $decoded['params'];
    BertaEditor::saveSections($sectionsList);
}
else if($decoded['action'] == 'SET_BG_NAVIGATION') {
    $sectionsList = BertaEditor::getSections();
    $sName = $decoded['section'];
    if(empty($sectionsList[$sName]['mediaCacheData']['@attributes'])) $sectionsList[$sName]['mediaCacheData']['@attributes'] = array();
    $sectionsList[$sName]['mediaCacheData']['@attributes']['hide_navigation'] = $decoded['params'];
    BertaEditor::saveSections($sectionsList);
}
else if($decoded['action'] == 'SET_BG_ANIMATION') {
    $sectionsList = BertaEditor::getSections();
    $sName = $decoded['section'];
    if(empty($sectionsList[$sName]['mediaCacheData']['@attributes'])) $sectionsList[$sName]['mediaCacheData']['@attributes'] = array();
    $sectionsList[$sName]['mediaCacheData']['@attributes']['animation'] = $decoded['params'];
    BertaEditor::saveSections($sectionsList);
}
else if($decoded['action'] == 'SET_BG_FADE_CONTENT') {
    $sectionsList = BertaEditor::getSections();
    $sName = $decoded['section'];
    if(empty($sectionsList[$sName]['mediaCacheData']['@attributes'])) $sectionsList[$sName]['mediaCacheData']['@attributes'] = array();
    $sectionsList[$sName]['mediaCacheData']['@attributes']['fade_content'] = $decoded['params'];
    BertaEditor::saveSections($sectionsList);
}
else if($decoded['action'] == 'RESET_BG_CAPTION_COLOR') {
    $sectionsList = BertaEditor::getSections();
    $sName = $decoded['section'];
    if(empty($sectionsList[$sName]['mediaCacheData']['@attributes'])) $sectionsList[$sName]['mediaCacheData']['@attributes'] = array();
    $sectionsList[$sName]['mediaCacheData']['@attributes']['caption_color'] = '';
    BertaEditor::saveSections($sectionsList);
}
else if($decoded['action'] == 'RESET_BG_CAPTION_BACK_COLOR') {
    $sectionsList = BertaEditor::getSections();
    $sName = $decoded['section'];
    if(empty($sectionsList[$sName]['mediaCacheData']['@attributes'])) $sectionsList[$sName]['mediaCacheData']['@attributes'] = array();
    $sectionsList[$sName]['mediaCacheData']['@attributes']['caption_bg_color'] = '';
    BertaEditor::saveSections($sectionsList);
}
else if($decoded['action'] == 'sectionBgColorReset') {
    $sectionsList = BertaEditor::getSections();
    $sName = $decoded['section'];
    if(isset($sectionsList[$sName]['sectionBgColor'])) unset($sectionsList[$sName]['sectionBgColor']);
    BertaEditor::saveSections($sectionsList);
}
else if($decoded['action'] == 'ORDER_SECTIONS') {   // apply the new order
    throw new Exception('Deprecated branch of code called for section editor function: Order sections!');
}
else if($decoded['action'] == 'CREATE_NEW_SECTION') {
    throw new Exception('Deprecated branch of code called for section editor function: Crete section!');
}
else if($decoded['action'] == 'DELETE_SECTION') {   // delete a section
    throw new Exception('Deprecated branch of code called for section editor function: Delete section!');
}
else {
    throw new Exception('Deprecated branch of code called for section editor function: Template-specific property update!');
}

?>
