<?php

namespace App;

class SiteTemplateSettings extends Storage
{
    private $ROOT_ELEMENT = 'settings';
    private $TEMPLATE;
    private $XML_FILE;

    public function __construct($site = '', $template = '')
    {
        parent::__construct($site);
        $xml_root = $this->getSiteXmlRoot($site);
        $this->TEMPLATE = explode('-', $template)[0];
        $this->XML_FILE = $xml_root . '/settings.' . $this->TEMPLATE . '.xml';
    }

    public function get()
    {
        $template_settings = $this->xmlFile2array($this->XML_FILE);

        return $template_settings;
    }

    /**
     * Saves a value with a given path and saves the change to XML file
     *
     * @param string $path Slash delimited path to the value
     * @param mixed $value Value to be saved
     * @return array Array of changed value and/or error messages
     */
    public function saveValueByPath($path, $value)
    {
        $site_template_settings = $this->get();
        $path_arr = array_slice(explode('/', $path), 3);
        $value = trim(urldecode($value));

        $ret = array(
            'site' => $this->SITE == '0' ? '' : $this->SITE,
            'path' => $path,
            'value' => $value,
        );

        $this->setValueByPath(
            $site_template_settings,
            implode('/', $path_arr),
            $value
        );

        $this->array2xmlFile($site_template_settings, $this->XML_FILE, $this->ROOT_ELEMENT);

        return $ret;
    }
}
