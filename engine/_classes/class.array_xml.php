<?php
/*************************************************************************/
/* This class stores associative arrays in an xml formated string.       */
/* There's also a function thar retrieves them. If you try to use        */
/* xml2array with a general xml, it can fail, since there can be some    */
/* repeated indexes....                                                  */
/*************************************************************************/

class Array_XML
{
    public $text;
    public $arrays;
    public $keys;
    public $node_flag;
    public $depth;
    public $xml_parser;

    /*Converts an array to an xml string*/
    public static function array2xml($array, $baseTag = 'data', $level = 0)
    {
        if ($level == 0) {
            $txt = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
            $allAttrs = isset($array['@attributes']) ? ' ' . Array_XML::writeAttributes($array['@attributes']) : '';
            $txt .= "<{$baseTag}{$allAttrs}>\n";
        } else {
            $txt = '';
        }
        $padding = str_repeat(' ', ($level + 1) * 4);

        foreach ($array as $key => $value) {
            if (empty($key) || $key === '@attributes') {
                continue;
            }

            if (!is_array($value)) {
                $txt .= "$padding<{$key}>{$value}</{$key}>\n";
            } else {
                if (isset($value['value'])) {
                    $attrs = isset($value['@attributes']) ? ' ' . Array_XML::writeAttributes($value['@attributes']) : '';
                    $txt .= "$padding<{$key}{$attrs}>{$value['value']}</{$key}>\n";
                } elseif (isset($value[0])) {
                    $arrAttrs = isset($value['@attributes']) ? ' ' . Array_XML::writeAttributes($value['@attributes']) : '';

                    foreach ($value as $i => $v) {
                        if ((string) $i != '@attributes') {
                            if (isset($v['value'])) {
                                $attrs = isset($v['@attributes']) ? ' ' . Array_XML::writeAttributes($v['@attributes']) : '';
                                $txt .= "$padding<{$key}{$attrs}>{$v['value']}</{$key}>\n";
                            } else {
                                $attrs = isset($v['@attributes']) ? ' ' . Array_XML::writeAttributes($v['@attributes']) : '';
                                $txt .= "$padding<{$key}{$attrs}>\n";
                                $txt .= Array_XML::array2xml($v, $baseTag, $level + 1);
                                $txt .= "$padding</{$key}>\n";
                            }
                        }
                    }
                } else {
                    if (isset($value['@attributes']) && count($value) == 1 || count($value) == 0) {
                        $attrs = isset($value['@attributes']) ? ' ' . Array_XML::writeAttributes($value['@attributes']) : '';
                        $txt .= "$padding<{$key}{$attrs} />\n";
                    } else {
                        $attrs = isset($value['@attributes']) ? ' ' . Array_XML::writeAttributes($value['@attributes']) : '';
                        $txt .= "$padding<{$key}{$attrs}>\n";
                        $txt .= Array_XML::array2xml($value, $baseTag, $level + 1);
                        $txt .= "$padding</{$key}>\n";
                    }
                }
            }
        }

        $txt .= $level == 0 ? "</{$baseTag}>" : '';
        return $txt;
    }

    public static function writeAttributes($attrList)
    {
        $strOut = [];
        foreach ($attrList as $a => $v) {
            array_push($strOut, "$a=\"" . htmlspecialchars($v) . '"');
        }
        return implode(' ', $strOut);
    }

    /**
      * convert xml string to php array - useful to get a serializable value
      *
      * @param string $xmlstr
      * @return array
      *
      * @author Adrien aka Gaarf & contributors
      * @see http://gaarf.info/2009/08/13/xml-string-to-php-array/
    */
    public static function xml2array($xmlstr, $baseTag = 'data', $get_attributes = false)
    {
        $doc = new DOMDocument();
        $doc->loadXML($xmlstr);
        $root = $doc->documentElement;
        $output = Array_XML::domnode_to_array($root);
        $output = Array_XML::recursiveAddValueArray($output, $get_attributes);

        return $output;
    }

    public static function recursiveAddValueArray(&$array, $get_attributes)
    {
        if (is_array($array)) {
            foreach ($array as $key => &$arrayElement) {
                if ($key !== '@attributes' && is_array($arrayElement)) {
                    Array_XML::recursiveAddValueArray($arrayElement, $get_attributes);
                } else {
                    if ($key !== '@attributes' && $key !== 'value' && $get_attributes) {
                        $array[$key] = ['value' => $array[$key]];
                    }
                }
            }
        }
        return $array;
    }

    public static function domnode_to_array($node)
    {
        $output = [];
        switch ($node->nodeType) {
      case XML_CDATA_SECTION_NODE:
      case XML_TEXT_NODE:
        $output = trim($node->textContent);
      break;
      case XML_ELEMENT_NODE:
        for ($i = 0, $m = $node->childNodes->length; $i < $m; $i++) {
            $child = $node->childNodes->item($i);
            $v = Array_XML::domnode_to_array($child);

            if (isset($child->tagName) && !(is_array($v) && !$v)) {
                $t = $child->tagName;
                if (!isset($output[$t])) {
                    $output[$t] = [];
                }
                $output[$t][] = $v;
            } elseif ($v || $v === '0') {
                $output = (string) $v;
            }
        }

        if ($node->attributes->length && !is_array($output)) { //Has attributes but isn't an array
          $output = ['value' => $output]; //Change output into an array.
        }

        if (is_array($output)) {
            if ($node->attributes->length) {
                $a = [];
                foreach ($node->attributes as $attrName => $attrNode) {
                    $a[$attrName] = (string) $attrNode->value;
                }
                $output['@attributes'] = $a;
            }
            foreach ($output as $t => $v) {
                if (is_array($v) && count($v) == 1 && $t != '@attributes') {
                    $output[$t] = $v[0];
                }
            }
        }
      break;
    }
        return $output;
    }

    public static function addCDATA(&$array, $depth = 0)
    {
        foreach ($array as $aId => $child) {
            if ((string) $aId == '@attributes') {
                continue;
            }
            if (!is_array($child) && trim((string) $child) != '') {
                $array[$aId] = '<![CDATA[' . $child . ']]>';
            }
            if (is_array($array[$aId])) {
                Array_XML::addCDATA($array[$aId], $depth + 1);
            }
        }
    }

    public static function makeListIfNotList(&$item)
    {
        if (is_array($item) && count($item) > 0 && !isset($item[0])) {
            $item = [0 => $item];
        }
    }
}
