<?php

include_once('class.array_xml.php');

define('SETTINGS_EMPTY', '$$$emptysettingsvalue$$$');

class Settings {
	
	public $settings = array();
	public $settingsDefinition;
	
	public $base;					// the super-settings, that propogate to these settings, if there's not value
	public $templateName;			// name of the template (without version info)
	public $templateFullName;		// full name of the template (the actual folder name with version)
	public $templateVersion;		// version of the template (derived from folder name)
	public $fileName;				// the actual template file name
	
	public function Settings($settingsDefinition, $settingsBaseInstance = false, $templateName = false, $settings = false) {
		$this->settingsDefinition = $settingsDefinition;
		$this->base = $settingsBaseInstance;
		$this->templateFullName = $templateName;
		
		$tParts = explode('-', $templateName);
		$this->templateName = $tParts[0];
		$this->templateVersion = !empty($tParts[1]) ? $tParts[1] : 0;
		
		$this->fileName = $this->templateName ? str_replace('%', $this->templateName, BertaBase::$options['settings.%.xml']) : BertaBase::$options['settings.xml'];
		
		if($settings) {
			$this->settings = $settings;
		} else {
			$this->load();
		}
	}
	

	function load() {
		if(file_exists(BertaBase::$options['XML_ROOT'] . $this->fileName)) {
			if($xml = file_get_contents(BertaBase::$options['XML_ROOT'] . $this->fileName)) {
				$this->settings = Array_XML::xml2array($xml, 'settings');
				return $this->settings;
			}
		}
		return false;
	}
	
	
	public function save() {
		return $this->saveDo($this->settings);
	}
	private function saveDo($settingsCopy) {
		$this->addCDATA($settingsCopy);
		if($xml = Array_XML::array2xml($settingsCopy, 'settings')) {
			if(@file_put_contents(BertaBase::$options['XML_ROOT'] . $this->fileName, $xml) !== false) {
				@chmod(BertaBase::$options['XML_ROOT'] . $this->fileName, 0666);
				return true;
			}
		}
		
		return false;
	}
	private function addCDATA(&$array, $depth = 0) {
		foreach($array as $aId => $child) {
			if(!is_array($child) && trim((string) $child) != '') {
				$array[$aId] = '<![CDATA[' . $child . ']]>';
			}
			//echo $child . ', ' . count($child->children()) . "\r\n";
			//	echo str_repeat('-',$depth).">".$child->getName().": ".$subchild."<br />";
			if(is_array($array[$aId])) $this->addCDATA($array[$aId], $depth + 1);
		}
	}
	
	
	
	public function update($collection, $prop, $value) {
		if(empty($this->settings[$collection])) $this->settings[$collection] = array();
		$this->settings[$collection][$prop] = $value;
		return true;
	}
	
	public function delete($collection, $prop) {
		if(isset($this->settings[$collection][$prop])) unset($this->settings[$collection][$prop]);
		return true;
	}

   	public function getFont($collection) {
		if( isset($this->settings[$collection]['googleFont']) && !empty( $this->settings[$collection]['googleFont']) ) {
			$googleFont=explode(':',$this->settings[$collection]['googleFont']);
			return $googleFont[0];
		}elseif( $collection=='shopItem' ||  $collection=='shopPrice' ){
		
			if( isset($this->settings['shop'][$collection.'googleFont']) && !empty( $this->settings['shop'][$collection.'googleFont']) ) {
				$googleFont=explode(':',$this->settings['shop'][$collection.'googleFont']);
				return $googleFont[0];
			}else{
				return $this->get('shop',$collection.'fontFamily');
			}		
		}else{
			return $this->get($collection,'fontFamily');
		}
	}
	
