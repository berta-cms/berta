<?php

namespace App;

class Storage {
    protected $SITE='';
    protected $XML_MAIN_ROOT;
    protected $XML_SITES_ROOT;

    public function __construct($site='') {
        $this->SITE = $site;
        $this->XML_MAIN_ROOT = realpath(__DIR__ . '/../../storage');
        $this->XML_SITES_ROOT = $this->XML_MAIN_ROOT . '/-sites';
    }

    /************************************************************
     * Protected methods
     ************************************************************/

    /**
    * Sets a value in array by key path
    *
    * @param array $array Array where to set the value
    * @param string $path Slash delimited path to the value
    * @param mixed $value Value to set
    */
    protected function setValueByPath(&$array, $path, $value) {
        $temp = &$array;
        $_path = explode('/', $path);

        // @@@:TODO: Implement error checking
        foreach($_path as $key) {
            $temp = &$temp[$key];
        }

        $temp = $value;
        unset($temp);
    }

    /**
    * Returns path to XML folder of a given site
    *
    * @param string $site name of the site
    * @return string
    */
    protected function getSiteXmlRoot($site) {
        return empty($site) ? $this->XML_MAIN_ROOT : $this->XML_SITES_ROOT . '/' .$site;
    }

    /**
    * Saves an array to XML file
    *
    * @param array $arr
    * @param string $xml_file Path to XML file
    * @param string $root root element of XML file
    */
    protected function array2xmlFile($arr, $xml_file, $root) {
        $dir = dirname($xml_file);

        if(!file_exists($dir)) {
            @mkdir($dir, 0777, true);
        }

        $xml = new \DOMDocument('1.0', 'utf-8');
        $xml->formatOutput = true;
        $xml->appendChild($this->array2xml($xml, $root, $arr));
        $xml->save($xml_file);
    }

    /**
    * Reads XML file into an array
    *
    * @param string $xml_file Path to XML file
    * @return array
    */
    protected function xmlFile2array($xml_file) {
        if(file_exists($xml_file)) {
            $xml_str = file_get_contents($xml_file);
            $xml = new \DOMDocument('1.0', 'utf-8');
            $xml->formatOutput = true;
            $parsed = $xml->loadXML($xml_str);

            if(!$parsed) {
                throw new Exception('Error parsing the XML string!');
            }

            return $this->xml2array($xml->documentElement);
        }

        return array();
    }

    /**
    */
    protected function copyFolder($src, $dst) {
        $dir = opendir($src);
        @mkdir($dst);

        while(false !== ( $file = readdir($dir)) ) {
            if (( $file != '.' ) && ( $file != '..' )) {
                if ( is_dir($src . '/' . $file) ) {
                    if ($file != '-sites') {
                        self::copyFolder($src . '/' . $file, $dst . '/' . $file);
                    }
                } else {
                    copy($src . '/' . $file,$dst . '/' . $file);
                }
            }
        }

        closedir($dir);
    }

    /**
    */
    protected function delFolder($dir) {
        $files = array_diff(scandir($dir), array('.','..'));
        foreach ($files as $file) {
            (is_dir("$dir/$file") && !is_link($dir)) ? $this->delFolder("$dir/$file") : unlink("$dir/$file");
        }
        return rmdir($dir);
    }

