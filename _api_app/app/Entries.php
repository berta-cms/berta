<?php

namespace App;

class Entries Extends Storage {
    private $ROOT_ELEMENT = 'blog';
    private $SECTION;
    private $ENTRIES = array();

    public function __construct($site='', $section='') {
        parent::__construct($site);
        $xml_root = $this->getSiteXmlRoot($site);
        $this->SECTION = $section;
        $this->XML_FILE = $xml_root . '/blog.'.$section.'.xml';
    }

    /**
    * Returns all entries of site section as an array
    *
    * @return array Array of entries
    */
    public function get() {
        if (empty($this->ENTRIES)) {
            $this->ENTRIES = $this->xmlFile2array($this->XML_FILE);

            if (empty($this->ENTRIES)) {
                $this->ENTRIES = array();
            }
        }

        return $this->ENTRIES;
    }

    public function delete() {
        $entries = $this->get();

        // delete media files
        if(array_key_exists('entry', $entries) and !empty($entries['entry'])) {
            foreach($entries['entry'] as $entry) {
                if(!empty($entry['mediafolder'])) {
                    $mediaFolder = $this->MEDIA_ROOT . '/' . $entry['mediafolder'];

                    if(file_exists($mediaFolder)) {
                        $dir = opendir($mediaFolder);

                        while($fItem = readdir($dir)) {
                            if($fItem != '.' && $fItem != '..') {
                                @unlink($mediaFolder . '/' . $fItem);
                            }
                        }

                        if (!@rmdir($mediaFolder)) {
                            return array(
                                'success' => false,
                                'error_message' => 'Unable to remove folder "' . $mediaFolder . '"!'
                            );
                        };
                    }
                }
            }
        }

        // Delete entries
        if (!@unlink($this->XML_FILE)) {
            return array(
                'success' => false,
                'error_message' => 'Unable to remove file "' . $this->XML_FILE . '"!'
            );
        }

        return array('success' => true);
    }
}
