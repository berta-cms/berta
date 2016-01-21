<?php

namespace App;

class Tags Extends Storage {
    /**
    * Returns all tags of a given site as an array
    *
    * @param string $site name of the site
    * @return array Array of tags
    */
    public function getTagsBySite($site) {
        $xml_root = $this->getSiteXmlRoot($site);
        $xml_file = $xml_root . '/tags.xml';
        return $this->xmlFile2array($xml_file);
    }
}
