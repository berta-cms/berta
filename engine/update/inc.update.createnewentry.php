<?

if($decoded['section']) {

	// create media folder name
	$mediafolder = '';
	$mFAddNum = false;
	if($decoded['mediafolder']) $mediafolder = BertaUtils::canonizeString($decoded['mediafolder'], '_');
	if(!$decoded['mediafolder'] || $mediafolder == str_repeat('_', strlen($decoded['mediafolder']))) {
		$mediafolder = $decoded['section'];
		$mFAddNum = true;
	}
	$MFTestNum = 1;
	do {
		$mFTest = $mediafolder . ($mFAddNum ? $MFTestNum : ($MFTestNum > 1 ? ($MFTestNum - 1) : ''));
		$MFTestNum++;
	} while(file_exists($options['MEDIA_ROOT'] . $mFTest));
	$mediafolder = $mFTest;

	$defaultGalleryType = $berta->template->settings->get('entryLayout', 'defaultGalleryType');
	if(!$defaultGalleryType) $defaultGalleryType = 'slideshow';
	
	$FullScreen=$berta->settings->get('entryLayout', 'galleryFullScreenDefault');
	
	// try to create media folder
	//echo realpath($options['MEDIA_ROOT']) . '/' . $mFTest;
	if(@mkdir(realpath($options['MEDIA_ROOT']) . '/' . $mFTest, 0777)) {
		@chmod(realpath($options['MEDIA_ROOT']) . '/' . $mFTest, 0777);
		//echo realpath($options['MEDIA_ROOT']) . $mFTest;
	
		// update xml... 
	
		// find the max entryId and count the empty entries in the section
		$blog = BertaEditor::loadBlog($decoded['section']);
		$maxId = 0;
		$numEmptyEntries = 0;
		if($blog && !empty($blog['entry'])) foreach($blog['entry'] as $idx => $p) {
			if($p['id']['value'] > $maxId) $maxId = (int) $p['id']['value'];
			if(empty($p['updated']['value'])) $numEmptyEntries++;
		}
		
		// check if the maximum allowed amount of emtpy entries hasnt been reached
		//$maxEmptyEntriesAllowed = (int) $berta->settings->get('pageLayout', 'numEmptyEntriesAllowed');
		//if(!$maxEmptyEntriesAllowed) $maxEmptyEntriesAllowed = 3;
		$maxEmptyEntriesAllowed = 2;
		if($numEmptyEntries >= $maxEmptyEntriesAllowed) {
			$returnError = "hey, don't add too many empty entries in this section. you are allowed to create only $maxEmptyEntriesAllowed empty entries.\n\nnow please fill in some content!";
		} else {
		
			// entry basic params
			$entryId = $maxId + 1;
			$uniqId = uniqid();
			$date = date('d.m.Y H:i:s');
			$tags = '<tag/>';
			if(!empty($decoded['tag'])) {
				$allTags = BertaEditor::getTags();
				if(!empty($allTags[$decoded['section']][$decoded['tag']])) $tags = '<tag><![CDATA[' . $allTags[$decoded['section']][$decoded['tag']]['title'] . ']]></tag>'; 
			}
	
			// create xml entry
			$insertXML = <<<EOT
<entry>
	<id>{$entryId}</id>
	<uniqid>{$uniqId}</uniqid>
	<date><![CDATA[{$date}]]></date>
	<tags>{$tags}</tags>
	<content>
		<title/>
		<url/>
		<description/>
	</content>
	<mediafolder>{$mFTest}</mediafolder>
	<mediaCacheData type="{$defaultGalleryType}" fullscreen="{$FullScreen}">
		<file />
	</mediaCacheData>
</entry>
EOT;
	
			// write xml
			$fileName = $options['XML_ROOT'] . str_replace('%', $decoded['section'], $options['blog.%.xml']);
			if(file_exists($fileName)) {
				// insert the new xml fragment into the blog xml
				$xmlStr = file_get_contents($fileName);
		
				if(!empty($decoded['before_entry'])) {
					$e =& BertaEditor::getEntry($decoded['before_entry'], $blog);
					if($e) {
						$firstEntryStarts = strpos($xmlStr, $e['uniqid']['value']);
						$firstEntryStarts = strrpos(substr($xmlStr, 0, $firstEntryStarts), '<entry');
					} else
						$firstEntryStarts = strpos($xmlStr, '</blog>');
				} else
					$firstEntryStarts = strpos($xmlStr, '</blog>');
		
			
		
				if($firstEntryStarts !== false)	// if an existing entry is found, then insert the new one before it
					$xmlStr = substr($xmlStr, 0, $firstEntryStarts) . $insertXML . substr($xmlStr, $firstEntryStarts);
				else 							// otherwise - assume the new one will be the first entry
					$xmlStr = '<?xml version="1.0" encoding="utf-8"?>' . "\n" . 
							  "<blog>\n{$insertXML}</blog>";
						
				file_put_contents($fileName, $xmlStr);
				@chmod($fileName, 0666);
			} else {
				$xmlStr = '<?xml version="1.0" encoding="utf-8"?>' . "\n" . 
						  "<blog>\n{$insertXML}</blog>";
				file_put_contents($fileName, $xmlStr);	
				@chmod($fileName, 0666);
			}
		
		
			$blog = BertaEditor::loadBlog($decoded['section']);
			BertaEditor::updateSectionEntryCount($decoded['section'], $blog);
	
			$returnUpdate['mediafolder'] = $mediafolder;
			$returnUpdate['entryid'] = $entryId;
		}

	} else {
		$returnError = 'cannot create media folder! check permissions.';
	}
}


?>