    /**
    */
    protected function slugify($tagTitle, $replacementStr='-', $allowNonWordChars='', $reallyRemoveOtherChars=false) {
        $char_map = array(
            // Latin
            'À' => 'A', 'Á' => 'A', 'Â' => 'A', 'Ã' => 'A', 'Ä' => 'A', 'Å' => 'A', 'Æ' => 'AE', 'Ç' => 'C',
            'È' => 'E', 'É' => 'E', 'Ê' => 'E', 'Ë' => 'E', 'Ì' => 'I', 'Í' => 'I', 'Î' => 'I', 'Ï' => 'I',
            'Ð' => 'D', 'Ñ' => 'N', 'Ò' => 'O', 'Ó' => 'O', 'Ô' => 'O', 'Õ' => 'O', 'Ö' => 'O', 'Ő' => 'O',
            'Ø' => 'O', 'Ù' => 'U', 'Ú' => 'U', 'Û' => 'U', 'Ü' => 'U', 'Ű' => 'U', 'Ý' => 'Y', 'Þ' => 'TH',
            'ß' => 'ss',
            'à' => 'a', 'á' => 'a', 'â' => 'a', 'ã' => 'a', 'ä' => 'a', 'å' => 'a', 'æ' => 'ae', 'ç' => 'c',
            'è' => 'e', 'é' => 'e', 'ê' => 'e', 'ë' => 'e', 'ì' => 'i', 'í' => 'i', 'î' => 'i', 'ï' => 'i',
            'ð' => 'd', 'ñ' => 'n', 'ò' => 'o', 'ó' => 'o', 'ô' => 'o', 'õ' => 'o', 'ö' => 'o', 'ő' => 'o',
            'ø' => 'o', 'ù' => 'u', 'ú' => 'u', 'û' => 'u', 'ü' => 'u', 'ű' => 'u', 'ý' => 'y', 'þ' => 'th',
            'ÿ' => 'y',

            // Latin symbols
            '©' => '(c)',

            // Greek
            'Α' => 'A', 'Β' => 'B', 'Γ' => 'G', 'Δ' => 'D', 'Ε' => 'E', 'Ζ' => 'Z', 'Η' => 'H', 'Θ' => '8',
            'Ι' => 'I', 'Κ' => 'K', 'Λ' => 'L', 'Μ' => 'M', 'Ν' => 'N', 'Ξ' => '3', 'Ο' => 'O', 'Π' => 'P',
            'Ρ' => 'R', 'Σ' => 'S', 'Τ' => 'T', 'Υ' => 'Y', 'Φ' => 'F', 'Χ' => 'X', 'Ψ' => 'PS', 'Ω' => 'W',
            'Ά' => 'A', 'Έ' => 'E', 'Ί' => 'I', 'Ό' => 'O', 'Ύ' => 'Y', 'Ή' => 'H', 'Ώ' => 'W', 'Ϊ' => 'I',
            'Ϋ' => 'Y',
            'α' => 'a', 'β' => 'b', 'γ' => 'g', 'δ' => 'd', 'ε' => 'e', 'ζ' => 'z', 'η' => 'h', 'θ' => '8',
            'ι' => 'i', 'κ' => 'k', 'λ' => 'l', 'μ' => 'm', 'ν' => 'n', 'ξ' => '3', 'ο' => 'o', 'π' => 'p',
            'ρ' => 'r', 'σ' => 's', 'τ' => 't', 'υ' => 'y', 'φ' => 'f', 'χ' => 'x', 'ψ' => 'ps', 'ω' => 'w',
            'ά' => 'a', 'έ' => 'e', 'ί' => 'i', 'ό' => 'o', 'ύ' => 'y', 'ή' => 'h', 'ώ' => 'w', 'ς' => 's',
            'ϊ' => 'i', 'ΰ' => 'y', 'ϋ' => 'y', 'ΐ' => 'i',

            // Turkish
            'Ş' => 'S', 'İ' => 'I', 'Ç' => 'C', 'Ü' => 'U', 'Ö' => 'O', 'Ğ' => 'G',
            'ş' => 's', 'ı' => 'i', 'ç' => 'c', 'ü' => 'u', 'ö' => 'o', 'ğ' => 'g',

            // Russian
            'А' => 'A', 'Б' => 'B', 'В' => 'V', 'Г' => 'G', 'Д' => 'D', 'Е' => 'E', 'Ё' => 'Yo', 'Ж' => 'Zh',
            'З' => 'Z', 'И' => 'I', 'Й' => 'J', 'К' => 'K', 'Л' => 'L', 'М' => 'M', 'Н' => 'N', 'О' => 'O',
            'П' => 'P', 'Р' => 'R', 'С' => 'S', 'Т' => 'T', 'У' => 'U', 'Ф' => 'F', 'Х' => 'H', 'Ц' => 'C',
            'Ч' => 'Ch', 'Ш' => 'Sh', 'Щ' => 'Sh', 'Ъ' => '', 'Ы' => 'Y', 'Ь' => '', 'Э' => 'E', 'Ю' => 'Yu',
            'Я' => 'Ya',
            'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'д' => 'd', 'е' => 'e', 'ё' => 'yo', 'ж' => 'zh',
            'з' => 'z', 'и' => 'i', 'й' => 'j', 'к' => 'k', 'л' => 'l', 'м' => 'm', 'н' => 'n', 'о' => 'o',
            'п' => 'p', 'р' => 'r', 'с' => 's', 'т' => 't', 'у' => 'u', 'ф' => 'f', 'х' => 'h', 'ц' => 'c',
            'ч' => 'ch', 'ш' => 'sh', 'щ' => 'sh', 'ъ' => '', 'ы' => 'y', 'ь' => '', 'э' => 'e', 'ю' => 'yu',
            'я' => 'ya',

            // Ukrainian
            'Є' => 'Ye', 'І' => 'I', 'Ї' => 'Yi', 'Ґ' => 'G',
            'є' => 'ye', 'і' => 'i', 'ї' => 'yi', 'ґ' => 'g',

            // Czech
            'Č' => 'C', 'Ď' => 'D', 'Ě' => 'E', 'Ň' => 'N', 'Ř' => 'R', 'Š' => 'S', 'Ť' => 'T', 'Ů' => 'U',
            'Ž' => 'Z',
            'č' => 'c', 'ď' => 'd', 'ě' => 'e', 'ň' => 'n', 'ř' => 'r', 'š' => 's', 'ť' => 't', 'ů' => 'u',
            'ž' => 'z',

            // Polish
            'Ą' => 'A', 'Ć' => 'C', 'Ę' => 'e', 'Ł' => 'L', 'Ń' => 'N', 'Ó' => 'o', 'Ś' => 'S', 'Ź' => 'Z',
            'Ż' => 'Z',
            'ą' => 'a', 'ć' => 'c', 'ę' => 'e', 'ł' => 'l', 'ń' => 'n', 'ó' => 'o', 'ś' => 's', 'ź' => 'z',
            'ż' => 'z',

            // Latvian
            'Ā' => 'A', 'Č' => 'C', 'Ē' => 'E', 'Ģ' => 'G', 'Ī' => 'i', 'Ķ' => 'k', 'Ļ' => 'L', 'Ņ' => 'N',
            'Š' => 'S', 'Ū' => 'u', 'Ž' => 'Z',
            'ā' => 'a', 'č' => 'c', 'ē' => 'e', 'ģ' => 'g', 'ī' => 'i', 'ķ' => 'k', 'ļ' => 'l', 'ņ' => 'n',
            'š' => 's', 'ū' => 'u', 'ž' => 'z',

            //Lithuanian
            'Ą' => 'A', 'Ę' => 'E', 'Ė' => 'E', 'Į'=> 'I', 'Ų'=> 'U',
            'ą' => 'a', 'ę' => 'e', 'ė' => 'e', 'į'=> 'i', 'ų'=> 'u',

            //Other
            'ɗ'=> 'd', 'ə' => 'e', 'ʍ' => 'm', 'ş' => 's', 'ţ' => 't',
            'Ɗ' => 'D', 'Ə' => 'E', 'Ş' => 'S', 'Ţ'=> 'T'
        );

        $tagTitle = str_replace(array_keys($char_map), $char_map, $tagTitle);

        // replace all other characters with the replacement string
        if ($reallyRemoveOtherChars) {
            $tagTitle = preg_replace('/([^a-zA-Z0-9'.$allowNonWordChars.'])+/', $replacementStr, $tagTitle);
        }else{
            $tagTitle = mb_ereg_replace("[^\w$allowNonWordChars]", $replacementStr, $tagTitle);
        }

        //no duplicates
        $tagTitle = mb_ereg_replace("[$replacementStr]{2,}", $replacementStr, $tagTitle);

        // convert .- to .
        $tagTitle = str_replace('.' . $replacementStr, '.', $tagTitle);

        // remove . from the beinning and the end
        if(mb_substr($tagTitle, 0, 1) == '.') $tagTitle = mb_substr($tagTitle, 1);
        if(mb_substr($tagTitle, mb_strlen($tagTitle) - 1, 1) == '.') $tagTitle = mb_substr($tagTitle, 0, mb_strlen($tagTitle) - 1);

        // remove replacement strings from the beginning and the end
        if(mb_substr($tagTitle, 0, 1) == $replacementStr) $tagTitle = mb_substr($tagTitle, 1);
        if(mb_substr($tagTitle, mb_strlen($tagTitle) - 1, 1) == $replacementStr) $tagTitle = mb_substr($tagTitle, 0, mb_strlen($tagTitle) - 1);

        return strtolower($tagTitle);
    }

