<?php

namespace App;

use App\Entries;

class Sections Extends Storage {
    private $ROOT_ELEMENT = 'sections';
    private $SECTIONS = array();

    public function __construct($site='') {
        parent::__construct($site);
        $xml_root = $this->getSiteXmlRoot($site);
        $this->XML_FILE = $xml_root . '/sections.xml';
    }

    /**
    * Returns all sections of site as an array
    *
    * @return array Array of sections
    */
    public function get() {
        if (empty($this->SECTIONS)) {
            $this->SECTIONS = $this->xmlFile2array($this->XML_FILE);
        }

        return $this->SECTIONS;
    }

    public function create($cloneFrom=null) {
        // $sites = $this->getSites();
        // $name = 'untitled-' . uniqid();
        // $dir = $this->XML_SITES_ROOT . '/' . $name;

        // @mkdir($dir, 0777);

        // if ($cloneFrom != null) {
        //     $src = $cloneFrom == '0' ? $this->XML_MAIN_ROOT : $this->XML_SITES_ROOT . '/' . $cloneFrom;
        //     $this->copyFolder($src, $dir);
        // }

        // $site = array(
        //     'name' => $name,
        //     'title' => '',
        //     '@attributes' => array('published' => 0)
        // );
        // $sites['site'][] = $site;

        // $this->array2xmlFile($sites, $this->XML_FILE, $this->ROOT_ELEMENT);
        // $site['idx'] = count($sites['site']) - 1;

        // return $site;
    }

    /**
    */
    public function delete($name) {
        $sections = $this->get();
        $section_idx = array_search($name, array_column($sections['section'], 'name'));

        if ($section_idx !== False) {
            // delete all entries
            $entries = new Entries($this->SITE, $name);
            $res = $entries->delete();

            if (!$res['success']) {
                return $res;
            }

            // delete section media
            $section = $sections['section'][$section_idx];

            if(array_key_exists('mediafolder', $section) and !empty($section['mediafolder'])) {
                $mediaFolder = $this->MEDIA_ROOT . '/' . $section['mediafolder'];

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
                    }
                }
            }

            // delete section
            $section = array_splice($sections['section'], $section_idx, 1);
            $this->array2xmlFile($sections, $this->XML_FILE, $this->ROOT_ELEMENT);
            $ret = $section[0];
            $ret['site'] = $this->SITE;
            return $ret;
        }

        return array('error_message' => 'Section "'.$name.'" not found!');
    }

    /**
    * Reorder sections and save to XML file
    *
    * @param array $names Array of section names in a new order
    */
    public function order($site, $names) {
        $site = $site == '0' ? 0 : $site;
        $sections = $this->getSectionsBySite($site);
        $new_order = array();

        foreach($names as $section_name) {
            $section_idx = array_search($section_name, array_column($sections['section'], 'name'));

            if ($section_idx !== false) {
                $new_order[] = $sections['section'][$section_idx];
            }
        }

        if (count($new_order) == count($sections['section'])) {
            $sections['section'] = $new_order;
            $this->array2xmlFile($sections, $this->XML_FILE, $this->ROOT_ELEMENT);
        }
    }
}
