<?php

namespace App;

class Settings Extends Storage {
    /**
    * Returns all settings of a given site as an array
    *
    * @param string $site name of the site
    * @return array Array of settings
    */
    public function getSettingsBySite($site) {
        $xml_root = $this->getSiteXmlRoot($site);
        $xml_file = $xml_root . '/settings.xml';
        return $this->xmlFile2array($xml_file);
    }
}
