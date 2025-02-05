<?php

namespace App\Shared;

use Illuminate\Support\Str;
use App\Shared\Helpers;
use Swaggest\JsonSchema\Schema;
use Illuminate\Support\Facades\Config;

class Storage
{
    /** @var array $JSON_SCHEMA
     * Associative array representing data structure handled by this service.
     */
    public static $JSON_SCHEMA = [];

    protected $SITE = '';
    protected $XML_MAIN_ROOT;
    protected $XML_STORAGE_ROOT;
    protected $XML_SITES_ROOT;
    protected $XML_PREVIEW_ROOT;
    protected $THEMES_ROOT;
    public $MEDIA_ROOT;
    public $MEDIA_URL;
    protected static $DEFAULT_VALUES = [];

    public $MEDIA_FOLDER = 'media';
    private $PREVIEW_FOLDER = 'preview';

    public function __construct($site = '', $isPreview = false)
    {
        $this->SITE = $site;
        $this->XML_MAIN_ROOT = realpath(Config::get('app.old_berta_root') . '/storage');
        $this->XML_STORAGE_ROOT = $this->XML_MAIN_ROOT;
        $this->XML_SITES_ROOT = $this->XML_MAIN_ROOT . '/-sites';
        $this->THEMES_ROOT = realpath(Config::get('app.old_berta_root') . '/_themes');
        $preview_folder = $isPreview ? $this->PREVIEW_FOLDER . '/' : '';

        if (!empty($site) and $site !== '0') {
            $this->XML_STORAGE_ROOT = $this->XML_SITES_ROOT . '/' . $site;
            $this->XML_PREVIEW_ROOT = $this->XML_STORAGE_ROOT . '/' . $this->PREVIEW_FOLDER;
            $this->MEDIA_ROOT = $this->XML_SITES_ROOT . '/' . $site . '/' . $preview_folder . $this->MEDIA_FOLDER;
            $this->MEDIA_URL = '/storage/-sites/' . $site . '/' . $preview_folder . $this->MEDIA_FOLDER;
        } else {
            $this->XML_PREVIEW_ROOT = $this->XML_MAIN_ROOT . '/' . $this->PREVIEW_FOLDER;
            $this->MEDIA_ROOT = $this->XML_MAIN_ROOT . '/' . $preview_folder . $this->MEDIA_FOLDER;
            $this->MEDIA_URL = '/storage/' . $preview_folder . $this->MEDIA_FOLDER;
        }
    }

    /**
     * Return model data from XML file
     */
    public function get()
    {
        return [];
    }

    /**
     * Return modified model data used for frontend state
     */
    public function getState()
    {
        return $this->get();
    }

    /************************************************************
     * Protected methods
     ************************************************************/

    /**
     */
    protected function asList($val)
    {
        if (is_array($val)) {
            if (array_values($val) !== $val) {
                return [0 => $val];
            }
        } else {
            return [0 => $val];
        }

        return $val;
    }

    /**
     * Get a value in array by key path
     *
     * @param array $array Array where to get the value
     * @param string $path Slash delimited path to the value
     */
    protected function getValueByPath($array, $path)
    {
        $result = $array;
        $_path = explode('/', $path);

        foreach ($_path as $key) {
            $result = &$result[$key];
            if (!$result) {
                break;
            }
        }

        return $result;
    }

    /**
     * Sets a value in array by key path
     *
     * @param array $array Array where to set the value
     * @param string $path Slash delimited path to the value
     * @param mixed $value Value to set
     */
    protected function setValueByPath(&$array, $path, $value)
    {
        $temp = &$array;
        $_path = explode('/', $path);

        // @@@:TODO: Implement error checking
        foreach ($_path as $key) {
            $temp = &$temp[$key];
        }

        $temp = $value;
        unset($temp);
    }

    /**
     */
    protected function unsetValueByPath(&$array, $path)
    {
        $temp = &$array;
        $_path = explode('/', $path);
        $prop = array_pop($_path);

        // @@@:TODO: Implement error checking
        foreach ($_path as $key) {
            $temp = &$temp[$key];
        }

        unset($temp[$prop]);
    }

    /**
     * Returns path to XML folder of a given site
     *
     * @param string $site name of the site
     * @return string
     */
    protected function getSiteXmlRoot($site)
    {
        return empty($site) ? $this->XML_MAIN_ROOT : $this->XML_SITES_ROOT . '/' . $site;
    }

    public function getOrCreateMediaDir()
    {
        if (!file_exists($this->MEDIA_ROOT)) {
            mkdir($this->MEDIA_ROOT, 0777, true);
        }

        return $this->MEDIA_ROOT;
    }

