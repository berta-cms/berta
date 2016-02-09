<?php

namespace App;

class Entries Extends Storage {
    private $ROOT_ELEMENT = 'blog';

    /**
    * Returns all entries of a section of a given site as an array
    *
    * @param string $site name of the site
    * @param string $section name of the section
    * @return array Array of entries
    */
    public function getSiteSectionEntries($site, $section) {
        $xml_root = $this->getSiteXmlRoot($site);
        $xml_file = $xml_root . '/blog.'.$section.'.xml';
        return $this->xmlFile2array($xml_file);
    }
}
