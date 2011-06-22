<?


class BertaContent extends BertaBase {

	public static function getSections() {
		$sArr = array();
		
		if(file_exists(self::$options['XML_ROOT'] . self::$options['sections.xml'])) {
			$xmlStr = file_get_contents(self::$options['XML_ROOT'] . self::$options['sections.xml']);
		
			if($xmlStr) {
				$xmlFeed = Array_XML::xml2array($xmlStr, 'sections', true);
				if(isset($xmlFeed['section']) && is_array($xmlFeed['section'])) {
					Array_XML::makeListIfNotList($xmlFeed['section']);
					foreach($xmlFeed['section'] as $s) {
						if(!empty($s['name']['value']) && trim($s['name']['value']) != '')
							$sArr[trim($s['name']['value'])] = $s;
					}
				}
			}
		}
		return $sArr;
	}
	
	
	
	
	
	
	public static function loadBlog($sName) {
		
		if($sName) {
			$fileName = self::$options['XML_ROOT'] . str_replace('%', $sName, self::$options['blog.%.xml']);	
			if(file_exists($fileName)) {
				$xmlStr = file_get_contents($fileName);
				$xmlFeed = array();
			
				if($xmlStr) {
					$xmlFeed = Array_XML::xml2array($xmlStr, 'blog', true);
					if(!empty($xmlFeed['entry']) && is_array($xmlFeed['entry']) && empty($xmlFeed['entry'][0])) $xmlFeed['entry'] = array(0 => $xmlFeed['entry']);
				}
				return $xmlFeed;
			}
		}
		
		return false;
	}
	
	public static function &getEntry($entryId, &$blog) {
		foreach($blog['entry'] as $eId => $e) {
			if($eId === '@attributes') continue;
			if($e['id']['value'] == $entryId) {
				return $blog['entry'][$eId];
			}
		}
		
		$retVal = false;
		return $retVal;
	}
	
	public static function &getEntryByUId($entryUId, &$blog) {
		foreach($blog['entry'] as $eId => $e) {
			if($eId === '@attributes') continue;
			if($e['uniqid']['value'] == $entryUId)
				return $blog['entry'][$eId];
		}
		
		$retVal = false;
		return $retVal;
	}
	
	
	
	
	/* ---------------------------------------------------------------------------------------------------------------------- */
	/*  S U B   S E C T I O N S                                                                                                         */
	/* ---------------------------------------------------------------------------------------------------------------------- */
	
	public static function getTags() {
		$ssArr = array();
		$tagsCacheFile = self::$options['XML_ROOT'] . self::$options['tags.xml'];
		
		$xmlStr = file_exists($tagsCacheFile) ? file_get_contents($tagsCacheFile) : '';
		if($xmlStr) {
			$xmlFeed = Array_XML::xml2array($xmlStr, 'sections', true);
			
			if(isset($xmlFeed['section']) && is_array($xmlFeed['section'])) {
				Array_XML::makeListIfNotList($xmlFeed['section']);
				foreach($xmlFeed['section'] as $section) {
					$name = !empty($section['@attributes']['name']) ? $section['@attributes']['name'] : false;
					if($name && isset($section['tag']) && is_array($section['tag'])) {
						Array_XML::makeListIfNotList($section['tag']);
						$ssArr[$name] = array();
						foreach($section['tag'] as $subSection) {
							if(!empty($subSection['@attributes']['name']) && !empty($subSection['value']))
							$ssArr[$name][$subSection['@attributes']['name']] = array(
								'title' => $subSection['value'],
								'entry_count' => !empty($subSection['@attributes']['entry_count']) ? $subSection['@attributes']['entry_count'] : 0
							);
						}
					}
				}
			}
		}
		
		return $ssArr;
	}

	

	
	

	// getXEmpty is in fact and editor function, but because of the way it is used, it lives in BertaContent

	public static function getXEmpty($property) {
		$xEmpty = 'xEmpty';
		return self::$options['logged_in'] ? ('<span class="' . $xEmpty . '">&nbsp;' . $property . '&nbsp;</span>') : '';
	}


}








?>
