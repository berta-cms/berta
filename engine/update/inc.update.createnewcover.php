<?php
if($decoded['section']) {

	// create media folder name
	$mediafolder = $decoded['section'].'-cover';

	$MFTestNum = 1;
	do {
		$mFTest = $mediafolder . $MFTestNum;
		$MFTestNum++;
	} while(file_exists($options['MEDIA_ROOT'] . $mFTest));
	$mediafolder = $mFTest;

	// try to create media folder
	if(@mkdir(realpath($options['MEDIA_ROOT']) . '/' . $mediafolder, 0777)) {
		@chmod(realpath($options['MEDIA_ROOT']) . '/' . $mediafolder, 0777);

		// update xml...

		// find the max coverId and count the empty covers in the section
		$blog = BertaEditor::loadBlog($decoded['section']);

		$maxId = 0;
		$numEmptyCovers = 0;
		if($blog && !empty($blog['cover'])) foreach($blog['cover'] as $idx => $p) {
			if($p['id']['value'] > $maxId) $maxId = (int) $p['id']['value'];
			if(empty($p['updated']['value'])) $numEmptyCovers++;
		}

		// check if the maximum allowed amount of emtpy covers hasnt been reached
		$maxEmptyCoversAllowed = 2;
		if($numEmptyCovers >= $maxEmptyCoversAllowed) {
			$returnError = "hey, don't add too many empty covers in this section. you are allowed to create only $maxEmptyCoversAllowed empty entries.\n\nnow please fill in some content!";
		} else {

			// cover basic params
			$coverId = $maxId + 1;
			$uniqId = uniqid();
			$date = date('d.m.Y H:i:s');

			// create xml cover
			$insertXML = <<<EOT
<cover>
	<id>{$coverId}</id>
	<uniqid>{$uniqId}</uniqid>
	<date><![CDATA[{$date}]]></date>
	<content>
		<description/>
	</content>
	<mediafolder>{$mediafolder}</mediafolder>
	<mediaCacheData>
		<file />
	</mediaCacheData>
</cover>
EOT;

			// write xml
			$fileName = $options['XML_ROOT'] . str_replace('%', $decoded['section'], $options['blog.%.xml']);
			if(file_exists($fileName)) {
				// insert the new xml fragment into the blog xml
				$xmlStr = file_get_contents($fileName);

				$lastCoverEnds = strrpos($xmlStr, '</cover>');
				if ($lastCoverEnds !==false) {
					$lastCoverEnds = $lastCoverEnds + 8;
				}

				if ( $lastCoverEnds === false ) {
					$lastCoverEnds = strpos($xmlStr, '<entry>');
				}

				if ( $lastCoverEnds === false ) {
					$lastCoverEnds = strpos($xmlStr, '</blog>');
				}

				if ( $lastCoverEnds !== false ) {
					$xmlStr = substr($xmlStr, 0, $lastCoverEnds) . $insertXML . substr($xmlStr, $lastCoverEnds);
				}else{
					$xmlStr = '<?xml version="1.0" encoding="utf-8"?>' . "\n" .
							  "<blog>\n{$insertXML}</blog>";
				}
			} else {
				$xmlStr = '<?xml version="1.0" encoding="utf-8"?>' . "\n" .
						  "<blog>\n{$insertXML}</blog>";
			}

			file_put_contents($fileName, $xmlStr);
			@chmod($fileName, 0666);

			$returnUpdate['mediafolder'] = $mediafolder;
			$returnUpdate['coverid'] = $coverId;
		}

	} else {
		$returnError = 'cannot create media folder! check permissions.';
	}
}
?>