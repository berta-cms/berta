<?php

namespace App;

class Sites Extends Storage {
    /**
    * Returns all sites as an array
    *
    * @return array Array of sites
    */
    public function getSites() {
        $xml_file = $this->XML_SITES_ROOT . '/sites.xml';
        return $this->xmlFile2array($xml_file);
    }
}
