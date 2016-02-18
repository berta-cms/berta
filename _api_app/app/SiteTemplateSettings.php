<?php

namespace App;

class SiteTemplateSettings Extends Storage {
    private $TEMPLATE;
    private $XML_FILE;

    public function __construct($site='', $template='') {
        parent::__construct($site);
        $xml_root = $this->getSiteXmlRoot($site);
        $this->TEMPLATE = explode('-', $template)[0];
        $this->XML_FILE = $xml_root . '/settings.' . $this->TEMPLATE . '.xml';
    }

    public function get() {
        return $this->xmlFile2array($this->XML_FILE);
    }
}