    protected function getUniqueFileName($dir, $fileName)
    {
        $name = pathinfo($fileName, PATHINFO_FILENAME);
        $name = Helpers::slugify($name, '-', '-');
        $name = $name ? $name : '1';
        $extension = pathinfo($fileName, PATHINFO_EXTENSION);

        if (!file_exists($dir . '/' . $name . '.' . $extension)) {
            return $name . '.' . $extension;
        }

        preg_match('/(.+)_([0-9])+$/', $name, $nrFileParts);

        if (!$nrFileParts) {
            $fileName = $name . '_1.' . $extension;
            if (!file_exists($dir . '/' . $fileName)) {
                return $fileName;
            }
            $nrFileParts = [$fileName, $name, '1'];
        }

        $dirContent = [];
        foreach (scandir($dir) as $file) {
            if (!is_file($dir . '/' . $file)) {
                continue;
            }
            $dirContent[] = $file;
        }

        $maxFileIdx = intval($nrFileParts[2]);

        foreach ($dirContent as $file) {
            preg_match('/' . $name . '_([0-9]).' . $extension . '/', $file, $nrParts);
            if (!$nrParts) {
                continue;
            }
            $idx = intval($nrParts[1]);
            if ($idx > $maxFileIdx) {
                $maxFileIdx = $idx;
            }
        }

        return $name . '_' . ($maxFileIdx + 1) . '.' . $extension;
    }

    public static function removeImageWithThumbnails($dir, $fileName)
    {
        if (file_exists($dir . '/' . $fileName)) {
            unlink($dir . '/' . $fileName);
        }

        // Remove thumbnails
        foreach (scandir($dir) as $file) {
            if (!is_file($dir . '/' . $file) || substr($file, 0, 1) !== '_' || !Str::endsWith($file, $fileName)) {
                continue;
            }
            unlink($dir . '/' . $file);
        }
    }

    /**
     * Saves an array to XML file
     *
     * @param array $arr
     * @param string $xml_file Path to XML file
     * @param string $root root element of XML file
     */
    protected function array2xmlFile($arr, $xml_file, $root)
    {
        $dir = dirname($xml_file);

        if (!file_exists($dir)) {
            @mkdir($dir, 0777, true);
        }

        $xml = new \DOMDocument('1.0', 'utf-8');
        $xml->formatOutput = true;
        $xml->appendChild($this->array2xml($xml, $root, $arr));

        // Use append flag ('a'), so we wouldn't delete the file, before lock
        $fp = fopen($xml_file, 'a');
        if (flock($fp, LOCK_EX)) {
            // Clear the file once we have the lock
            ftruncate($fp, 0);

            // Write file content with the pointer instead of XML extension,
            // so we know what we're doing
            fwrite($fp, $xml->saveXML());

            // Make sure everything is written to the file
            fflush($fp);

            @chmod($xml_file, 0666);
            flock($fp, LOCK_UN);
            fclose($fp);
        } else {
            fclose($fp);
            throw new \Exception('Could not write locked file: ' . $xml_file);
        }
    }

    /**
     * Reads XML file into an array
     *
     * @param string $xml_file Path to XML file
     * @return array
     */
    protected function xmlFile2array($xml_file)
    {
        if (file_exists($xml_file)) {
            $fp = fopen($xml_file, 'r');
            if (flock($fp, LOCK_SH)) {
                $xml_str = file_get_contents($xml_file);
                flock($fp, LOCK_UN);
            } else {
                throw new \Exception('Could not read locked file: ' . $xml_file);
            }

            $xml = new \DOMDocument('1.0', 'utf-8');
            $xml->formatOutput = true;
            $parsed = $xml->loadXML($xml_str);

            if (!$parsed) {
                throw new \Exception('Error parsing the XML string!');
            }

            return $this->xml2array($xml->documentElement);
        }

        return [];
    }

    /**
     */
    protected function copyFolder($src, $dst)
    {
        if (!is_dir($src)) {
            return;
        }

        $dir = opendir($src);
        @mkdir($dst, 0777, true);

        while (false !== ($file = readdir($dir))) {
            if (($file != '.') && ($file != '..')) {
                if (is_dir($src . '/' . $file)) {
                    if (!in_array($file, ['-sites', $this->PREVIEW_FOLDER])) {
                        self::copyFolder($src . '/' . $file, $dst . '/' . $file);
                    }
                } else {
                    copy($src . '/' . $file, $dst . '/' . $file);
                }
            }
        }

        closedir($dir);
    }

    /**
     */
    protected function delFolder($dir)
    {
        if (!is_dir($dir)) {
            return;
        }

        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {
            (is_dir("$dir/$file") && !is_link($dir)) ? $this->delFolder("$dir/$file") : unlink("$dir/$file");
        }
        return rmdir($dir);
    }

    /**
     * Removes invalid characters by XML 1.0 specification
     *
     * @param string
     * @returns cleaned string
     */
    protected function removeXMLInvalidChars($string)
    {
        return preg_replace('/[^\x{0009}\x{000a}\x{000d}\x{0020}-\x{D7FF}\x{E000}-\x{FFFD}]+/u', '', $string);
    }

