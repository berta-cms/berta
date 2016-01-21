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
        $sites = $this->xmlFile2array($xml_file);

        if (empty($sites)) {
            $sites = array('site' => array(0 => array('name' => '')));
        }

        return $sites;
    }
}
