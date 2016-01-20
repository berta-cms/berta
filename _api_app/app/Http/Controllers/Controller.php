<?php 

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
	private $XML_MAIN_ROOT;
	private $XML_SITES_ROOT;

    public function __construct() {
    	$this->XML_MAIN_ROOT = realpath(__DIR__ . '/../../../../storage');
        $this->XML_SITES_ROOT = $this->XML_MAIN_ROOT . '/-sites';
    }

	/************************************************************
	 * Protected methods
	 ************************************************************/

    protected function getSites() {
    	$xml_file = $this->XML_SITES_ROOT . '/sites.xml';
    	return $this->xmlFile2array($xml_file);
    }

    protected function getSectionsBySite($site) {
		$xml_root = $his->getSiteXmlRoot($site);
		$xml_file = $xml_root . '/sections.xml';
		return $this->xmlFile2array($xml_file);
	}

	protected function getTagsBySite($site) {
		$xml_root = $this->getSiteXmlRoot($site);
		$xml_file = $xml_root . '/tags.xml';
		return $this->xmlFile2array($xml_file);
	}

	/************************************************************
	 * Private methods
	 ************************************************************/

    private function getSiteXmlRoot($site) {
    	return empty($site) ? $this->XML_MAIN_ROOT : $this->XML_SITES_ROOT . '/' .$site;
    }

    private function array2xmlFile($arr, $root) {
    	$xml = new \DOMDocument('1.0', 'utf-8');
    	
    	$this->_array2xml($xml, $root, $arr);
    	return $xml;
    }

    private function xmlFile2array($xml_file) {
    	if(file_exists($xml_file)) {
			$xml_str = file_get_contents($xml_file);
  			$xml = new \DOMDocument('1.0', 'utf-8');
    		$xml->formatOutput = true;
    		$parsed = $xml->loadXML($xml_str);

    		if(!$parsed) {
    			throw new Exception('Error parsing the XML string!');
    		}

    		$array[$xml->documentElement->tagName] = $this->xml2array($xml->documentElement);
    		die(var_export($array));
    	}

    	return array();
    }

    private $level = 0;

    private function xml2array($node) {
    	$output = array();
 
		switch ($node->nodeType) {
			case XML_CDATA_SECTION_NODE:

			case XML_TEXT_NODE:
				$output = trim($node->textContent);
				break;
 
			case XML_ELEMENT_NODE: 
				// for each child node, call the covert function recursively
				for ($i=0; $i<$node->childNodes->length; $i++) {
					$child = $node->childNodes->item($i);
					$subtree = $this->xml2array($child);
					
					if(isset($child->tagName)) {
						$tag_name = $child->tagName;
 
						// assume more nodes of same kind are coming
						if(!isset($output[$tag_name])) {
							$output[$tag_name] = array();
						}
						
						$output[$tag_name][] = $subtree;
					} else {
						//check if it is not an empty text node
						if($subtree !== '') {
							$output = $subtree;
						}
					}
				}
 
				if(is_array($output) and empty($output)) {
					//for empty nodes
					$output = '';
				}
 
				// loop through the attributes and collect them
				if($node->attributes->length) {
					$attrs = array();
					
					foreach($node->attributes as $attrName => $attrNode) {
						$attrs[$attrName] = (string) $attrNode->value;
					}
					
					// if its an leaf node, store the value in @value instead of directly storing it.
					if(!is_array($output)) {
						$output = array('@value' => $output);
					}
					
					$output['@attributes'] = $attrs;
				}
				break;
		}

		return $output;
    }
}
