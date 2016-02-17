<?php

namespace App;

class Entries Extends Storage {
    private $ROOT_ELEMENT = 'blog';
    private $SECTION_NAME;
    private $SECTION_TITLE;
    private $ENTRIES = array();
    private $XML_ROOT;

    public function __construct($site='', $sectionName='', $sectionTitle='') {
        parent::__construct($site);
        $this->XML_ROOT = $this->getSiteXmlRoot($site);
        $this->SECTION_NAME = $sectionName;
        $this->SECTION_TITLE = $sectionTitle;
        $this->XML_FILE = $this->XML_ROOT . '/blog.' . $sectionName . '.xml';
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

    public function create($name, $title, $cloneSection=false) {
        while (file_exists($this->XML_FILE)) {
            if (preg_match('/(?P<name>.*)-(?P<digit>\d+)$/', $this->SECTION_NAME, $matches)) {
                $this->SECTION_NAME = $matches['name'] . '-' . ((int)$matches['digit'] + 1);
                $this->setTitle($matches['name'] . ' ' . ((int)$matches['digit'] + 1));
            } else {
                $this->SECTION_NAME = $this->SECTION_NAME . '-2';
                $this->setTitle($this->SECTION_TITLE . ' 2');
            }

            $this->XML_FILE = $this->XML_ROOT . '/blog.' . $this->SECTION_NAME . '.xml';
        }

        if ($cloneSection === false) {
            $blog = array();
        } else {
            $entries = new Entries($this->SITE, $name);
            $blog = $entries->get();
            $blog['@attributes']['section'] = $this->SECTION_NAME;

            if (isset($blog['entry'])) {
                foreach ($blog['entry'] as $idx => $entry) {
                    $blog['entry'][$idx]['uniqid'] = uniqid();
                    $blog['entry'][$idx]['date'] = date('d.m.Y H:i:s');
                    $blog['entry'][$idx]['updated'] = date('d.m.Y H:i:s');

                    if (isset($entry['mediafolder'])) {
                        $blog['entry'][$idx]['mediafolder'] = str_replace(
                            $name,
                            $this->SECTION_NAME,
                            $entry['mediafolder']
                        );

                        $this->copyFolder(
                            realpath($this->MEDIA_ROOT) .'/'. $entry['mediafolder'],
                            realpath($this->MEDIA_ROOT) .'/'. $blog['entry'][$idx]['mediafolder']
                        );
                    }
                }
            }
        }

        $this->array2xmlFile($blog, $this->XML_FILE, $this->ROOT_ELEMENT);

        return array(
            'name' => $this->SECTION_NAME,
            'title' => $this->SECTION_TITLE,
            'entries' => $blog
        );
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

    private function setTitle($title) {
        if (!empty($this->SECTION_TITLE)) {
            $this->SECTION_TITLE = $title;
        }
    }
}
