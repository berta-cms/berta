<?php

include_once '_classes/class.bertaeditor.php';
$sections = BertaEditor::getSections();
if(is_array($sections)) {
	foreach($sections as $sName => $sTitle) {
		$blog = BertaEditor::loadBlog($sName);
		if($blog) {
			
			// ------- ...
			// updates ...
			
			if(empty($blog['@attributes']['version']) && $blog['@attributes']['version'] != $options['version']) {
				
				$ver = array(0, 5, 0);
				if(!empty($blog['@attributes']['version'])) $ver = explode('.', $blog['@attributes']['version']);
				
				// "updated" field for all entries
				if($ver[1] < 6) {
					BertaEditor::setUpdateTimesForAll($blog);
				}
				
				if($ver[1] = 6 && $ver[2] < 6) {
					// replace files with their _orig_ versions.
					
					BertaEditor::updateImageCacheFor($blog);
					
					foreach($blog['entry'] as $eId => $e) {
						if((string) $eId == '@attributes') continue;
						
						$mFolder = Berta::$options['MEDIA_ROOT'] . $e['mediafolder']['value'] . '/';
						$entryCache =& $blog['entry'][$eId]['mediaCacheData'];
						if(count($entryCache)) {
							Array_XML::makeListIfNotList($entryCache['file']);
							foreach($entryCache['file'] as $cacheIndex => $cacheIm) {
								$origSrc = '_orig_' . $cacheIm['@attributes']['src'];
								if(file_exists($mFolder . $origSrc)) {
									if(@unlink($mFolder . $cacheIm['@attributes']['src'])) {
										@rename($mFolder . $origSrc, $mFolder . $cacheIm['@attributes']['src']);
									}
								}
							}
						}
					}
					
				}
				
				// set version
				$blog['@attributes']['version'] = $options['version'];
			}
			
			// update some old settings ...

			$g = $berta->settings->get('settings', 'google-analytics-id');
			if($g) {
				$berta->settings->delete('settings', 'google-analytics-id');
				$berta->settings->update('settings', 'googleAnalyticsId', $g);
				$berta->settings->save();
			}
			
			
			// ------------------------------- ...
			// clean-up and files organisation ...
			
			BertaEditor::populateTags($sName, $blog);
			BertaEditor::updateImageCacheFor($blog);
			BertaEditor::saveBlog($sName, $blog);
		}
	}
}


?>