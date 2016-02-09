<?php

namespace App;

class Sections Extends Storage {
    private $ROOT_ELEMENT = 'sections';

    public function __construct($site='') {
        parent::__construct($site);
        $xml_root = $this->getSiteXmlRoot($site);
        $this->XML_FILE = $xml_root . '/sections.xml';
    }

    /**
    * Returns all sections of a given site as an array
    *
    * @param string $site name of the site
    * @return array Array of sections
    */
    public function getSectionsBySite() {
        return $this->xmlFile2array($this->XML_FILE);
    }

    /**
    * Reorder sections and save to XML file
    *
    * @param array $names Array of section names in a new order
    */
    public function orderSections($site, $names) {
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