	public function get($collection, $prop, $useEmptyIfEmpty = false, $inheritBase = true) {
		//echo $collection, $prop, $this->settingsDefinition[$collection][$prop]['default'];
		if(isset($this->settings[$collection][$prop])) {
			$s = trim($this->settings[$collection][$prop]);
			if(!$s && $this->base) $s = trim($this->base->get($collection, $prop, $useEmptyIfEmpty));
			if(!$s && $useEmptyIfEmpty) 
				return $this->getEmpty($prop);
			else
				return $s;
		}
		
		elseif($inheritBase && $this->base && $this->base->exists($collection, $prop)) {
			return trim($this->base->get($collection, $prop, $useEmptyIfEmpty));
		}
	
		elseif(isset($this->settingsDefinition[$collection][$prop]['default'])) {
			return $this->settingsDefinition[$collection][$prop]['default'];
		}
		
		elseif($inheritBase && $this->base && isset($this->base->settingsDefinition[$collection][$prop]['default'])) {
			return $this->base->settingsDefinition[$collection][$prop]['default'];
		}	
		
		elseif($useEmptyIfEmpty) {
			return $this->getEmpty($prop);
		}
			
		else {
			return NULL;
		}
	}
	
	public function getAll($collection, $useEmptyIfEmpty = false) {
		$retArr = array();
		if($collection != 'siteTexts') {
			if(!empty($this->settingsDefinition[$collection])) {
				foreach($this->settingsDefinition[$collection] as $prop => $propDefaults) {
					$retArr[$prop] = $this->get($collection, $prop, $useEmptyIfEmpty);
				}
			}
		} elseif(!empty($this->settings[$collection])) {
			foreach($this->settings[$collection] as $prop => $value) {
				$retArr[$prop] = $value;
			}
		}
		return $retArr;
	}
	
	
	public function getApplied() {
		$defArray = array();
		foreach($this->settingsDefinition as $col => $arr) {
			$defArray[$col] = array();
			foreach($arr as $s => $def) {
				if(!empty($def['default'])) $defArray[$col][$s] = $def['default'];
			}
		}
		$workingArray = array_merge_replace_recursive($defArray, $this->settings);
		
		//if($this->base) print_r($workingArray);
		
		if($this->base) {
			$baseArr = $this->base->getApplied();
			$workingArray = array_merge_replace_recursive($baseArr, $workingArray);
		}
		
		//if($this->base) print_r($workingArray);
		
		return $workingArray;
	}
	
	public function getDefinition($collection, $prop) {
		if(isset($this->settingsDefinition[$collection][$prop])) {
			return $this->settingsDefinition[$collection][$prop];
		} else {
			return null;
		}
	}
	public function getDefinitionParam($collection, $prop, $param) {
		if(isset($this->settingsDefinition[$collection][$prop][$param])) {
			return $this->settingsDefinition[$collection][$prop][$param];
		} else {
			return null;
		}
	}


	
	public function getEmpty($property = false) {
		return BertaContent::getXEmpty($property);
	}
	
	public function exists($collection, $prop) {
		if(isset($this->settings[$collection][$prop]))
			return true;
		
		return false;
	}
	
	public function definitionExists($collection, $prop) {
		if(isset($this->settingsDefinition[$collection][$prop]))
			return true;
		
		return false;
	}
	
	public function isRequired($collection, $prop) {
		if(!isset($this->settingsDefinition[$collection][$prop]))
			return false;
		elseif(!empty($this->settingsDefinition[$collection][$prop]['allow_blank']))
			return false;
		
		return true;
	}
	
	
	
	
	
	
	
	
	public function oppositeAlign($align) {
		switch($align) {
			case 'left': return 'right';
			case 'right': return 'left';
			default: return 'none';
		}
	}
	public function oppositeFloat($float) {
		return $this->oppositeAlign($float);
	}

}





function array_merge_replace_recursive() {
	// Holds all the arrays passed
	$params = & func_get_args ();

	// First array is used as the base, everything else overwrites on it
	$return = array_shift($params);

	// Merge all arrays on the first array
	foreach ( $params as $array ) {
	    foreach ( $array as $key => $value ) {
			// Numeric keyed values are added (unless already there)
			if (is_numeric ( $key ) && (! in_array ( $value, $return ))) {
			   if (is_array ( $value )) {
			       $return [] = array_merge_replace_recursive($return[$key], $value);
			   } else {
			       $return [] = $value;
			   }

			// String keyed values are replaced/appended
			} else {
				if (isset($return[$key]) && is_array($value) && is_array($return[$key])) {
					$return[$key] = array_merge_replace_recursive($return[$key], $value);
				} else {
					$return [$key] = $value;
				}
			}
	    }
	}

	return $return;
}





?>