    /**
     * Converts an array to XML document
     *
     * @param array $xml XML document
     * @param string $node_name Name of root node name
     * @param string $arr Array to convert to XML
     * @return mixed Node to append to XML document
     */
    protected function array2xml($xml, $node_name, $arr = [])
    {
        $node = $xml->createElement($node_name);

        if (is_array($arr)) {
            // get the attributes first.;
            if (isset($arr['@attributes'])) {
                foreach ($arr['@attributes'] as $key => $value) {
                    if (!$this->isValidTagName($key)) {
                        throw new \Exception('Illegal character in attribute name. attribute: ' . $key . ' in node: ' . $node_name);
                    }

                    $node->setAttribute($key, $this->removeXMLInvalidChars($value));
                }

                unset($arr['@attributes']); //remove the key from the array once done.
            }

            // check if it has a value stored in @value, if yes store the value and return
            // else check if its directly stored as string
            if (isset($arr['@value'])) {
                $node->appendChild($xml->createCDATASection($this->removeXMLInvalidChars($arr['@value'])));
                unset($arr['@value']); //remove the key from the array once done.

                //return from recursion, as a note with value cannot have child nodes.
                return $node;
            }
        }

        //create subnodes using recursion
        if (is_array($arr)) {
            // recurse to get the node for that key
            foreach ($arr as $key => $value) {
                if (!$this->isValidTagName($key)) {
                    throw new \Exception('Illegal character in tag name. tag: ' . $key . ' in node: ' . $node_name);
                }

                if (is_array($value) && is_numeric(key($value))) {
                    // MORE THAN ONE NODE OF ITS KIND;
                    // if the new array is numeric index, means it is array of nodes of the same kind
                    // it should follow the parent key name
                    foreach ($value as $k => $v) {
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
        if (!is_array($arr)) {
            $node->appendChild($xml->createCDATASection($this->removeXMLInvalidChars($arr)));
        }

        return $node;
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
    private function isValidTagName($tag)
    {
        $pattern = '/^[a-z_]+[a-z0-9\:\-\.\_]*[^:]*$/i';
        return preg_match($pattern, $tag, $matches) && $matches[0] == $tag;
    }

    /**
     * Converts XML document to an array
     *
     * @param string $node XML document node
     * @return array
     */
    private function xml2array($node)
    {
        $output = [];

        switch ($node->nodeType) {
            case XML_CDATA_SECTION_NODE:

            case XML_TEXT_NODE:
                $output = trim($node->textContent);
                break;

            case XML_ELEMENT_NODE:
                $subtree = '';

                // for each child node, call the covert function recursively
                for ($i = 0; $i < $node->childNodes->length; $i++) {
                    $child = $node->childNodes->item($i);
                    $subtree = $this->xml2array($child);

                    if (isset($child->tagName)) {
                        $tag_name = $child->tagName;
                        $grandchildren = $child->childNodes;

                        // assume more nodes of same kind are coming
                        if (!isset($output[$tag_name])) {
                            $output[$tag_name] = [];
                        }

                        $output[$tag_name][] = $subtree;
                    } else {
                        //check if it is not an empty text node
                        if ($subtree !== '') {
                            $output = $subtree;
                        }
                    }
                }

                if (is_array($output)) {
                    // if only one node of its kind and is leaf node, assign it directly instead if array($value);
                    foreach ($output as $tag => $val) {
                        if (is_array($val) && count($val) == 1) {
                            $output[$tag] = $val[0];
                        }
                    }

                    if (empty($output)) {
                        //for empty nodes
                        $output = '';
                    }
                }

                // loop through the attributes and collect them
                if ($node->attributes->length) {
                    $attrs = [];

                    foreach ($node->attributes as $attrName => $attrNode) {
                        $attrs[$attrName] = (string)$attrNode->value;
                    }

                    // if its an leaf node, store the value in @value instead of directly storing it.
                    if (!is_array($output)) {
                        $output = ['@value' => $output];
                    }

                    $output['@attributes'] = $attrs;
                }
                break;
        }

        return $output;
    }

    /**
     * Test if data structure validation works correctly, by validating the default data structure.
     *
     * @return boolean
     */
    public function validationTest()
    {
        $class = get_class($this);
        try {
            $json_object = Helpers::arrayToJsonObject($class::$JSON_SCHEMA);
            $schema = Schema::import($json_object);
            $result = $schema->in(
                [  // Wrap default structure in array, because sections.xml represents Section array.
                    Helpers::arrayToJsonObject($class::$DEFAULT_VALUES)
                ]
            );
        } catch (Exception $e) {
            return false;
        }
        return true;
    }

    /**
     * Validate data passed or existing in this service against it's JSON_SCHEMA.
     *
     * @param array|object $data    Array or stdClass object containing data for this service
     * @return bool
     */
    public function validate($data = null)
    {
        $data = $data ? $data : Helpers::arrayToJsonObject($this->get());
        $class = get_class($this);
        try {
            $json_schema = Helpers::arrayToJsonObject($class::$JSON_SCHEMA);
            $schema = Schema::import($json_schema);
            $schema->in($data);
            /** @todo: Catch exeption while validating  */
        } catch (\Exception $e) {
            \Log::warning(print_r($e, true));
            return false;
        }
        return true;
    }
}