    /************************************************************
     * Private methods
     ************************************************************/

    /**
    * Checks if a given XML tag is valid
    *
    * @param string $tag Tag name
    * @return bool
    */
    private function isValidTagName($tag){
        $pattern = '/^[a-z_]+[a-z0-9\:\-\.\_]*[^:]*$/i';
        return preg_match($pattern, $tag, $matches) && $matches[0] == $tag;
    }

    /**
    * Converts an array to XML document
    *
    * @param array $xml XML document
    * @param string $node_name Name of root node name
    * @param string $arr Array to convert to XML
    * @return mixed Node to append to XML document
    */
    protected function array2xml($xml, $node_name, $arr=array()) {
        $node = $xml->createElement($node_name);

        if(is_array($arr)){
            // get the attributes first.;
            if(isset($arr['@attributes'])) {
                foreach($arr['@attributes'] as $key => $value) {
                    if(!$this->isValidTagName($key)) {
                        throw new Exception('Illegal character in attribute name. attribute: '.$key.' in node: '.$node_name);
                    }

                    $node->setAttribute($key, $value);
                }

                unset($arr['@attributes']); //remove the key from the array once done.
            }

            // check if it has a value stored in @value, if yes store the value and return
            // else check if its directly stored as string
            if(isset($arr['@value'])) {
                $node->appendChild($xml->createCDATASection($arr['@value']));
                unset($arr['@value']);    //remove the key from the array once done.

                //return from recursion, as a note with value cannot have child nodes.
                return $node;
            }
        }

        //create subnodes using recursion
        if(is_array($arr)){
            // recurse to get the node for that key
            foreach($arr as $key=>$value){
                if(!$this->isValidTagName($key)) {
                    throw new Exception('Illegal character in tag name. tag: '.$key.' in node: '.$node_name);
                }

                if(is_array($value) && is_numeric(key($value))) {
                    // MORE THAN ONE NODE OF ITS KIND;
                    // if the new array is numeric index, means it is array of nodes of the same kind
                    // it should follow the parent key name
                    foreach($value as $k=>$v){
                        $node->appendChild($this->array2xml($xml, $key, $v));
                    }
                } else {
                    // ONLY ONE NODE OF ITS KIND
                    $node->appendChild($this->array2xml($xml, $key, $value));
                }

                unset($arr[$key]); //remove the key from the array once done.
            }
        }

        // after we are done with all the keys in the array (if it is one)
        // we check if it has any text value, if yes, append it.
        if(!is_array($arr)) {
            $node->appendChild($xml->createCDATASection($arr));
        }

        return $node;
    }

