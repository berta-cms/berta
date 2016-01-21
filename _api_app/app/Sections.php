<?php

namespace App;

class Sections Extends Storage {
    /**
    * Returns all sections of a given site as an array
    *
    * @param string $site name of the site
    * @return array Array of sections
    */
    public function getSectionsBySite($site) {
        $xml_root = $this->getSiteXmlRoot($site);
        $xml_file = $xml_root . '/sections.xml';
        return $this->xmlFile2array($xml_file);
    }

    public function getSiteSectionEntries($site, $section) {
        $xml_root = $this->getSiteXmlRoot($site);
        $xml_file = $xml_root . '/blog.'.$section.'.xml';
        return $this->xmlFile2array($xml_file);
    }
}