    /**
    * Converts XML document to an array
    *
    * @param string $node XML document node
    * @return array
    */
    private function xml2array($node) {
        $output = array();

        switch ($node->nodeType) {
            case XML_CDATA_SECTION_NODE:

            case XML_TEXT_NODE:
                $output = trim($node->textContent);
                break;

            case XML_ELEMENT_NODE:
                $subtree = '';
                $is_leaf = array();
                // for each child node, call the covert function recursively
                for ($i=0; $i<$node->childNodes->length; $i++) {
                    $child = $node->childNodes->item($i);
                    $subtree = $this->xml2array($child);

                    if(isset($child->tagName)) {
                        $tag_name = $child->tagName;
                        $grandchildren = $child->childNodes;

                        // @@@:TODO: Would be nice to rewrite $is_leaf[$tag_name] = ... in a more readable form
                        $is_leaf[$tag_name] = (
                            $child->childNodes->length < 2 &&
                            (
                                $grandchildren->length == 1 ? !isset($grandchildren->item[0]->tagName) : true ||
                                $grandchildren->length == 0
                            )
                        );

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

                if(is_array($output)) {
                    // if only one node of its kind and is leaf node, assign it directly instead if array($value);
                    foreach ($output as $tag => $val) {
                        if(is_array($val) && count($val)==1 && $is_leaf[$tag]) {
                            $output[$tag] = $val[0];
                        }
                    }

                    if(empty($output)) {
                        //for empty nodes
                        $output = '';
                    }
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
